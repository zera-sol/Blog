const fs = require('fs');
const postModel = require('../Models/postModel');
const jwt = require('jsonwebtoken');
const User = require('../Models/userModel');
const mongoose = require('mongoose');
const SECRET_KEY = process.env.SECRET_KEY;
const cloudinary = require('cloudinary').v2;

//let's configure cloudinary
cloudinary.config({ 
  cloud_name: 'drejxqxpo', 
  api_key: '359519888514928', 
  api_secret: 'XPkFZN-kOF_xT7CQNAxi6niGt4o' // Click 'View API Keys' above to copy your API secret
});

const createPost = async (req, res) => {
  try {
    // Ensure MongoDB connection
    if (!mongoose.connection.readyState) {
      await mongoose.connect(`mongodb+srv://zedomanwithjesu1994:n0wBmb3UWKm5Bs7N@blog-db.qdksl.mongodb.net/?retryWrites=true&w=majority&appName=blog-db`);
    }

    const { title, summary, fullText } = req.body;
    const image = req.file; // Multer stores the single uploaded file in req.file

    if (!image) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    // Upload the image to Cloudinary
    const result = await cloudinary.uploader.upload_stream({ 
      folder: 'blog_images', 
      resource_type: 'auto' 
    }, (error, uploadResult) => {
      if (error) {
        throw new Error('Image upload failed');
      }
      return uploadResult;
    }).end(image.buffer);

    // Check token
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: 'Authentication token missing' });
    }

    const decoded = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create the post
    const postData = await postModel.create({
      title,
      summary,
      fullText,
      image: result.secure_url,  // Use secure URL from Cloudinary
      author: user._id
    });

    res.status(201).json({ message: 'Post created successfully!', postData });
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ error: error.message });
  }
};




  const displayPosts = async (req, res) => {
    try {
      // Ensure MongoDB connection is established (reconnect if necessary)
      if (!mongoose.connection.readyState ) {
        await mongoose.connect(`mongodb+srv://zedomanwithjesu1994:n0wBmb3UWKm5Bs7N@blog-db.qdksl.mongodb.net/?retryWrites=true&w=majority&appName=blog-db`, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
      }
  
      const posts = await postModel.find()
        .populate('author', ['name'])
        .sort({ createdAt: -1 })
        .limit(20);
  
      if (!posts || posts.length === 0) {
        return res.status(404).json({ error: 'No posts found' });
      }
  
      res.status(200).json(posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).json({ error: `${error}} -> Server error. Please try again later.` });
    }
  };

const displayPost = async (req, res) => {
  const token = req.cookies.token;
  const decoded = token? jwt.verify(token, SECRET_KEY): "";
  let userLoggedin = token? await User.findById(decoded.id) : "";  
  const { id } = req.params;
  const postData = await postModel.findById(id).populate('author', ['name']);
  const responseData = {
    ...postData._doc,
    userId: userLoggedin._id,
    userName: userLoggedin.name,
    usrEmail: userLoggedin.email 
  }
  if(!postData) {
    throw new Error('An error occurred while retrieving the post');
  }
    res.json(responseData);
}

const editPost = async (req, res) => {
  const token = req.cookies.token;
  const decoded = jwt.verify(token, SECRET_KEY);
  const userLoggedin = token ? await User.findById(decoded.id) : "";
  const { postId, title, summary, fullText } = req.body;
  const image = req.file;

  // Rename the file
  const { originalname, path } = image;
  const extension = originalname.split('.').pop();
  const newFileName = `${path}.${extension}`;
  fs.renameSync(path, newFileName);

  // Find the post first
  const post = await postModel.findById(postId);

  // Check if the user is the author of the post
  if (userLoggedin._id.toString() !== post.author.toString()) {
    return res.status(401).json({ message: 'You are not authorized to edit this post' });
  }

  try {
    // Find the post by ID and update it with the new data
    const updatedPost = await postModel.findByIdAndUpdate(
      postId,
      {
        $set: {
          title: title,
          summary: summary,
          image: newFileName,
          fullText: fullText,
        },
      },
      { new: true } // Return the updated document
    );

    if (!updatedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json({
      user: userLoggedin,
      message: 'Post updated successfully',
      post: updatedPost,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deletePost = async(req, res) => {
  const { id } = req.params;
   try{
    // let's find and dlete
    const deletedPost = await postModel.findByIdAndDelete(id);
    if(!deletedPost){
      return res.status(404).json({message: "Post not Found!"})
    }
    res.status(200).json({
      message: `A post is deleted successfully!`,
      deletedPost
    })
   }catch(error){
    console.error(error);
    res.status(500).json({ message: 'Server error' });
   }
}
// export all functions to route
module.exports = {
    createPost,
    displayPosts,
    displayPost,
    editPost,
    deletePost,
}
import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import 'react-quill/dist/quill.snow.css'; // Import styles for react-quill
import './CreatePost.css';

const EditPost = () => {
  const [post, setPost] = useState({});
  const [formData, setFormData] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

useEffect(() => {
  const fetchPostData = async () => {
    try {
      const res = await fetch(`https://blog-api-delta-smoky.vercel.app/posts/${id}`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await res.json();
      console.log('Fetched data:', data); // Check if this prints correctly
      setFormData({
        title: data.title || '',
        summary: data.summary || '',
        image: null,
        fullText: data.fullText || '',
      });
      setPost(data);
    } catch (error) {
      console.log(error);
    }
  };

  fetchPostData();
}, [id]);

  const showError =  {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined
  }

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleQuillChange = (content) => {
    setFormData({ ...formData, fullText: content });
  };

  const modules = {
    toolbar: [
      [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video', 'color', 'background', 'align'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const form = new FormData();
    form.append('postId', id);
    form.append('title', formData?.title);
    form.append('summary', formData?.summary);
    form.append('image', formData?.image);
    form.append('fullText', formData?.fullText);
  
    try {
      const response = await fetch('https://blog-api-delta-smoky.vercel.app/posts/edit-post', {
        method: 'PUT',
        body: form,
        credentials: 'include',
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      navigate('/');
      toast.success('Post Edited successfully!');
    } catch (error) {
      toast.error(`Error: ${error.message}` || 'Something went wrong!', showError);
    }
  };

  if(post.author?._id !== post.userId) {
    navigate('/');
  }else{
        return (
            <div className="create-post-container">
            <ToastContainer />
            <h2>Edit your post</h2>
            <form onSubmit={handleSubmit} className="create-post-form">
                <div className="form-group">
                <label htmlFor="title">Title:</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData?.title} // Ensure it’s always a string
                    onChange={handleChange}
                />
                </div>
                <div className="form-group">
                <label htmlFor="summary">Summary:</label>
                <textarea
                    id="summary"
                    name="summary"
                    value={formData?.summary} // Ensure it’s always a string
                    onChange={handleChange}
                />
                </div>
                <div className="form-group">
                <img src={`https://blog-api-delta-smoky.vercel.app/${post.image}`} alt="blog" height="100" width="100"/>
                <label htmlFor="image">Image:</label>
                <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                />
                </div>
                <div className="form-group">
                <label htmlFor="fullText">Full Text:</label>
                <ReactQuill
                    modules={modules}
                    formats={formats}
                    value={formData?.fullText}
                    onChange={handleQuillChange}
                    theme="snow"
                />
                </div>
                <button type="submit" className="submit-button">Edit Post</button>
            </form>
            </div>
        )
 };
};

export default EditPost;

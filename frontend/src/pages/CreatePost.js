import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import { ToastContainer, toast } from 'react-toastify';
import {useNavigate} from 'react-router-dom';
import zeraServer from '../backendUrl';
import 'react-toastify/dist/ReactToastify.css';
import 'react-quill/dist/quill.snow.css'; // Import styles for react-quill
import './CreatePost.css';

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    image: null,
    fullText: '',
  });
  const navigate = useNavigate();
  // toastifer to show error messages
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
      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'align': [] }],
      ['link', 'image', 'video'],                      // add link and image options
      ['clean']                                         // remove formatting button
    ],
  };

  // Define the formats you want to allow
  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video', 'color', 'background', 'align'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Create a new FormData object
    const form = new FormData();
    console.log(form)
    form.append('title', formData.title);
    form.append('summary', formData.summary);
    form.append('image', formData.image);
    form.append('fullText', formData.fullText);
  
    try {
      const response = await fetch(`${zeraServer}/posts/create-post`, {
        method: 'POST',
        body: form,
        credentials: 'include',
      });
       const data = await response.json();
       console.log(data)
      if (!response.ok) {
        throw new Error(data.message);
      }

      console.log('Success:', data);
      navigate('/');
      
      toast.success('Post created successfully!');
    } catch (error) {
      toast.error(`Error: ${error.message}` || 'Something went wrong!', showError);
    }
  };
  

  return (
    <div className="create-post-container">
      <ToastContainer />
      <h2>Create a New Post</h2>
      <form onSubmit={handleSubmit} className="create-post-form">
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            max={25}
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="summary">Summary:</label>
          <textarea
            id="summary"
            name="summary"
            maxLength={100}
            value={formData.summary}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="image">Image:</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="fullText">Full Text:</label>
          <ReactQuill
            modules={modules}
            formats={formats}
            value={formData.fullText}
            onChange={handleQuillChange}
            theme="snow"
            required
          />
        </div>
        <button type="submit" className="submit-button">Create Post</button>
      </form>
    </div>
  );
};

export default CreatePost;

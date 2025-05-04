import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import blogService from '../services/blogService';
// eslint-disable-next-line no-unused-vars
import LoadingSpinner from './LoadingSpinner';

const CreatePost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: ''
  });
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [backgroundPreview, setBackgroundPreview] = useState('');
  const fileInputRef = useRef(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleEditorChange = (content) => {
    setFormData({
      ...formData,
      content: content
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    // Check file type
    if (!file.type.match('image.*')) {
      setError('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setBackgroundImage(event.target.result);
      setBackgroundPreview(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setBackgroundImage(null);
    setBackgroundPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate inputs
      if (!formData.title.trim()) {
        setError('Title is required');
        setLoading(false);
        return;
      }

      if (!formData.content.trim()) {
        setError('Content is required');
        setLoading(false);
        return;
      }
      
      // Process tags
      const tagsArray = formData.tags
        ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
        : [];

      const postData = {
        title: formData.title,
        content: formData.content,
        tags: tagsArray
      };
      
      // Add background image if exists
      if (backgroundImage) {
        postData.backgroundImage = backgroundImage;
      }
      
      console.log('Submitting post data:', postData);

      const response = await blogService.createPost(postData);
      console.log('Create post response:', response);
      
      setSuccess(true);
      
      // Redirect after short delay to show success message
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      console.error('Error creating post:', err);
      if (err.response && err.response.data) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Server error data:', err.response.data);
        console.error('Server error status:', err.response.status);
        setError(`Server error: ${err.response.data.error || err.response.statusText || 'Unknown error'}`);
      } else if (err.request) {
        // The request was made but no response was received
        console.error('No response received:', err.request);
        setError('No response from server. Check your connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Request setup error:', err.message);
        setError(`Error: ${err.message || 'Unknown error'}`);
      }
      setLoading(false);
    }
  };

  // Rich text editor toolbar options
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link', 'blockquote', 'code-block'],
      [{ 'color': [] }, { 'background': [] }],
      ['clean']
    ],
  };

  if (success) {
    return (
      <div className="container mt-4">
        <div className="alert alert-success">
          <h4 className="alert-heading">Post Created Successfully!</h4>
          <p>Your post has been created. Redirecting to the home page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="glass-container">
        <div className="card border-0">
          <div className="card-header bg-primary text-white">
            <h2 className="mb-0">Create New Post</h2>
          </div>
          <div className="card-body">
            {error && <div className="alert alert-danger">{error}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="title" className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="backgroundImage" className="form-label">
                  Background Image (Optional)
                </label>
                <div className="d-flex align-items-center mb-2">
                  <input
                    type="file"
                    className="form-control"
                    id="backgroundImage"
                    accept="image/*"
                    onChange={handleImageChange}
                    ref={fileInputRef}
                  />
                  {backgroundImage && (
                    <button 
                      type="button" 
                      className="btn btn-outline-danger ms-2"
                      onClick={removeImage}
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="form-text">
                  Upload an image to be displayed as the post's header (Max size: 5MB)
                </div>
                
                {backgroundPreview && (
                  <div className="mt-3 mb-3">
                    <p className="form-label">Image Preview:</p>
                    <div className="border p-2">
                      <img 
                        src={backgroundPreview}
                        alt="Background preview" 
                        className="img-fluid"
                        style={{ maxHeight: '200px' }} 
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mb-3">
                <label htmlFor="content" className="form-label">Content</label>
                <ReactQuill
                  theme="snow"
                  value={formData.content}
                  onChange={handleEditorChange}
                  modules={modules}
                  className="mb-4 pb-4"
                  style={{ height: '250px', marginBottom: '50px' }}
                />
                <div className="form-text text-muted">
                  Min height: 50px. Use the formatting tools to style your content.
                </div>
              </div>
              
              <div className="mb-3 mt-5">
                <label htmlFor="tags" className="form-label">Tags (comma-separated)</label>
                <input
                  type="text"
                  className="form-control"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="e.g. technology, programming, web development"
                />
                <div className="form-text">Add relevant tags to help others find your post</div>
              </div>
              
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Creating...
                  </>
                ) : 'Create Post'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost; 
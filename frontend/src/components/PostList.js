import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import blogService from '../services/blogService';
import LoadingSpinner from './LoadingSpinner';

// Array of image paths for post backgrounds
const postBackgroundImages = [
  '/image/pexels-davidmceachan-91414.jpg',
  '/image/pexels-markusspiske-1089438.jpg',
  '/image/pexels-timo-volz-837240-1717862.jpg',
  '/image/pexels-zeeshaanshabbir-12907890.jpg'
];

const PostList = () => {
  const location = useLocation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Check for success message in location state
    if (location.state && location.state.message) {
      setSuccessMessage(location.state.message);
      
      // Clear the location state after displaying message
      window.history.replaceState({}, document.title);
      
      // Auto-hide the message after 5 seconds
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        console.log('Fetching posts...');
        const response = await blogService.getAllPosts();
        console.log('Posts response:', response.data);
        setPosts(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching posts:', err);
        let errorMessage = 'Failed to fetch posts. Please try again later.';
        
        if (err.response) {
          console.error('Server error:', err.response.status, err.response.data);
          errorMessage = `Server error (${err.response.status}): ${
            err.response.data && err.response.data.error ? 
            err.response.data.error : 'Unknown error'
          }`;
        } else if (err.request) {
          console.error('No response received:', err.request);
          errorMessage = 'No response from server. The API may be down or you may have connection issues.';
        } else {
          console.error('Request error:', err.message);
          errorMessage = `Error: ${err.message}`;
        }
        
        setError(errorMessage);
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredPosts = posts.filter(post => {
    return post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
           post.content.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Function to get a background image for a post
  const getPostImage = (postId) => {
    // Use post ID to select an image, but wrap around if we have more posts than images
    const imageIndex = (postId - 1) % postBackgroundImages.length;
    return postBackgroundImages[imageIndex];
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {successMessage && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <i className="bi bi-check-circle-fill me-2"></i>
          {successMessage}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setSuccessMessage('')}
            aria-label="Close"
          ></button>
        </div>
      )}
      
      <div className="glass-container mb-4">
        <div className="row mb-4">
          <div className="col-md-6">
            <h2 className="mb-0">All Blog Posts</h2>
          </div>
          <div className="col-md-6">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <button 
                className="btn btn-outline-secondary" 
                type="button"
                onClick={() => setSearchTerm('')}
                disabled={!searchTerm}
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="alert alert-info">
            {searchTerm 
              ? 'No posts match your search. Try a different search term.' 
              : 'No posts found. Create your first post!'}
          </div>
        ) : (
          <div className="row">
            {filteredPosts.map(post => (
              <div className="col-md-4 mb-4" key={post.id}>
                <div className="card h-100 border-0 shadow">
                  <div className="position-relative overflow-hidden">
                    <img 
                      src={post.backgroundImage || getPostImage(post.id)} 
                      className="post-image" 
                      alt={post.title}
                    />
                  </div>
                  <div className="card-body d-flex flex-column p-4">
                    <h5 className="card-title">{post.title}</h5>
                    <div 
                      className="card-text flex-grow-1 post-preview"
                      dangerouslySetInnerHTML={{ 
                        __html: post.content.length > 150 
                          ? post.content.substring(0, 150) + '...' 
                          : post.content 
                      }}
                    />
                    <div className="mt-auto d-flex justify-content-between">
                      <Link to={`/post/${post.id}`} className="btn btn-primary">
                        Read More
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostList; 
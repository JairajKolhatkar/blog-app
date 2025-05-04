import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import blogService from '../services/blogService';
import LoadingSpinner from './LoadingSpinner';

// Array of image paths for post backgrounds (same as in PostList)
const postBackgroundImages = [
  '/image/pexels-davidmceachan-91414.jpg',
  '/image/pexels-markusspiske-1089438.jpg',
  '/image/pexels-timo-volz-837240-1717862.jpg',
  '/image/pexels-zeeshaanshabbir-12907890.jpg'
];

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await blogService.getPost(id);
        setPost(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch post. It may not exist or there was a server error.');
        setLoading(false);
        console.error(err);
      }
    };
    
    fetchPost();
  }, [id]);

  // Function to get a background image for a post
  const getPostImage = (postId) => {
    // Use post ID to select an image, but wrap around if we have more posts than images
    const imageIndex = (postId - 1) % postBackgroundImages.length;
    return postBackgroundImages[imageIndex];
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteError(null);
  };

  const confirmDelete = async () => {
    setDeleteLoading(true);
    setDeleteError(null);
    
    try {
      await blogService.deletePost(id);
      // Redirect to home page after successful deletion
      navigate('/', { state: { message: `Post "${post.title}" deleted successfully` } });
    } catch (err) {
      console.error('Error deleting post:', err);
      setDeleteError('Failed to delete post. Please try again later.');
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <Link to="/" className="btn btn-primary">Back to Posts</Link>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="glass-container">
        <div className="card shadow-sm border-0">
          <div className="position-relative">
            <img 
              src={post.backgroundImage || getPostImage(parseInt(id))} 
              className="card-img-top" 
              alt={post.title}
            />
          </div>
          <div className="card-body p-4">
            <h1 className="card-title display-5 mb-4">{post.title}</h1>
            
            <div className="mb-4">
              {post.tags && post.tags.length > 0 && (
                <div className="mb-3">
                  {post.tags.map((tag, index) => (
                    <Link key={index} to={`/tags/${tag}`} className="badge bg-primary me-1 text-decoration-none">
                      #{tag}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            
            <div 
              className="card-text blog-content" 
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            
            <div className="d-flex justify-content-between mt-4">
              <Link to="/" className="btn btn-outline-primary">
                Back to Posts
              </Link>
              
              <div>
                <Link to="/create" className="btn btn-success me-2">
                  Create New Post
                </Link>
                <button 
                  onClick={handleDeleteClick} 
                  className="btn btn-danger"
                >
                  Delete Post
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">Confirm Delete</h5>
                <button type="button" className="btn-close btn-close-white" onClick={closeDeleteModal} disabled={deleteLoading}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete the post "<strong>{post.title}</strong>"?</p>
                <p className="text-danger"><small>This action cannot be undone.</small></p>
                {deleteError && (
                  <div className="alert alert-danger mt-3" role="alert">
                    {deleteError}
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeDeleteModal} disabled={deleteLoading}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={confirmDelete} disabled={deleteLoading}>
                  {deleteLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Deleting...
                    </>
                  ) : 'Delete Post'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetail; 
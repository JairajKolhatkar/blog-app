import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import blogService from '../services/blogService';

const TagPosts = () => {
  const { tagName } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPostsByTag = async () => {
      try {
        const response = await blogService.getPostsByTag(tagName);
        setPosts(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch posts for this tag. Please try again later.');
        setLoading(false);
        console.error(err);
      }
    };
    
    fetchPostsByTag();
  }, [tagName]);

  if (loading) {
    return <div className="container mt-4"><p>Loading posts...</p></div>;
  }

  if (error) {
    return <div className="container mt-4"><p className="text-danger">{error}</p></div>;
  }

  return (
    <div className="container mt-4">
      <h2>Posts tagged with "{tagName}"</h2>
      {posts.length === 0 ? (
        <p>No posts found with this tag.</p>
      ) : (
        <div className="row">
          {posts.map(post => (
            <div className="col-md-4 mb-4" key={post.id}>
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{post.title}</h5>
                  <p className="card-text">{post.content.substring(0, 100)}...</p>
                  <Link to={`/post/${post.id}`} className="btn btn-primary">
                    Read More
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <Link to="/tags" className="btn btn-secondary mt-3">Back to Tags</Link>
    </div>
  );
};

export default TagPosts; 
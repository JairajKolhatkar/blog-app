import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import blogService from '../services/blogService';

const TagsList = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await blogService.getAllTags();
        setTags(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch tags. Please try again later.');
        setLoading(false);
        console.error(err);
      }
    };
    
    fetchTags();
  }, []);

  if (loading) {
    return <div className="container mt-4"><p>Loading tags...</p></div>;
  }

  if (error) {
    return <div className="container mt-4"><p className="text-danger">{error}</p></div>;
  }

  return (
    <div className="container mt-4">
      <h2>All Tags</h2>
      {tags.length === 0 ? (
        <p>No tags found. Create a post with tags!</p>
      ) : (
        <div className="row">
          {tags.map(tag => (
            <div className="col-md-3 col-sm-6 mb-3" key={tag.id}>
              <div className="card h-100">
                <div className="card-body d-flex flex-column justify-content-between">
                  <h5 className="card-title">{tag.name}</h5>
                  <Link to={`/tags/${tag.name}`} className="btn btn-sm btn-outline-primary mt-2">
                    View Posts
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagsList; 
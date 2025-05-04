/**
 * Blog Application Service
 * Created by: Jairaj Kolhatkar
 * This service handles all API calls to the backend
 */

import axios from 'axios';

// Create axios instance with proper configuration
const api = axios.create({
  baseURL: 'http://127.0.0.1:5000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 30000, // 30 seconds timeout
  withCredentials: false // Important for CORS
});

// Add a request interceptor for debugging
api.interceptors.request.use(
  config => {
    console.log('Request being sent:', config.method.toUpperCase(), config.url);
    return config;
  },
  error => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor for debugging
api.interceptors.response.use(
  response => {
    console.log('Response received:', response.status, response.statusText);
    return response;
  },
  error => {
    console.error('Response error:', error.message);
    return Promise.reject(error);
  }
);

class BlogService {
  // Get all posts
  getAllPosts() {
    return api.get('/posts');
  }

  // Get post by ID
  getPost(id) {
    return api.get(`/posts/${id}`);
  }

  // Create a new post
  createPost(post) {
    console.log('Creating post:', post);
    return api.post('/posts', post);
  }

  // Delete a post
  deletePost(id) {
    console.log('Deleting post with ID:', id);
    return api.delete(`/posts/${id}`);
  }

  // Get all tags
  getAllTags() {
    return api.get('/tags');
  }

  // Search posts by tag
  getPostsByTag(tagName) {
    return api.get(`/posts/tag/${tagName}`);
  }
}

// Create an instance of the service
const blogService = new BlogService();

export default blogService; 
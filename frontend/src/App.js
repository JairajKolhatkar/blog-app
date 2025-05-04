import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Header from './components/Header';
import PostList from './components/PostList';
import PostDetail from './components/PostDetail';
import CreatePost from './components/CreatePost';
import TagsList from './components/TagsList';
import TagPosts from './components/TagPosts';

function App() {
  return (
    <Router>
      <div className="App d-flex flex-column min-vh-100">
        <div className="app-container">
          <Header />
          <div className="container py-4">
            <main className="flex-grow-1">
              <Routes>
                <Route path="/" element={<PostList />} />
                <Route path="/post/:id" element={<PostDetail />} />
                <Route path="/create" element={<CreatePost />} />
                <Route path="/tags" element={<TagsList />} />
                <Route path="/tags/:tagName" element={<TagPosts />} />
              </Routes>
            </main>
          </div>
        </div>
        <footer className="bg-dark text-white text-center p-3 mt-auto">
          <div className="container">
            <p className="mb-0">
              <img src="/image/icon.jpg" alt="Blog Logo" className="blog-logo" style={{width: '25px', height: '25px', borderRadius: '50%'}} />
              © {new Date().getFullYear()} Blog Application. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App; 
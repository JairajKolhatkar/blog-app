import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);
  
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top" style={{ background: 'linear-gradient(to right, #343a40, #1a1e21)' }}>
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src="/image/icon.jpg" alt="Blog Logo" className="blog-logo" style={{borderRadius: '50%', border: '2px solid white'}} />
          <span className="ms-2 fw-bold">Blog Application</span>
        </Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={handleNavCollapse}
          aria-expanded={!isNavCollapsed}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className={`nav-item ${isActive('/')}`}>
              <Link className="nav-link" to="/">
                <i className="bi bi-house-door me-1"></i> Home
              </Link>
            </li>
            <li className={`nav-item ${isActive('/create')}`}>
              <Link className="nav-link" to="/create">
                <i className="bi bi-plus-circle me-1"></i> Create Post
              </Link>
            </li>
            <li className={`nav-item ${isActive('/tags')}`}>
              <Link className="nav-link" to="/tags">
                <i className="bi bi-tags me-1"></i> Tags
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header; 
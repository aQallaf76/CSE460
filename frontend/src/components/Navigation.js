import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Navigation.css';

const Navigation = ({ user, onLogout }) => {
  const location = useLocation();

  const getNavLinks = () => {
    const links = [
      { path: '/menu', label: '🍽️ Menu', roles: ['customer', 'worker', 'manager'] },
      { path: '/order', label: '🛒 Order', roles: ['customer', 'worker', 'manager'] },
      { path: '/tracking', label: '📋 Track Orders', roles: ['customer', 'worker', 'manager'] }
    ];

    // Add role-specific links
    if (user?.role === 'worker' || user?.role === 'manager') {
      links.push({ path: '/kitchen', label: '👨‍🍳 Kitchen', roles: ['worker', 'manager'] });
    }

    if (user?.role === 'manager') {
      links.push({ path: '/admin', label: '📊 Admin', roles: ['manager'] });
    }

    return links;
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/menu" className="nav-brand-link">
            <span className="brand-icon">🍽️</span>
            <span className="brand-text">Sundevil Cafeteria</span>
          </Link>
        </div>

        <div className="nav-links">
          {getNavLinks().map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="nav-user">
          <span className="user-info">
            Welcome, {user?.name} ({user?.role})
          </span>
          <button onClick={onLogout} className="logout-btn">
            🚪 Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 
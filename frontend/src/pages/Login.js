import React, { useState } from 'react';
import '../styles/Login.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }

    // Mock authentication - in real app this would call backend
    const success = onLogin(username, password);
    if (!success) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">🍽️</div>
          <h1>Sundevil Cafeteria</h1>
          <p>Online Ordering System</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Sign In
          </button>
        </form>

        <div className="login-info">
          <h3>Test Accounts</h3>
          <div className="test-accounts">
            <div className="account-info">
              <strong>Manager:</strong> manager / Admin789
            </div>
            <div className="account-info">
              <strong>Worker:</strong> worker / Kitchen456
            </div>
            <div className="account-info">
              <strong>Customer:</strong> customer / CustomerPass123
            </div>
          </div>
        </div>

        <div className="asu-info">
          <p>Arizona State University</p>
          <p>CSE460 - Software Analysis and Design</p>
        </div>
      </div>
    </div>
  );
};

export default Login; 
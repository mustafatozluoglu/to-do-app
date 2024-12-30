import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../styles/Auth.css';

function Login({ onLogin, onSwitchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        onLogin(data);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Failed to connect to server');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Login to Todo App</h2>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              required
            />
          </div>
          <button type="submit" className="auth-button">Login</button>
        </form>
        <p className="auth-switch">
          Don't have an account?{' '}
          <button onClick={onSwitchToRegister} className="switch-button">
            Register
          </button>
        </p>
      </div>
    </div>
  );
}

Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
  onSwitchToRegister: PropTypes.func.isRequired,
};

export default Login;

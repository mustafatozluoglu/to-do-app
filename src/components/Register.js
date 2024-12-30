import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../styles/Auth.css';

function Register({ onRegister, onSwitchToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [validations, setValidations] = useState({
    name: true,
    email: true,
    password: true,
    passwordMatch: true
  });

  // Validation rules
  const validateForm = () => {
    const newValidations = {
      name: name.trim().length > 0,
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
      password: password.length >= 6,
      passwordMatch: password === confirmPassword
    };
    setValidations(newValidations);
    return Object.values(newValidations).every(v => v);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError('Please fix the validation errors');
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        onRegister(data);
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Failed to connect to server');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Create Account</h2>
        {error && <div className="auth-error">{error}</div>}
        
        <div className="validation-info">
          <h3>Requirements:</h3>
          <ul>
            <li className={validations.name ? 'valid' : 'invalid'}>
              Name is required
            </li>
            <li className={validations.email ? 'valid' : 'invalid'}>
              Valid email address
            </li>
            <li className={validations.password ? 'valid' : 'invalid'}>
              Password must be at least 6 characters
            </li>
            <li className={validations.passwordMatch ? 'valid' : 'invalid'}>
              Passwords must match
            </li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={!validations.name && name.length > 0 ? 'invalid' : ''}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={!validations.email && email.length > 0 ? 'invalid' : ''}
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
              className={!validations.password && password.length > 0 ? 'invalid' : ''}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={!validations.passwordMatch && confirmPassword.length > 0 ? 'invalid' : ''}
              required
            />
          </div>

          <button type="submit" className="auth-button">Register</button>
        </form>

        <p className="auth-switch">
          Already have an account?{' '}
          <button onClick={onSwitchToLogin}>Login</button>
        </p>
      </div>
    </div>
  );
}

Register.propTypes = {
  onRegister: PropTypes.func.isRequired,
  onSwitchToLogin: PropTypes.func.isRequired,
};

export default Register;

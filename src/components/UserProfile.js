import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../styles/UserProfile.css';

function UserProfile({ onLogout, onBack }) {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setName(userData.name);
      }
    } catch (err) {
      setError('Failed to load profile');
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ name }),
      });

      if (response.ok) {
        setUser({ ...user, name });
        setIsEditing(false);
        setMessage('Profile updated successfully');
        setTimeout(() => setMessage(''), 3000);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to update profile');
      }
    } catch (err) {
      setError('Failed to connect to server');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    onLogout();
  };

  if (!user) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <button className="back-button" onClick={onBack}>← Back to Home</button>
        <h2>User Profile</h2>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {message && <div className="success-message">{message}</div>}

      {user && (
        <div className="profile-content">
          {isEditing ? (
            <form onSubmit={handleUpdateProfile} className="profile-form">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="profile-actions">
                <button type="submit" className="save-button">
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setName(user.name);
                  }}
                  className="cancel-button"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-info">
              <div className="info-group">
                <label>Name</label>
                <p>{user.name}</p>
              </div>
              <div className="info-group">
                <label>Email</label>
                <p>{user.email}</p>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="edit-button"
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

UserProfile.propTypes = {
  onLogout: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default UserProfile;

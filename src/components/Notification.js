import React from 'react';

function Notification({ message, onClose }) {
  return message ? (
    <div className="notification-container">
      <div className="notification">
        <div className="notification-content">
          <i className="fas fa-exclamation-circle"></i>
          <span>{message}</span>
        </div>
        <button className="notification-close" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
      </div>
    </div>
  ) : null;
}

export default Notification; 
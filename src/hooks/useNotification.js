import { useState, useCallback } from 'react';
import { NOTIFICATION_DURATION } from '../constants';

function useNotification() {
  const [notification, setNotification] = useState('');

  const showNotification = useCallback((message) => {
    // Reset notification if one is already showing
    if (notification) {
      setNotification('');
      setTimeout(() => setNotification(message), 100);
    } else {
      setNotification(message);
    }

    // Auto-hide notification after duration
    setTimeout(() => {
      setNotification('');
    }, NOTIFICATION_DURATION);
  }, [notification]);

  return {
    notification,
    showNotification,
    clearNotification: () => setNotification('')
  };
}

export default useNotification; 
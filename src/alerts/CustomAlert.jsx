import React, { useEffect } from 'react';
import './CustomAlert.css'; // Import CSS for styling

const CustomAlert = ({ message, type, onClose }) => {
  useEffect(() => {
    // Automatically close the alert after 3 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer); // Cleanup timer
  }, [onClose]);

  return (
    <div className={`custom-alert ${type}`}>
      <span>{message}</span>
      <button onClick={onClose} className="close-btn">
        &times;
      </button>
    </div>
  );
};

export default CustomAlert;
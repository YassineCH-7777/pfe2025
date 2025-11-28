// src/components/LoadingSpinner/LoadingSpinner.jsx
import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = () => {
  return (
    <div className="loading-overlay">
      <div className="loading-spinner">
        <div className="loading-circle"></div>
        <div className="loading-text">Chargement en cours...</div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
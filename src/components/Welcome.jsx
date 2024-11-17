import React from 'react';
import './Welcome.css';

const Welcome = () => {
  return (
    <div className="welcome-container">
      <h1>Welcome!</h1>
      <p>Initializing backend communication...</p>
      <div className="loader"></div>
    </div>
  );
};

export default Welcome;
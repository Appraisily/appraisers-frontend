// src/Welcome.js

import React from 'react';
import './Welcome.css'; // Optional: For styling

function Welcome() {
  return (
    <div className="welcome-container">
      <h1>Welcome!</h1>
      <p>Initializing backend communication...</p>
      <div className="loader"></div> {/* Optional: A loader animation */}
    </div>
  );
}

export default Welcome;

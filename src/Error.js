// src/Error.js

import React from 'react';
import './Error.css'; // Optional: For styling

function Error({ message }) {
  return (
    <div className="error-container">
      <h1>Oops!</h1>
      <p>{message}</p>
    </div>
  );
}

export default Error;

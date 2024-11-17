import React from 'react';
import { Link } from 'react-router-dom';
import './BackButton.css';

const BackButton = () => {
  return (
    <Link to="/" className="back-button">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
      Back to Dashboard
    </Link>
  );
};

export default BackButton;
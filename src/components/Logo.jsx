import React from 'react';
import './Logo.css';

const Logo = ({ size = 'small' }) => {
  // Define sizes in pixels for different contexts
  const sizes = {
    small: 32,    // Header/Dashboard
    medium: 48,   // Login page
    large: 64    // Other contexts
  };

  const pixelSize = sizes[size] || sizes.small;
  
  // Use ImageKit transformations
  // tr=w-{width},h-{height} for exact dimensions
  // q-90 for quality
  const imageUrl = `https://ik.imagekit.io/appraisily/WebPage/logo.JPG?tr=w-${pixelSize},h-${pixelSize},q-90`;

  return (
    <div className={`logo logo-${size}`}>
      <a href="https://www.appraisily.com/" target="_blank" rel="noopener noreferrer">
        <img 
          src={imageUrl}
          alt="Appraisily Logo"
          className="logo-image"
          width={pixelSize}
          height={pixelSize}
          style={{ width: `${pixelSize}px`, height: `${pixelSize}px` }}
        />
      </a>
    </div>
  );
};

export default Logo;
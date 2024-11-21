import React from 'react';
import './Logo.css';

const Logo = ({ size = 'small' }) => {
  const sizes = {
    small: 32,
    medium: 48,
    large: 64
  };

  const pixelSize = sizes[size] || sizes.small;
  const imageUrl = `https://ik.imagekit.io/appraisily/WebPage/logo_new.png?tr=w-${pixelSize},h-${pixelSize},q-90`;

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
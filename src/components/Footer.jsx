import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <div className="footer">
      © {currentYear} Appraisily. All rights reserved.
    </div>
  );
};

export default Footer;
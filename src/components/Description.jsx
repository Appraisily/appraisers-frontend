import React from 'react';
import './Description.css';

const Description = ({ customerDescription, iaDescription }) => {
  return (
    <div className="descriptions-container">
      <div id="customer-description">
        <div className="description-title">Customer Description:</div>
        <div className="description-text">
          {customerDescription || 'Not available'}
        </div>
      </div>

      <div id="ia-description">
        <div className="description-title">AI Description:</div>
        <div className="description-text">
          {iaDescription || 'Not available'}
        </div>
      </div>
    </div>
  );
};

export default Description;
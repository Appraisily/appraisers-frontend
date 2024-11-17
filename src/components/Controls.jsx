import React from 'react';
import './Controls.css';

const Controls = ({ onPendingClick, onCompletedClick, onSearch, onRefresh, isRefreshing }) => {
  return (
    <div className="controls-container">
      <div className="buttons-container">
        <button className="pending" onClick={onPendingClick}>
          Pending
        </button>
        <button className="completed" onClick={onCompletedClick}>
          Completed
        </button>
        <button 
          className={`refresh-button ${isRefreshing ? 'spinning' : ''}`}
          onClick={onRefresh}
          disabled={isRefreshing}
          aria-label="Refresh appraisals list"
          title="Refresh list"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3"/>
          </svg>
        </button>
      </div>
      <div className="search-container">
        <input
          type="text"
          id="search-input"
          placeholder="Search..."
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Controls;
import React from 'react';
import './AppraisalsTable.css';

const AppraisalsTable = ({ appraisals, currentAppraisalType, onActionClick }) => {
  if (!appraisals || appraisals.length === 0) {
    return (
      <div className="no-appraisals">
        <p>No {currentAppraisalType} appraisals found.</p>
      </div>
    );
  }

  const getShortId = (identifier) => {
    if (!identifier) return '';
    const parts = identifier.split('_');
    return parts[parts.length - 1].slice(-8);
  };

  // Sort appraisals by date in descending order (most recent first)
  const sortedAppraisals = [...appraisals].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB - dateA;
  });

  return (
    <div className="table-container">
      <table id="appraisals-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Session ID</th>
            <th>Status</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {sortedAppraisals.map((appraisal) => (
            <tr key={appraisal.id}>
              <td data-label="Date">
                {new Date(appraisal.date).toLocaleDateString()}
              </td>
              <td data-label="Type">{appraisal.appraisalType}</td>
              <td data-label="Session ID" title={appraisal.identifier}>
                {getShortId(appraisal.identifier)}
              </td>
              <td data-label="Status">
                <span className={`status-badge ${appraisal.status.toLowerCase()}`}>
                  {appraisal.status}
                </span>
              </td>
              <td data-label="Description" className="description-cell">
                <div className="description-content" title={appraisal.iaDescription}>
                  {appraisal.iaDescription}
                </div>
              </td>
              <td data-label="Action">
                <button
                  className={`action-button ${currentAppraisalType === 'pending' ? 'complete' : 'edit'}`}
                  onClick={() => onActionClick(appraisal.id, appraisal.wordpressUrl)}
                >
                  {currentAppraisalType === 'pending' ? 'Complete' : 'Edit'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AppraisalsTable;
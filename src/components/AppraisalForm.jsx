import React, { useState } from 'react';
import { completeAppraisal } from '../services/appraisals';
import './AppraisalForm.css';

const AppraisalForm = ({ appraisalId, onSuccess }) => {
  const [appraisalValue, setAppraisalValue] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!appraisalValue || isNaN(appraisalValue) || Number(appraisalValue) <= 0) {
      setError('Please enter a valid positive number for the appraisal value.');
      return;
    }

    if (!description.trim()) {
      setError('Please enter a description.');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const response = await completeAppraisal(
        appraisalId,
        Number(appraisalValue),
        description.trim()
      );

      if (response.success) {
        onSuccess?.();
      } else {
        throw new Error(response.message || 'Failed to submit appraisal');
      }
    } catch (err) {
      console.error('Error submitting appraisal:', err);
      setError(err.response?.data?.message || err.message || 'An error occurred while submitting the appraisal');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="appraisal-form-container">
      <form className="appraisal-form" onSubmit={handleSubmit}>
        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="appraisalValue">Appraisal Value ($)</label>
          <input
            type="number"
            id="appraisalValue"
            value={appraisalValue}
            onChange={(e) => setAppraisalValue(e.target.value)}
            required
            min="0"
            step="0.01"
            placeholder="Enter appraisal value"
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Item Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Enter detailed item description"
            disabled={isSubmitting}
          />
        </div>

        <button 
          type="submit" 
          className="submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Submit Appraisal'}
        </button>
      </form>
    </div>
  );
};

export default AppraisalForm;
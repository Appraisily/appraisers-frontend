import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BackButton from '../components/BackButton';
import UserInfo from '../components/UserInfo';
import LoadingSpinner from '../components/LoadingSpinner';
import AcfFieldsList from '../components/AcfFieldsList';
import { ENDPOINTS } from '../config/endpoints';
import './EditAppraisalPage.css';

const EditAppraisalPage = () => {
  const [searchParams] = useSearchParams();
  const appraisalId = searchParams.get('id');
  const wordpressUrl = searchParams.get('wpUrl');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [appraisalData, setAppraisalData] = useState(null);
  const userName = localStorage.getItem('userName');

  useEffect(() => {
    if (!appraisalId || !wordpressUrl) {
      window.location.href = '/';
      return;
    }
    loadAppraisalDetails();
  }, [appraisalId, wordpressUrl]);

  const loadAppraisalDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        ENDPOINTS.APPRAISALS.DETAILS(appraisalId),
        { withCredentials: true }
      );
      setAppraisalData(response.data);
    } catch (err) {
      console.error('Error fetching appraisal details:', err);
      setError(err.response?.data?.message || 'Error fetching appraisal details');
      if (err.response?.status === 401) {
        window.location.href = '/';
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFieldUpdate = async (fieldName, newValue) => {
    try {
      setLoading(true);
      setError(null);

      const updateData = {
        [fieldName]: newValue
      };

      const response = await axios.post(
        ENDPOINTS.APPRAISALS.SET_VALUE(appraisalId),
        updateData,
        { withCredentials: true }
      );

      if (response.data.success) {
        await loadAppraisalDetails();
      } else {
        throw new Error(response.data.message || 'Error updating field');
      }
    } catch (err) {
      console.error('Error updating field:', err);
      setError(err.message || 'Error updating field');
    } finally {
      setLoading(false);
    }
  };

  if (!appraisalId || !wordpressUrl) {
    return null;
  }

  return (
    <div className="edit-appraisal-page">
      <Header />
      <BackButton />
      <UserInfo userName={userName} />

      <div className="container">
        <h2>Edit Appraisal</h2>

        {loading && <LoadingSpinner message="Processing..." />}
        
        {error && (
          <div className="message error">
            {error}
          </div>
        )}

        {appraisalData && (
          <AcfFieldsList
            acfData={appraisalData.acfFields}
            images={appraisalData.images}
            onFieldUpdate={handleFieldUpdate}
          />
        )}
      </div>

      <Footer />
    </div>
  );
};

export default EditAppraisalPage;
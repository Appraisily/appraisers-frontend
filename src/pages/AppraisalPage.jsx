import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ImageViewer from '../components/ImageViewer';
import AppraisalForm from '../components/AppraisalForm';
import Description from '../components/Description';
import LoadingSpinner from '../components/LoadingSpinner';
import BackButton from '../components/BackButton';
import UserInfo from '../components/UserInfo';
import { ENDPOINTS } from '../config/endpoints';
import './AppraisalPage.css';

const AppraisalPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const appraisalId = searchParams.get('id');
  const [appraisalData, setAppraisalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const userName = localStorage.getItem('userName');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadAppraisalDetails = async () => {
      if (!appraisalId) {
        navigate('/');
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await api.get(ENDPOINTS.APPRAISALS.DETAILS(appraisalId));
        
        if (mounted && response.data) {
          console.log('Raw API response:', response.data);
          setAppraisalData(response.data);
        }
      } catch (err) {
        if (mounted) {
          console.error('Error fetching appraisal details:', err);
          setError(err.message || 'Error fetching appraisal details');
          
          if (err.response?.status === 401) {
            navigate('/');
          }
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadAppraisalDetails();

    return () => {
      mounted = false;
    };
  }, [appraisalId, navigate]);

  const handleSuccess = () => {
    setSuccess('Appraisal submitted successfully. Redirecting to dashboard...');
    setTimeout(() => {
      navigate('/');
    }, 3000);
  };

  if (!appraisalId) return null;

  return (
    <div className="appraisal-page">
      <Header />
      <BackButton />
      <UserInfo userName={userName} />

      <main className="main-content">
        {loading && (
          <LoadingSpinner message="Loading appraisal details..." />
        )}
        
        {error && (
          <div className="message error">
            {error}
          </div>
        )}
        
        {success && (
          <div className="message success">
            {success}
          </div>
        )}

        {!loading && !error && appraisalData && (
          <>
            <Description
              customerDescription={appraisalData.customerDescription}
              iaDescription={appraisalData.iaDescription}
            />

            <ImageViewer images={appraisalData.images} />

            <AppraisalForm 
              appraisalId={appraisalId}
              onSuccess={handleSuccess}
            />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default AppraisalPage;
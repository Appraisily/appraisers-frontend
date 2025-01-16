import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { getBySessionId } from '../services/appraisals';
import LoadingSpinner from '../components/LoadingSpinner';

const DirectAppraisalPage = () => {
  const { sessionId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [redirectUrl, setRedirectUrl] = useState(null);

  useEffect(() => {
    const fetchAppraisal = async () => {
      try {
        console.log('DirectAppraisalPage: Fetching appraisal with sessionId:', sessionId);
        const appraisal = await getBySessionId(sessionId);
        console.log('DirectAppraisalPage: Received appraisal data:', appraisal);

        const params = new URLSearchParams({
          id: appraisal.id,
          wpUrl: appraisal.wordpressUrl || '',
          sessionId: sessionId,
          email: appraisal.customerEmail || '',
          name: appraisal.customerName || ''
        });
        console.log('DirectAppraisalPage: Redirecting to:', `/appraisal?${params.toString()}`);
        setRedirectUrl(`/appraisal?${params.toString()}`);
      } catch (err) {
        console.error('Error fetching appraisal:', err);
        console.error('DirectAppraisalPage: Full error details:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        });
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      fetchAppraisal();
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner message="Loading appraisal..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
          {error}
        </div>
      </div>
    );
  }

  if (redirectUrl) {
    return <Navigate to={redirectUrl} replace />;
  }

  return null;
}

export default DirectAppraisalPage;
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
import { ENDPOINTS } from '../config/endpoints';
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";

const AppraisalPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const appraisalId = searchParams.get('id');
  const [appraisalData, setAppraisalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');

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
    <div className="min-h-screen bg-background">
      <Header />
      <BackButton />

      <main className="container mx-auto px-4 py-8">
        {loading && (
          <LoadingSpinner message="Loading appraisal details..." />
        )}
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50 text-green-700">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {!loading && !error && appraisalData && (
          <div className="space-y-8">
            <Card>
              <CardContent className="p-6">
                <Description
                  customerDescription={appraisalData.customerDescription}
                  iaDescription={appraisalData.iaDescription}
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <ImageViewer images={appraisalData.images} />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <AppraisalForm 
                  appraisalId={appraisalId}
                  onSuccess={handleSuccess}
                />
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default AppraisalPage;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ImageViewer from '../components/ImageViewer';
import AppraisalDetails from '../components/AppraisalDetails';
import AppraisalForm from '../components/AppraisalForm';
import ManualAppraisalForm from '../components/ManualAppraisalForm';
import Description from '../components/Description';
import LoadingSpinner from '../components/LoadingSpinner';
import BackButton from '../components/BackButton';
import { ENDPOINTS } from '../config/endpoints';
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";

const AppraisalPage = () => {
  const { id: appraisalId } = useParams();
  const navigate = useNavigate();
  
  console.log('Appraisal ID from path:', appraisalId);

  const [appraisalData, setAppraisalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showManualForm, setShowManualForm] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Function to check if an appraisal is a bulk type
  const isBulkAppraisal = (appraisal) => {
    if (!appraisal || !appraisal.appraisalType) return false;
    
    // Check if appraisal type matches the Bulk pattern (e.g., Bulk_Regular_8)
    return appraisal.appraisalType.startsWith('Bulk_') || 
           appraisal.appraisalType.includes('Bulk');
  };

  useEffect(() => {
    let mounted = true;

    const loadAppraisalDetails = async () => {
      if (!appraisalId) {
        console.error('No Appraisal ID found in URL path.');
        setError('Appraisal ID is missing.');
        setLoading(false);
        return;
      }
      
      console.log('Loading appraisal details for ID:', appraisalId);
      
      try {
        setLoading(true);
        setError(null);

        try {
          const response = await api.get(ENDPOINTS.APPRAISALS.DETAILS_EDIT(appraisalId));
          console.log('API Response (Pending):', response.data);
          
          if (mounted && response.data) {
            // Check if this is a bulk appraisal and redirect if it is
            if (isBulkAppraisal(response.data)) {
              console.log('Bulk appraisal detected, redirecting to bulk processing page');
              navigate(`/bulk-appraisal?id=${appraisalId}`);
              return;
            }
            
            setAppraisalData(response.data);
            const hasWordPressUrl = response.data.wordpressUrl && response.data.wordpressUrl.trim() !== '';
            setShowManualForm(!hasWordPressUrl);
            console.log('WordPress URL found:', hasWordPressUrl ? response.data.wordpressUrl : 'Not available');
          } else if (mounted) {
              throw new Error('No data received for pending appraisal.');
          }
        } catch (fetchError) {
          console.log('Error fetching PENDING details:', fetchError.response?.status, fetchError.message);
          
          if (fetchError.response?.status === 404) {
            console.log('Appraisal not found in pending, checking if completed...');
            try {
              await api.get(ENDPOINTS.APPRAISALS.COMPLETED_DETAILS(appraisalId));
              console.log('Appraisal found in completed, redirecting...');
              if (mounted) {
                navigate(`/appraisals/completed/${appraisalId}`, { replace: true });
                return;
              }
            } catch (checkCompletedError) {
              console.log('Appraisal not found in completed either.', checkCompletedError.response?.status);
              setError(`Appraisal not found (ID: ${appraisalId}).`);
            }
          } else {
             setError(fetchError.message || `Error fetching appraisal details (ID: ${appraisalId}).`);
             if (fetchError.response?.status === 401) {
               navigate('/');
             }
          }
        }
      } catch (err) {
        console.error('Outer catch block error:', err);
        if (mounted) {
           setError(err.message || 'An unexpected error occurred.');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
           <LoadingSpinner message="Loading appraisal details..." />
        </div>
        <Footer />
      </div>
    );
  }
  
  if (error && !appraisalData) {
     return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <BackButton />
        <main className="container mx-auto px-4 py-8 flex-grow flex items-center justify-center">
           <Alert variant="destructive" className="w-full max-w-lg">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
           </Alert>
        </main>
        <Footer />
      </div>
    );
  }

  if (!appraisalData) {
     return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <BackButton />
        <main className="container mx-auto px-4 py-8 flex-grow flex items-center justify-center">
           <Alert variant="destructive" className="w-full max-w-lg">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Could not load appraisal data (ID: {appraisalId}).</AlertDescription>
           </Alert>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex-grow">
        <BackButton />
        <main className="container mx-auto px-4 py-8">
          {success && (
            <Alert className="mb-6 border-green-200 bg-green-50 text-green-700">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-8">
            <AppraisalDetails appraisalData={appraisalData} />

            {(appraisalData.customerDescription || appraisalData.iaDescription) && (
              <Card>
                <CardContent className="p-6">
                  <Description
                    customerDescription={appraisalData.customerDescription}
                    iaDescription={appraisalData.iaDescription}
                  />
                </CardContent>
              </Card>
            )}

            {appraisalData.images && Object.keys(appraisalData.images).length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <ImageViewer images={appraisalData.images} />
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="p-6 space-y-4">
                {showManualForm ? (
                  <>
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-semibold mb-2">Appraisal Information</h3>
                      <p className="text-muted-foreground">
                        {appraisalData?.wordpressUrl ? (
                          'Unable to fetch data from WordPress URL. Please enter information manually.'
                        ) : (
                          'No WordPress post information available. Please upload images and enter details manually.'
                        )}
                      </p>
                    </div>
                    <ManualAppraisalForm
                      appraisalId={appraisalId}
                      customerData={{
                        email: appraisalData?.customerEmail || '',
                        name: appraisalData?.customerName || '',
                        sessionId: appraisalData?.sessionId || '' 
                      }}
                      onSuccess={handleSuccess}
                    />
                  </>
                ) : (
                  <AppraisalForm 
                    appraisalId={appraisalId}
                    onSuccess={handleSuccess}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AppraisalPage;
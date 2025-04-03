import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
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
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const appraisalId = searchParams.get('id');
  const wpUrl = searchParams.get('wpUrl');
  const sessionId = searchParams.get('sessionId');
  const customerEmail = searchParams.get('email');
  const customerName = searchParams.get('name');

  console.log('Initial params:', { appraisalId, wpUrl, showManualForm: !wpUrl });

  const [appraisalData, setAppraisalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showManualForm, setShowManualForm] = useState(!wpUrl);
  const [success, setSuccess] = useState('');

  // Helper to extract post ID from WordPress URL
  const extractPostId = (url) => {
    if (!url) return null;
    try {
      const wpUrl = new URL(url);
      return wpUrl.searchParams.get('post');
    } catch (e) {
      console.error('Error parsing WordPress URL:', e);
      return null;
    }
  };
  
  // Helper to generate a cleaner URL with fewer query parameters
  const generateCleanUrl = (id, postId, sessionId) => {
    const url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.set('id', id);
    if (postId) url.searchParams.set('postId', postId);
    if (sessionId) url.searchParams.set('sessionId', sessionId);
    return url.toString();
  };

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
      
      console.log('Loading appraisal details:', { appraisalId, wpUrl, sessionId });
      
      // Clean up the URL if needed (for better bookmarking and sharing)
      if (wpUrl && sessionId) {
        const postId = extractPostId(wpUrl);
        const cleanUrl = generateCleanUrl(appraisalId, postId, sessionId);
        if (cleanUrl !== window.location.href) {
          window.history.replaceState({}, '', cleanUrl);
        }
      }

      try {
        setLoading(true);
        setError(null);

        // First get the basic appraisal data from the spreadsheet, including the WordPress URL
        const response = await api.get(ENDPOINTS.APPRAISALS.DETAILS_EDIT(appraisalId));
        console.log('API Response:', response.data);
        
        if (mounted && response.data) {
          setAppraisalData(response.data);
          
          // If the appraisal has a WordPress URL, use the normal form to complete the appraisal
          // Otherwise use the manual form to upload images and create a post
          const hasWordPressUrl = response.data.wordpressUrl && response.data.wordpressUrl.trim() !== '';
          setShowManualForm(!hasWordPressUrl);
          
          console.log('WordPress URL found:', hasWordPressUrl ? response.data.wordpressUrl : 'Not available');
        }
      } catch (err) {
        console.log('API Error:', err.response?.status, err.message);
        if (mounted) {
          const errorMessage = err.response?.status === 500 
            ? `WordPress data not available. Please enter information manually.` 
            : err.message || 'Error fetching appraisal details';
          
          setError(errorMessage);
          
          if (err.response?.status === 401) {
            navigate('/');
          } else {
            console.log('Error - showing manual form');
            setShowManualForm(true);
            setAppraisalData({
              customerEmail: customerEmail || '',
              customerName: customerName || '',
              sessionId: sessionId || '',
              customerDescription: '',
              iaDescription: '',
              images: {}
            });
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
  }, [appraisalId, wpUrl, navigate, customerEmail, customerName, sessionId]);

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
                {console.log('Rendering form section:', { showManualForm, hasAppraisalData: !!appraisalData })}
                {showManualForm ? (
                  <>
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-semibold mb-2">Appraisal Information</h3>
                      <p className="text-muted-foreground">
                        {appraisalData?.wordpressUrl ? (
                          <>
                            Unable to fetch data from WordPress URL: <code className="px-2 py-1 bg-slate-100 rounded">{appraisalData.wordpressUrl}</code>
                            <br />Please enter the appraisal information manually.
                          </>
                        ) : (
                          <>
                            No WordPress post found for this appraisal.
                            <br />Please upload images and enter details to create a new appraisal post.
                          </>
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
        )}
      </main>

      <Footer />
    </div>
  );
};

export default AppraisalPage;
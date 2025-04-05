import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Header from '../components/Header';
import Footer from '../components/Footer';
import BackButton from '../components/BackButton';
import LoadingSpinner from '../components/LoadingSpinner';
import StepProcessingPanel from '../components/StepProcessingPanel';
import AppraisalDetails from '../components/AppraisalDetails';
import * as appraisalService from '../services/appraisals';
import { checkAuth } from '../services/auth';
import './AppraisalPage.css';

const CompletedAppraisalPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const appraisalId = searchParams.get('id');
  
  const [appraisal, setAppraisal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isReprocessing, setIsReprocessing] = useState(false);

  useEffect(() => {
    if (!checkAuth()) {
      navigate('/');
      return;
    }

    if (!appraisalId) {
      setError('No appraisal ID provided');
      setLoading(false);
      return;
    }

    loadAppraisalDetails();
  }, [appraisalId, navigate]);

  const loadAppraisalDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to get details using the new completed appraisal details endpoint
      try {
        const data = await appraisalService.getCompletedAppraisalDetails(appraisalId);
        console.log('Completed appraisal data:', data);
        setAppraisal(data);
      } catch (detailsError) {
        console.error('Error with completed details endpoint, falling back to regular details:', detailsError);
        // Fall back to the regular details endpoint if the new one fails
        const fallbackData = await appraisalService.getDetails(appraisalId);
        console.log('Fallback appraisal data:', fallbackData);
        setAppraisal(fallbackData);
      }
    } catch (error) {
      console.error('Error loading appraisal details:', error);
      setError(error.message || 'Failed to load appraisal details');
    } finally {
      setLoading(false);
    }
  };

  const handleProcessingComplete = (message) => {
    setSuccessMessage(message);
    // Optionally refresh the appraisal details
    loadAppraisalDetails();
    
    // Clear success message after 5 seconds
    setTimeout(() => {
      setSuccessMessage(null);
    }, 5000);
  };
  
  const handleReprocessCompletedAppraisal = async () => {
    try {
      setIsReprocessing(true);
      setError(null);
      setSuccessMessage(null);
      
      console.log(`Initiating complete reprocessing for appraisal ${appraisalId}`);
      const response = await appraisalService.reprocessCompletedAppraisal(appraisalId);
      
      if (response.success) {
        setSuccessMessage('Appraisal reprocessing initiated. This may take a few minutes to complete.');
        // Refresh appraisal details after a short delay to give backend time to update
        setTimeout(() => {
          loadAppraisalDetails();
        }, 3000);
      } else {
        setError(response.message || 'Failed to initiate reprocessing');
      }
    } catch (error) {
      console.error('Error reprocessing completed appraisal:', error);
      setError(error.message || 'Failed to reprocess appraisal. Please try again.');
    } finally {
      setIsReprocessing(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <BackButton onClick={() => navigate('/')} />
        
        <div className="flex justify-between items-center my-6">
          <h1 className="text-3xl font-bold">Completed Appraisal Tools</h1>
          {!loading && appraisal && (
            <Button 
              onClick={handleReprocessCompletedAppraisal} 
              disabled={isReprocessing}
              variant="default"
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isReprocessing ? (
                <>
                  <span className="mr-2">Reprocessing...</span>
                  <LoadingSpinner size="sm" />
                </>
              ) : (
                "Completely Reprocess Appraisal"
              )}
            </Button>
          )}
        </div>
        
        {!loading && appraisal && (
          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <AlertTitle>What does "Completely Reprocess Appraisal" do?</AlertTitle>
            <AlertDescription>
              This will trigger a complete reprocessing of the appraisal, including:
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Recomputing all statistics data</li>
                <li>Generating a new comprehensive statistics summary</li>
                <li>Rebuilding the PDF report with enhanced data</li>
                <li>Updating the WordPress post</li>
              </ul>
              <p className="mt-2 text-sm text-gray-600">
                Note: This process may take a few minutes to complete. The page will refresh automatically when done.
              </p>
            </AlertDescription>
          </Alert>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : appraisal ? (
          <>
            {successMessage && (
              <Alert className="mb-6">
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>{successMessage}</AlertDescription>
              </Alert>
            )}
            
            <Tabs defaultValue="details" className="mb-6">
              <TabsList>
                <TabsTrigger value="details">Appraisal Details</TabsTrigger>
                <TabsTrigger value="processing">Step-by-Step Processing</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="mt-6">
                <AppraisalDetails appraisalData={appraisal} />
              </TabsContent>
              
              <TabsContent value="processing" className="mt-6">
                <StepProcessingPanel 
                  appraisalId={appraisalId} 
                  appraisalType={appraisal.type} 
                  onComplete={handleProcessingComplete} 
                />
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <Alert className="mb-6">
            <AlertTitle>No Data</AlertTitle>
            <AlertDescription>No appraisal data found.</AlertDescription>
          </Alert>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default CompletedAppraisalPage;
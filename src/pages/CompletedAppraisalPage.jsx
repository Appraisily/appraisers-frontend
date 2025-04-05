import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  const { id: appraisalId } = useParams();
  const navigate = useNavigate();
  
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
      console.error('No Appraisal ID found in URL path.');
      setError('No appraisal ID provided in URL.');
      setLoading(false);
      return;
    }

    loadAppraisalDetails();
  }, [appraisalId, navigate]);

  const loadAppraisalDetails = async () => {
    if (!appraisalId) return;

    try {
      setLoading(true);
      setError(null);
      
      const data = await appraisalService.getCompletedAppraisalDetails(appraisalId);
      console.log('Completed appraisal data:', data);
      setAppraisal(data);
      
    } catch (error) {
      console.error('Error loading completed appraisal details:', error);
      if (error.response?.status === 404) {
         setError(`Completed appraisal not found (ID: ${appraisalId}). It might still be pending or does not exist.`);
      } else if (error.response?.status === 401) {
        setError('Unauthorized access.');
      } else {
        setError(error.message || 'Failed to load completed appraisal details');
      }
      setAppraisal(null);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessingComplete = (message) => {
    setSuccessMessage(message);
    loadAppraisalDetails();
    setTimeout(() => {
      setSuccessMessage(null);
    }, 5000);
  };
  
  const handleReprocessCompletedAppraisal = async () => {
    if (!appraisalId) return;
    try {
      setIsReprocessing(true);
      setError(null);
      setSuccessMessage(null);
      
      console.log(`Initiating complete reprocessing for appraisal ${appraisalId}`);
      const response = await appraisalService.reprocessCompletedAppraisal(appraisalId);
      
      if (response.success) {
        setSuccessMessage('Appraisal reprocessing initiated. This may take a few minutes to complete.');
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

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <LoadingSpinner message={`Loading appraisal ${appraisalId}...`} />
        </div>
        <Footer />
      </div>
    );
  }

  if (error && !appraisal) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-6">
          <BackButton /> 
          <Alert variant="destructive" className="mt-6">
            <AlertTitle>Error Loading Appraisal</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!appraisal) {
      return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-6">
          <BackButton /> 
          <Alert className="mt-6">
            <AlertTitle>Appraisal Not Found</AlertTitle>
            <AlertDescription>Could not find data for appraisal ID: {appraisalId}</AlertDescription>
          </Alert>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6">
        <BackButton />
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center my-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold">Completed Appraisal Tools</h1>
          <Button 
            onClick={handleReprocessCompletedAppraisal} 
            disabled={isReprocessing}
            variant="default"
            className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
          >
            {isReprocessing ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                <span>Reprocessing...</span>
              </>
            ) : (
              "Completely Reprocess Appraisal"
            )}
          </Button>
        </div>
        
        {successMessage && (
          <Alert className="mb-6 border-green-200 bg-green-50 text-green-700">
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}
         {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        
        <Tabs defaultValue="details" className="mb-6">
          <TabsList className="flex flex-wrap h-auto justify-start">
            <TabsTrigger value="details">Appraisal Details</TabsTrigger>
            <TabsTrigger value="processing">Step-by-Step Processing</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="mt-6">
            <AppraisalDetails appraisalData={appraisal} />
          </TabsContent>
          
          <TabsContent value="processing" className="mt-6">
            <StepProcessingPanel 
              appraisalId={appraisalId} 
              appraisalType={appraisal.type || appraisal.metadata?.object_type} 
              onComplete={handleProcessingComplete} 
            />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default CompletedAppraisalPage;
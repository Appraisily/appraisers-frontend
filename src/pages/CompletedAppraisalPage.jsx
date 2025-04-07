import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCw } from 'lucide-react';
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
      setSuccessMessage(null);
      
      const data = await appraisalService.getCompletedAppraisalDetails(appraisalId);
      console.log('Completed appraisal data:', data);
      setAppraisal(data);
      
    } catch (error) {
      console.error('Error loading completed appraisal details:', error);
      if (error.response?.status === 404) {
         setError(`Completed appraisal not found (ID: ${appraisalId}). It might still be pending or does not exist.`);
      } else if (error.response?.status === 401) {
        setError('Unauthorized access.');
        navigate('/');
      } else {
        setError(error.message || 'Failed to load completed appraisal details');
      }
      setAppraisal(null);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessingComplete = (message) => {
    setSuccessMessage(message || 'Step processing completed successfully.');
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
        setSuccessMessage('Appraisal reprocessing initiated. This may take a few minutes. Refreshing details...');
        setTimeout(() => {
          loadAppraisalDetails();
        }, 3000);
      } else {
        setError(response.message || 'Failed to initiate reprocessing');
      }
    } catch (error) {
      console.error('Error reprocessing completed appraisal:', error);
      setError(error.message || 'Failed to reprocess appraisal. Please try again.');
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
            <AlertDescription>Could not find data for appraisal ID: {appraisalId}. It may have been deleted or the ID is incorrect.</AlertDescription>
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex items-center gap-4">
             <BackButton />
             <h1 className="text-2xl font-semibold tracking-tight">
               {appraisal.title || appraisal.identifier || `Appraisal ${appraisalId}`}
             </h1>
           </div>
           <Button 
             onClick={handleReprocessCompletedAppraisal} 
             disabled={isReprocessing}
             variant="outline"
             className="w-full sm:w-auto"
           >
             {isReprocessing ? (
               <>
                 <LoadingSpinner size="sm" className="mr-2" /> 
                 <span>Reprocessing...</span>
               </>
             ) : (
               <>
                 <RefreshCw className="mr-2 h-4 w-4" /> 
                 <span>Reprocess</span>
               </>
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
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Appraisal Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <AppraisalDetails appraisalData={appraisal} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Processing Status</CardTitle>
          </CardHeader>
          <CardContent>
            <StepProcessingPanel 
              appraisalId={appraisalId} 
              appraisalType={appraisal?.type || appraisal?.metadata?.object_type || 'Unknown'} 
              appraisal={appraisal}
              onComplete={handleProcessingComplete} 
            />
          </CardContent>
        </Card>

      </main>
      <Footer />
    </div>
  );
};

export default CompletedAppraisalPage;
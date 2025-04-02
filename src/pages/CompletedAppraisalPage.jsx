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
      
      const data = await appraisalService.getDetails(appraisalId);
      setAppraisal(data);
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

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <BackButton onClick={() => navigate('/')} />
        
        <h1 className="text-3xl font-bold my-6">Completed Appraisal Tools</h1>
        
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
                <AppraisalDetails appraisal={appraisal} />
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
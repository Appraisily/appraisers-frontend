import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import AppraisalProcessingPanel from '../components/AppraisalProcessingPanel';
import AppraisalDetails from '../components/AppraisalDetails';
import * as appraisalService from '../services/appraisals';
import { api } from '../services/api';
import { checkAuth } from '../services/auth';
import { ENDPOINTS } from '../config/endpoints';
import './AppraisalPage.css';
import BasicInfoCard from "@/components/details/BasicInfoCard";

const ReprocessAppraisalPage = () => {
  const { id: appraisalId } = useParams();
  const navigate = useNavigate();
  
  const [appraisal, setAppraisal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [activeTab, setActiveTab] = useState("processing");

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
      
      // First try to get it from the pending appraisals
      try {
        const response = await api.get(ENDPOINTS.APPRAISALS.DETAILS_EDIT(appraisalId));
        console.log('Pending appraisal data for reprocessing:', response.data);
        setAppraisal(response.data);
      } catch (pendingError) {
        console.log('Appraisal not found in pending, checking completed...', pendingError);
        
        // If not in pending, try completed
        try {
          const data = await appraisalService.getCompletedAppraisalDetails(appraisalId);
          console.log('Completed appraisal data for reprocessing:', data);
          setAppraisal(data);
        } catch (completedError) {
          console.error('Appraisal not found in completed either:', completedError);
          throw new Error(`Appraisal not found (ID: ${appraisalId})`);
        }
      }
    } catch (error) {
      console.error('Error loading appraisal details for reprocessing:', error);
      if (error.response?.status === 401) {
        setError('Unauthorized access.');
        navigate('/');
      } else {
        setError(error.message || 'Failed to load appraisal details');
      }
      setAppraisal(null);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessingComplete = (message, stepName) => {
    setSuccessMessage(message || 'Step processing completed successfully.');
    
    // Don't refresh the page for any step processing
    // Just display the message that processing has been initiated
    setTimeout(() => {
      setSuccessMessage(null);
    }, 8000);
  };

  const handleBackToDashboard = () => {
    navigate('/');
  };
  
  const handleBackToPending = () => {
    navigate(`/appraisals/pending/${appraisalId}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <LoadingSpinner message={`Loading appraisal ${appraisalId} for reprocessing...`} />
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
          <div className="flex justify-between mb-4">
            <Button 
              onClick={handleBackToPending} 
              variant="outline" 
              size="sm"
              className="text-sm"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Pending Appraisal
            </Button>
            <Button 
              onClick={handleBackToDashboard} 
              variant="outline" 
              size="sm"
              className="text-sm"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>
          </div>
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
          <div className="flex justify-between mb-4">
            <Button 
              onClick={handleBackToPending} 
              variant="outline" 
              size="sm"
              className="text-sm"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Pending Appraisal
            </Button>
            <Button 
              onClick={handleBackToDashboard} 
              variant="outline" 
              size="sm"
              className="text-sm"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>
          </div>
          <Alert className="mt-6">
            <AlertTitle>Appraisal Not Found</AlertTitle>
            <AlertDescription>Could not find data for appraisal ID: {appraisalId}. It may have been deleted or the ID is incorrect.</AlertDescription>
          </Alert>
        </main>
        <Footer />
      </div>
    );
  }

  // Handle null values safely with fallbacks
  const appraisalTitle = ((appraisal.title || appraisal.identifier || `Appraisal ${appraisalId}`) || '')
    .replace(/&#215;/g, "×")
    .replace(/&#217;/g, "'")
    .replace(/&amp;/g, "&");

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString || 'N/A';
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-4">
        <div className="flex flex-row justify-between items-center mb-3">
          <h1 className="text-xl font-semibold tracking-tight">
            Reprocess: {appraisalTitle}
          </h1>
          <div className="flex space-x-2">
            <Button 
              onClick={handleBackToPending} 
              variant="outline" 
              size="sm"
              className="text-sm"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Pending
            </Button>
            <Button 
              onClick={handleBackToDashboard} 
              variant="outline" 
              size="sm"
              className="text-sm"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Dashboard
            </Button>
          </div>
        </div>
        
        {appraisal && (
          <Card className="mb-4">
            <CardContent className="pt-6">
              <BasicInfoCard
                basicInfo={{
                  customer_email: appraisal.customerEmail || 'N/A',
                  customer_name: appraisal.customerName || 'N/A',
                  post_id: appraisal.postId || 'N/A',
                  appraisal_value: appraisal.appraisalValue || appraisal.value || (appraisal.metadata?.value || 'N/A'),
                  date: formatDate(appraisal.date),
                  created_at: formatDate(appraisal.metadata?.created_at || appraisal.createdAt),
                  updated_at: formatDate(appraisal.metadata?.updated_at || appraisal.updatedAt),
                  published_date: formatDate(appraisal.metadata?.published_date || appraisal.publishedDate)
                }}
                links={{
                  admin: appraisal.links?.admin || appraisal.wordpressUrl || '',
                  public: appraisal.links?.public || '',
                  pdf: appraisal.links?.pdf || (appraisal.metadata?.pdf_url || ''),
                  gcsBackup: appraisal.gcsBackupUrl || '',
                }}
                formatCurrency={(value) => {
                  if (!value && value !== 0) return 'N/A';
                  const numValue = parseFloat(value);
                  if (isNaN(numValue)) return 'N/A';
                  return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  }).format(numValue);
                }}
              />
            </CardContent>
          </Card>
        )}
        
        {successMessage && (
          <Alert className="mb-3 border-green-200 bg-green-50 text-green-700">
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert variant="destructive" className="mb-3">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Tabs defaultValue="processing" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-3 w-full justify-start">
            <TabsTrigger value="processing" className={`flex-1 ${activeTab === "processing" ? "processing-tab-active" : ""}`}>
              Step-by-Step Processing
            </TabsTrigger>
            <TabsTrigger value="details" className={`flex-1 ${activeTab === "details" ? "processing-tab-active" : ""}`}>
              Appraisal Details
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="processing" className="space-y-0">
            <AppraisalProcessingPanel 
              appraisalId={appraisalId}
              appraisal={appraisal}
              onComplete={handleProcessingComplete} 
            />
          </TabsContent>
          
          <TabsContent value="details">
            <Card className="compact-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Appraisal Details</CardTitle>
              </CardHeader>
              <CardContent>
                <AppraisalDetails appraisalData={appraisal} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default ReprocessAppraisalPage; 
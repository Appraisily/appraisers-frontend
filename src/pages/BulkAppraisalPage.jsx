import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { ENDPOINTS } from '../config/endpoints';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BackButton from '../components/BackButton';
import LoadingSpinner from '../components/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Image as ImageIcon, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const BulkAppraisalPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const appraisalId = searchParams.get('id');

  const [appraisalDetails, setAppraisalDetails] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState({
    main: null,
    age: null,
    signature: null
  });
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (appraisalId) {
      loadAppraisalDetails();
    }
  }, [appraisalId]);

  const loadAppraisalDetails = async () => {
    try {
      const response = await api.get(ENDPOINTS.APPRAISALS.DETAILS(appraisalId));
      console.log('Appraisal details response:', response.data);
      setAppraisalDetails(response.data);
    } catch (err) {
      console.error('Error loading appraisal details:', err);
      setError('Failed to load appraisal details');
    }
  };

  useEffect(() => {
    loadBulkImages();
  }, [appraisalId]);

  const loadBulkImages = async () => {
    try {
      setLoading(true);
      setError(null);
      const endpoint = ENDPOINTS.APPRAISALS.BULK_IMAGES(appraisalId);
      console.log('Fetching bulk images:', {
        endpoint,
        appraisalId
      });
      
      const response = await api.get(endpoint);
      console.log('Bulk images API response:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        headers: response.headers
      });
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch images');
      }

      const files = response.data.files || [];
      console.log('Received files from backend:', {
        count: files.length,
        files: files.map(f => ({
          name: f.name,
          type: f.contentType,
          size: f.size
        }))
      });

      // Map the files array to include all file information
      const processedFiles = files.map(file => ({
        url: file.url,
        name: file.name,
        contentType: file.contentType,
        size: file.size
      }));

      console.log('Setting processed files to state:', {
        count: processedFiles.length,
        files: processedFiles.map(f => f.name)
      });

      setImages(processedFiles);
    } catch (err) {
      console.error('Error loading bulk images:', err);
      console.error('Full error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        statusText: err.response?.statusText,
        headers: err.response?.headers,
        config: {
          url: err.config?.url,
          method: err.config?.method,
          headers: err.config?.headers
        }
      });
      setError(err.message || 'Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (file) => {
    console.log('Image selected:', file);
    setSelectedImages(prev => {
      // If image is already selected, remove it and its role
      if (Object.values(prev).some(selected => selected?.url === file.url)) {
        console.log('Removing image from selection:', file.name);
        return Object.fromEntries(
          Object.entries(prev).map(([key, value]) => [key, value?.url === file.url ? null : value])
        );
      }
      
      // Assign the next available role
      let newState = prev;
      if (!prev.main) {
        console.log('Assigning as main image');
        newState = { ...prev, main: file };
      } else if (!prev.age) {
        console.log('Assigning as age image');
        newState = { ...prev, age: file };
      } else if (!prev.signature) {
        console.log('Assigning as signature image');
        newState = { ...prev, signature: file };
      }
      console.log('New selection state:', newState);
      return newState;
      
      return prev;
    });
  };

  const getImageRole = (file) => {
    if (selectedImages.main?.url === file.url) return 'main';
    if (selectedImages.age?.url === file.url) return 'age';
    if (selectedImages.signature?.url === file.url) return 'signature';
    return null;
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'main': return 'Main Image';
      case 'age': return 'Age Image';
      case 'signature': return 'Signature Image';
      default: return '';
    }
  };

  const handleProcessSelected = async () => {
    if (!selectedImages.main) {
      console.log('Process attempted without main image selected');
      setError('Please select at least one image as the main image');
      return;
    }

    try {
      console.log('Processing selected images:', selectedImages);
      setProcessing(true);
      setError(null);

      // Create payload with only the URLs
      const processPayload = {
        main: selectedImages.main?.url,
        age: selectedImages.age?.url,
        signature: selectedImages.signature?.url
      };
      console.log('Sending process request with payload:', processPayload);

      const response = await api.post(ENDPOINTS.APPRAISALS.PROCESS_BULK(appraisalId), processPayload);

      console.log('Process response:', response.data);

      if (response.data.success) {
        console.log('Successfully processed images, reloading remaining images');
        setSuccess(`Successfully created new appraisal (Row ID: ${response.data.rowId})`);
        
        // Remove processed images from the list
        const processedUrls = Object.values(selectedImages)
          .filter(img => img)
          .map(img => img.url);
        
        setImages(prevImages => 
          prevImages.filter(img => !processedUrls.includes(img.url))
        );
        
        // Reset selection
        setSelectedImages({ main: null, age: null, signature: null });
        
        // If no more images, redirect to dashboard
        if (images.length <= processedUrls.length) {
          console.log('No more images to process, redirecting to dashboard');
          setTimeout(() => navigate('/'), 2000);
        }
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      console.error('Error processing bulk images:', err);
      console.error('Full error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      setError(err.message || 'Failed to process images');
    } finally {
      setProcessing(false);
    }
  };

  if (!appraisalId) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <BackButton />

      <main className="container mx-auto px-4 py-8">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Bulk Appraisal Processing
              </CardTitle>
              {appraisalDetails?.appraisalType && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {appraisalDetails.appraisalType}
                  </Badge>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {appraisalDetails?.appraisalType?.match(/\((\d+) items\)/)?.[1] ? (
                <>
                  This bulk order contains {appraisalDetails.appraisalType.match(/\((\d+) items\)/)[1]} items to be appraised.
                  Select one or more images below to process each item as an individual appraisal.
                </>
              ) : (
                'Select one or more images to process as individual appraisals.'
              )}
            </p>
            
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert className="mb-4 border-green-200 bg-green-50 text-green-700">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            {loading ? (
              <LoadingSpinner message="Loading images..." />
            ) : images.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground bg-slate-50 rounded-lg border border-dashed">
                No remaining images to process
              </div>
            ) : (
              <>
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700">
                    Click on images to select them. The first image selected will be the main image, 
                    the second will be the age image, and the third will be the signature image.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {images.map((file, index) => (
                    <div
                     key={file.url}
                      className={`
                        relative aspect-square rounded-lg border-2 overflow-hidden cursor-pointer
                        ${Object.values(selectedImages).some(selected => selected?.url === file.url)
                          ? 'border-primary ring-2 ring-primary ring-offset-2' 
                          : 'border-border hover:border-primary/50'}
                      `}
                      onClick={() => handleImageSelect(file)}
                    >
                      <img
                        src={file.url}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                      {getImageRole(file) && (
                        <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                          <div className="absolute top-2 left-2 bg-primary text-white px-2 py-1 rounded text-sm font-medium">
                            {getRoleLabel(getImageRole(file))}
                          </div>
                          <CheckCircle2 className="h-8 w-8 text-primary" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={handleProcessSelected}
                    disabled={processing || !selectedImages.main}
                    className="gap-2"
                  >
                    {processing ? (
                      <>
                        <LoadingSpinner />
                        Processing...
                      </>
                    ) : selectedImages.main ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        Process {Object.values(selectedImages).filter(Boolean).length} Selected Images
                      </>
                    ) : (
                      'Select Images to Process'
                    )}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default BulkAppraisalPage;
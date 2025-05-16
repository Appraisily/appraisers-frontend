import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import Header from '../components/Header';
import Footer from '../components/Footer';
import BackButton from '../components/BackButton';
import { createAppraisal } from '../services/appraisals';

// Helper function to generate a unique session ID
const generateUniqueId = () => {
  // Generate a timestamp in hex
  const timestamp = Date.now().toString(16);
  // Generate a random component
  const randomPart = Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');
  return `${timestamp}${randomPart}`;
};

const APPRAISAL_TYPES = [
  { value: 'Regular', label: 'Regular' },
  { value: 'Quick', label: 'Quick' },
  { value: 'Certificate', label: 'Certificate' },
];

const NewAppraisalPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    mainImage: null,
    signatureImage: null,
    ageImage: null,
    description: '',
    customerName: '',
    customerEmail: '',
    sessionId: '',
    appraisalType: 'Regular',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const handleTypeChange = (value) => {
    setFormData(prev => ({
      ...prev,
      appraisalType: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate required fields
    if (!formData.mainImage) {
      setError('Main image is required');
      return;
    }

    if (!formData.description.trim()) {
      setError('Description is required');
      return;
    }

    if (!formData.customerName.trim()) {
      setError('Customer name is required');
      return;
    }

    if (!formData.customerEmail.trim()) {
      setError('Customer email is required');
      return;
    }

    if (!formData.sessionId.trim()) {
      setError('Session ID is required');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Create FormData for file upload
      const formPayload = new FormData();
      formPayload.append('mainImage', formData.mainImage);
      if (formData.signatureImage) {
        formPayload.append('signatureImage', formData.signatureImage);
      }
      if (formData.ageImage) {
        formPayload.append('ageImage', formData.ageImage);
      }
      
      // Add text fields
      formPayload.append('description', formData.description);
      formPayload.append('customerName', formData.customerName);
      formPayload.append('customerEmail', formData.customerEmail);
      formPayload.append('sessionId', formData.sessionId);
      formPayload.append('appraisalType', formData.appraisalType);

      // Use the createAppraisal service
      const response = await createAppraisal(formPayload);

      if (response.success) {
        setSuccess('Appraisal created successfully. Redirecting to dashboard...');
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        throw new Error(response.message || 'Failed to create appraisal');
      }
    } catch (err) {
      console.error('Error creating appraisal:', err);
      setError(err.response?.data?.message || err.message || 'Failed to create appraisal');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex-grow">
        <BackButton />
        <main className="container mx-auto px-4 py-8">
          <div className="space-y-6 max-w-3xl mx-auto">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Create New Appraisal</h1>
              <p className="text-muted-foreground">Enter the details to create a new appraisal</p>
            </div>

            {success && (
              <Alert className="border-green-200 bg-green-50 text-green-700">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
            
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Card>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Customer Information */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Customer Information</h2>
                    
                    <div className="space-y-2">
                      <Label htmlFor="customerName">Customer Name</Label>
                      <Input
                        id="customerName"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter customer name"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="customerEmail">Customer Email</Label>
                      <Input
                        id="customerEmail"
                        name="customerEmail"
                        type="email"
                        value={formData.customerEmail}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter customer email"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sessionId">Session ID</Label>
                      <div className="flex gap-2">
                        <Input
                          id="sessionId"
                          name="sessionId"
                          value={formData.sessionId}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter unique session identifier"
                          disabled={isSubmitting}
                        />
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => setFormData(prev => ({...prev, sessionId: generateUniqueId()}))}
                          disabled={isSubmitting}
                          className="shrink-0"
                        >
                          Generate
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="appraisalType">Appraisal Type</Label>
                      <Select 
                        value={formData.appraisalType} 
                        onValueChange={handleTypeChange}
                        defaultValue="Regular"
                        disabled={isSubmitting}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select appraisal type" />
                        </SelectTrigger>
                        <SelectContent>
                          {APPRAISAL_TYPES.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Item Information */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Item Information</h2>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter detailed item description"
                        disabled={isSubmitting}
                        className="min-h-[150px] resize-y"
                      />
                    </div>
                  </div>

                  {/* Images */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Images</h2>
                    
                    <div className="space-y-2">
                      <Label htmlFor="mainImage">Main Image (Required)</Label>
                      <Input
                        id="mainImage"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'mainImage')}
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signatureImage">Signature Image (Optional)</Label>
                      <Input
                        id="signatureImage"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'signatureImage')}
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ageImage">Age Image (Optional)</Label>
                      <Input
                        id="ageImage"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'ageImage')}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating Appraisal..." : "Create Appraisal"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default NewAppraisalPage; 
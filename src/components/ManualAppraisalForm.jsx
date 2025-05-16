import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const ManualAppraisalForm = ({ appraisalId, customerData, onSuccess }) => {
  const [formData, setFormData] = useState({
    mainImage: null,
    signatureImage: null,
    ageImage: null,
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.mainImage) {
      setError('Main image is required');
      return;
    }

    if (!formData.description.trim()) {
      setError('Description is required');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const formPayload = new FormData();
      formPayload.append('session_id', customerData.sessionId || '');
      formPayload.append('description', formData.description);
      formPayload.append('customer_email', customerData.email);
      formPayload.append('customer_name', customerData.name);
      
      // Add files
      formPayload.append('main', formData.mainImage);
      if (formData.signatureImage) {
        formPayload.append('signature', formData.signatureImage);
      }
      if (formData.ageImage) {
        formPayload.append('age', formData.ageImage);
      }

      console.log('Sending request to payment processor:', {
        url: 'https://payment-processor-856401495068.us-central1.run.app/api/appraisals',
        sessionId: customerData.sessionId || '',
        description: formData.description,
        customerEmail: customerData.email,
        customerName: customerData.name,
        files: {
          main: formData.mainImage?.name,
          signature: formData.signatureImage?.name,
          age: formData.ageImage?.name
        }
      });

      // Add very explicit console logging for debugging
      console.log('SESSION ID BEING SENT:', customerData.sessionId);
      if (!customerData.sessionId) {
        console.warn('WARNING: No session ID found in customerData, sending empty string');
      }

      const response = await fetch('https://payment-processor-856401495068.us-central1.run.app/api/appraisals', {
        method: 'POST',
        body: formPayload,
      });

      console.log('Payment processor response status:', response.status);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Payment processor error response:', errorData);
        throw new Error('Failed to submit appraisal data');
      }

      const data = await response.json();
      console.log('Payment processor success response:', data);

      if (data.success) {
        onSuccess?.();
      }
    } catch (err) {
      console.error('Error submitting appraisal:', err);
      setError(err.message || 'Failed to submit appraisal');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Debug information */}
      <div className="bg-slate-50 p-3 rounded-md mb-4 text-xs">
        <p className="text-slate-500">
          <strong>Session ID:</strong> {customerData.sessionId || 'Not set'}
        </p>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
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

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            required
            placeholder="Enter item description"
            disabled={isSubmitting}
            className="min-h-[150px] resize-y"
          />
        </div>

        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Uploading Images..." : "Upload Images & Submit"}
        </Button>
      </div>
    </form>
  );
};

export default ManualAppraisalForm;
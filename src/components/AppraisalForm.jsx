import React, { useState } from 'react';
import { completeAppraisal, getDetails } from '../services/appraisals';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";

const APPRAISAL_TYPES = [
  { value: 'Regular', label: 'Regular' },
  { value: 'Insurance', label: 'Insurance' },
  { value: 'IRS', label: 'IRS' }
];

const AppraisalForm = ({ appraisalId, onSuccess }) => {
  const [appraisalValue, setAppraisalValue] = useState('');
  const [description, setDescription] = useState('');
  const [appraisalType, setAppraisalType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const fetchAppraisalDetails = async () => {
      try {
        console.log('Fetching details for appraisal:', appraisalId);
        const details = await getDetails(appraisalId);
        console.log('Received appraisal details:', details);

        // Set appraisal type if available
        if (details.appraisalType) {
          console.log('Setting appraisal type:', details.appraisalType);
          setAppraisalType(details.appraisalType);
        }

        if (details.value) {
          console.log('Setting appraisal value:', details.value);
          setAppraisalValue(details.value.toString());
        }
        
        // Check both possible field names for description
        const descriptionValue = details.appraisersDescription || details.appraiserDescription;
        if (descriptionValue) {
          console.log('Setting description:', descriptionValue);
          setDescription(descriptionValue);
        }
      } catch (err) {
        console.error('Error fetching appraisal details:', err);
        console.error('Error details:', err.response?.data);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppraisalDetails();
  }, [appraisalId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!appraisalValue || isNaN(appraisalValue) || Number(appraisalValue) <= 0) {
      setError('Please enter a valid positive number for the appraisal value.');
      return;
    }
    
    if (!appraisalType) {
      setError('Please select an appraisal type.');
      return;
    }

    if (!description.trim()) {
      setError('Please enter a description.');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const response = await completeAppraisal(
        appraisalId,
        Number(appraisalValue),
        description.trim(),
        appraisalType
      );

      if (response.success) {
        onSuccess?.();
      } else {
        throw new Error(response.message || 'Failed to submit appraisal');
      }
    } catch (err) {
      console.error('Error submitting appraisal:', err);
      setError(err.response?.data?.message || err.message || 'An error occurred while submitting the appraisal');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Complete Appraisal</h2>
        <p className="text-sm text-muted-foreground">
          Enter the appraisal details below to complete the process.
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
          <Label htmlFor="appraisalValue">Appraisal Value ($)</Label>
          <Input
            id="appraisalValue"
            type="number"
            value={appraisalValue}
            onChange={(e) => setAppraisalValue(e.target.value)}
            required
            min="0"
            step="0.01"
            placeholder="Enter appraisal value"
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="appraisalType">Appraisal Type</Label>
          <Select 
            value={appraisalType} 
            onValueChange={setAppraisalType}
            defaultValue={appraisalType}
            required
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={appraisalType ? undefined : "Select appraisal type"} />
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

        <div className="space-y-2">
          <Label htmlFor="description">Item Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Enter detailed item description"
            disabled={isSubmitting}
            className="min-h-[150px] resize-y"
          />
        </div>

        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing..." : "Submit Appraisal"}
        </Button>
      </div>
    </form>
  );
};

export default AppraisalForm;
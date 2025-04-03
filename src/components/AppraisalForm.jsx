import React, { useState, useEffect } from 'react';
import { completeAppraisal, getDetailsForEdit } from '../services/appraisals';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2, Wand2 } from "lucide-react";

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
  const [isSuggestingValue, setIsSuggestingValue] = useState(false);
  const [appraisalData, setAppraisalData] = useState(null);

  const suggestValue = async () => {
    try {
      setIsSuggestingValue(true);
      setError('');

      const response = await fetch('https://appraisers-backend-856401495068.us-central1.run.app/api/appraisals/propose-value', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          appraiserDescription: description,
          customerDescription: appraisalData?.customerDescription || '',
          aiDescription: appraisalData?.iaDescription || ''
        })
      });

      const data = await response.json();

      if (data.success) {
        setAppraisalValue(data.value.toString());
      } else {
        throw new Error(data.message || 'Failed to get value suggestion');
      }
    } catch (err) {
      console.error('Error getting value suggestion:', err);
      setError(err.message || 'Failed to get value suggestion');
    } finally {
      setIsSuggestingValue(false);
    }
  };

  useEffect(() => {
    const fetchAppraisalDetails = async () => {
      try {
        console.log('Fetching edit details for appraisal:', appraisalId);
        const details = await getDetailsForEdit(appraisalId);
        console.log('Received edit details:', details);

        // Store the full appraisal data
        setAppraisalData(details);

        // Set appraisal type if available
        if (details.appraisalType) {
          console.log('Setting appraisal type:', details.appraisalType);
          setAppraisalType(details.appraisalType);
        } else {
          // Default to Regular if not set
          setAppraisalType('Regular');
        }

        if (details.value) {
          console.log('Setting appraisal value:', details.value);
          setAppraisalValue(details.value.toString());
        }
        
        // Check all possible field names for description
        // First check appraisers description, then acf fields from WordPress
        const descriptionValue = details.appraisersDescription || 
                                details.appraiserDescription || 
                                details.description ||
                                (details.acfFields && details.acfFields.description);
                                
        if (descriptionValue) {
          console.log('Setting description:', descriptionValue);
          setDescription(descriptionValue);
        } else if (details.customerDescription) {
          // If no appraiser description, use customer description as a starting point
          console.log('Using customer description as starting point:', details.customerDescription);
          setDescription(details.customerDescription);
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
          <div className="flex gap-2">
            <Input
              id="appraisalValue"
              type="number"
              value={appraisalValue}
              onChange={(e) => setAppraisalValue(e.target.value)}
              required
              min="0"
              step="0.01"
              placeholder="Enter appraisal value"
              disabled={isSubmitting || isSuggestingValue}
            />
            <Button
              type="button"
              variant="outline"
              onClick={suggestValue}
              disabled={isSubmitting || isSuggestingValue || !description}
              className="shrink-0"
            >
              {isSuggestingValue ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Suggest Value
                </>
              )}
            </Button>
          </div>
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
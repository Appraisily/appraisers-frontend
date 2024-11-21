import React, { useState } from 'react';
import { completeAppraisal } from '../services/appraisals';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const AppraisalForm = ({ appraisalId, onSuccess }) => {
  const [appraisalValue, setAppraisalValue] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!appraisalValue || isNaN(appraisalValue) || Number(appraisalValue) <= 0) {
      setError('Please enter a valid positive number for the appraisal value.');
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
        description.trim()
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
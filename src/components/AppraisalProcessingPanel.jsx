import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader2, RefreshCw, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import WorkflowDiagram from './WorkflowDiagram';
import * as appraisalService from '../services/appraisals';

// Helper to format step names for display
const formatStepName = (name) => {
  if (!name) return 'Unknown Step';
  return name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

// Define the step icon based on status
const StepIcon = ({ status }) => {
  switch(status?.toLowerCase()) {
    case 'completed':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'failed':
    case 'error':
      return <XCircle className="h-4 w-4 text-red-500" />;
    case 'processing':
    case 'in-progress':
      return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
    default:
      return null;
  }
};

/**
 * AppraisalProcessingPanel Component
 * 
 * Displays the appraisal processing status with a visual workflow diagram
 * and provides direct-access buttons for reprocessing steps
 */
const AppraisalProcessingPanel = ({ appraisalId, appraisal, onComplete }) => {
  const [selectedStep, setSelectedStep] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeStepId, setActiveStepId] = useState(null);
  const [processingError, setProcessingError] = useState(null);
  const [processingResult, setProcessingResult] = useState(null);
  
  // Define all possible appraisal processing steps
  const appraisalSteps = [
    {
      id: 'data_collection',
      name: 'Data Collection',
      description: 'Gathers all input data from customer submission and databases.',
      status: getStepStatus(appraisal, 'data_collection')
    },
    {
      id: 'metadata_extraction',
      name: 'Metadata Extraction',
      description: 'Extracts key details like artist, medium, dimensions and creation date.',
      status: getStepStatus(appraisal, 'metadata_extraction')
    },
    {
      id: 'enhance_description',
      name: 'AI Analysis',
      description: 'Uses AI to analyze artistic elements and historical context.',
      status: getStepStatus(appraisal, 'enhance_description')
    },
    {
      id: 'value_assessment',
      name: 'Value Assessment',
      description: 'Calculates and justifies the appraised value.',
      status: getStepStatus(appraisal, 'value_assessment')
    },
    {
      id: 'regenerate_statistics',
      name: 'Statistics Generation',
      description: 'Computes market comparisons and statistical analysis.',
      status: getStepStatus(appraisal, 'regenerate_statistics')
    },
    {
      id: 'generate_html',
      name: 'HTML Visualization',
      description: 'Creates interactive charts and visual elements.',
      status: getStepStatus(appraisal, 'generate_html')
    },
    {
      id: 'generate_pdf',
      name: 'PDF Generation',
      description: 'Produces the final PDF appraisal document.',
      status: getStepStatus(appraisal, 'generate_pdf')
    }
  ];
  
  // Helper function to get step status from appraisal data
  function getStepStatus(appraisal, stepId) {
    if (!appraisal || !appraisal.steps) return 'pending';
    
    const step = appraisal.steps.find(s => s.name === stepId);
    return step ? step.status : 'pending';
  }
  
  // Handle reprocessing a specific step
  const handleReprocessStep = async (stepId) => {
    if (!stepId || !appraisalId || isProcessing) return;
    
    try {
      setActiveStepId(stepId);
      setIsProcessing(true);
      setProcessingError(null);
      setProcessingResult(null);
      
      console.log(`Reprocessing step ${stepId} for appraisal ${appraisalId}`);
      
      const response = await appraisalService.reprocessStep(appraisalId, stepId);
      
      setProcessingResult({
        success: response.success,
        message: response.message || `Successfully reprocessed step: ${formatStepName(stepId)}`,
        result: response.result
      });
      
      // Notify parent component to reload data
      if (response.success && onComplete) {
        onComplete(`Step '${formatStepName(stepId)}' reprocessed. Refreshing details...`);
      }
    } catch (error) {
      console.error('Error reprocessing step:', error);
      setProcessingError(error.message || `Failed to reprocess step: ${formatStepName(stepId)}. Please try again.`);
    } finally {
      setIsProcessing(false);
      setActiveStepId(null);
    }
  };
  
  // Handle complete appraisal reprocessing
  const handleReprocessComplete = async () => {
    if (!appraisalId || isProcessing) return;
    
    try {
      setIsProcessing(true);
      setProcessingError(null);
      setProcessingResult(null);
      
      console.log(`Initiating complete reprocessing for appraisal ${appraisalId}`);
      
      const response = await appraisalService.reprocessCompletedAppraisal(appraisalId);
      
      if (response && response.success) {
        setProcessingResult({
          success: true,
          message: 'Complete appraisal reprocessing initiated. This may take a few minutes.',
          result: response.result
        });
        
        if (onComplete) {
          onComplete('Complete appraisal reprocessing initiated. Refreshing details...');
        }
      } else {
        throw new Error((response && response.message) || 'Failed to initiate reprocessing');
      }
    } catch (error) {
      console.error('Error reprocessing completed appraisal:', error);
      setProcessingError(error.message || 'Failed to reprocess appraisal. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="space-y-6">
      {processingError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Processing Error</AlertTitle>
          <AlertDescription>{processingError}</AlertDescription>
        </Alert>
      )}
      
      {processingResult && (
        <Alert 
          variant={processingResult.success ? "default" : "destructive"} 
          className="bg-opacity-80"
        >
          <AlertTitle>{processingResult.success ? "Processing Success" : "Processing Failed"}</AlertTitle>
          <AlertDescription>{processingResult.message}</AlertDescription>
        </Alert>
      )}
      
      {/* Workflow Diagram */}
      <Card>
        <CardContent className="pt-6">
          <WorkflowDiagram
            steps={appraisalSteps}
            onStepClick={handleReprocessStep}
            onStepHover={setSelectedStep}
          />
        </CardContent>
      </Card>
      
      {/* Step Information Panel */}
      <div className="p-4 bg-muted rounded-md min-h-[80px]">
        <h4 className="text-sm font-medium mb-1">
          {selectedStep ? selectedStep.name : "Hover over any step for details"}
        </h4>
        <p className="text-sm text-muted-foreground">
          {selectedStep ? selectedStep.description : "Select any step to reprocess it"}
        </p>
      </div>
      
      {/* Direct Step Buttons */}
      <div className="flex flex-wrap gap-2">
        {appraisalSteps.map(step => (
          <Button 
            key={step.id}
            onClick={() => handleReprocessStep(step.id)}
            variant="outline"
            size="sm"
            disabled={isProcessing}
            className={`flex items-center ${activeStepId === step.id ? 'ring-2 ring-primary' : ''}`}
            title={step.description} // Tooltip
          >
            {activeStepId === step.id ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <StepIcon status={step.status} />
            )}
            <span className="ml-2">{step.name}</span>
          </Button>
        ))}
      </div>
      
      {/* Complete Reprocessing Option */}
      <Button 
        onClick={handleReprocessComplete} 
        disabled={isProcessing}
        className="w-full mt-4"
      >
        {isProcessing && !activeStepId ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Reprocessing...</>
        ) : (
          <><RefreshCw className="mr-2 h-4 w-4" /> Reprocess Entire Appraisal</>
        )}
      </Button>
    </div>
  );
};

export default AppraisalProcessingPanel; 
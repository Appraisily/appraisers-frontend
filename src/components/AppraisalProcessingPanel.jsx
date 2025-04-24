import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader2, RefreshCw, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';
import WorkflowDiagram from './WorkflowDiagram';
import * as appraisalService from '../services/appraisals';
import { Badge } from "@/components/ui/badge";

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
  const [pendingSteps, setPendingSteps] = useState([]);
  
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
    
    // If the step is in our pendingSteps array, it's being processed
    if (pendingSteps.includes(stepId)) {
      return 'processing';
    }
    
    return step ? step.status : 'pending';
  }
  
  // Handle reprocessing a specific step
  const handleReprocessStep = async (stepId) => {
    if (!stepId || !appraisalId || isProcessing) return;
    
    try {
      // Set the step as actively being processed
      setActiveStepId(stepId);
      setIsProcessing(true);
      setProcessingError(null);
      
      // Add this step to pendingSteps
      setPendingSteps(prev => [...prev, stepId]);
      
      // Show immediate feedback to the user
      setProcessingResult({
        success: true,
        message: `Processing started: ${formatStepName(stepId)}. This will continue in the background.`,
        isTemporary: true
      });
      
      console.log(`Reprocessing step ${stepId} for appraisal ${appraisalId}`);
      
      // Call API in the background
      appraisalService.reprocessStep(appraisalId, stepId)
        .then(response => {
          // For regenerate_statistics step, don't refresh the page, just show notification
          if (stepId === 'regenerate_statistics') {
            // Keep the step in pendingSteps to show it's still processing
            setProcessingResult({
              success: true,
              message: `Statistics regeneration initiated. This process will continue in the background.`,
              isTemporary: false
            });
          } else {
            // For other steps, handle as before
            if (onComplete) {
              onComplete(`Step '${formatStepName(stepId)}' reprocessing initiated. Refreshing will show updated status.`, stepId);
            }
          }
        })
        .catch(error => {
          console.error('Error reprocessing step:', error);
          // Show error in UI
          setProcessingError(`Failed to reprocess step: ${formatStepName(stepId)}. ${error.message}`);
          // Remove from pending steps
          setPendingSteps(prev => prev.filter(s => s !== stepId));
        });
      
    } finally {
      // Reset active processing state but keep the step in pendingSteps
      setIsProcessing(false);
      setActiveStepId(null);
      
      // Clear the temporary success message after a few seconds, but only if not regenerate_statistics
      if (processingResult?.isTemporary && stepId !== 'regenerate_statistics') {
        setTimeout(() => {
          setProcessingResult(null);
        }, 5000);
      }
    }
  };
  
  // Handle complete appraisal reprocessing
  const handleReprocessComplete = async () => {
    if (!appraisalId || isProcessing) return;
    
    try {
      setIsProcessing(true);
      setProcessingError(null);
      
      // Add statistics generation to pendingSteps since it's part of complete reprocessing
      setPendingSteps(prev => [...prev, 'regenerate_statistics']);
      
      // Show immediate feedback
      setProcessingResult({
        success: true,
        message: 'Complete appraisal reprocessing initiated. This will continue in the background.',
        isTemporary: true
      });
      
      console.log(`Initiating complete reprocessing for appraisal ${appraisalId}`);
      
      // Start reprocessing in the background
      appraisalService.reprocessCompletedAppraisal(appraisalId)
        .then(response => {
          if (onComplete) {
            // Pass special value to indicate complete reprocessing but highlight statistics step
            onComplete('Complete appraisal reprocessing initiated. Statistics generation will continue in the background.', 'regenerate_statistics');
          }
        })
        .catch(error => {
          console.error('Error reprocessing completed appraisal:', error);
          setProcessingError(error.message || 'Failed to reprocess appraisal. Please try again.');
          // Remove from pending steps
          setPendingSteps(prev => prev.filter(s => s !== 'regenerate_statistics'));
        });
      
    } finally {
      setIsProcessing(false);
      
      // For complete reprocessing, don't automatically clear the message
      // as the statistics regeneration will continue in the background
    }
  };
  
  return (
    <div className="space-y-6 w-full">
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
          className={`bg-opacity-80 ${processingResult.isTemporary ? "border-blue-400 bg-blue-50" : ""}`}
        >
          <Info className="h-4 w-4" />
          <AlertTitle>{processingResult.success ? "Processing Status" : "Processing Failed"}</AlertTitle>
          <AlertDescription>{processingResult.message}</AlertDescription>
        </Alert>
      )}
      
      {/* Pending Steps Indicator */}
      {pendingSteps.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          <span className="text-sm font-medium text-muted-foreground">Processing in background: </span>
          {pendingSteps.map(stepId => {
            const step = appraisalSteps.find(s => s.id === stepId);
            return (
              <Badge key={stepId} variant="outline" className="bg-blue-50 text-blue-700 border-blue-300 flex items-center gap-1">
                <Loader2 className="h-3 w-3 animate-spin" />
                {step?.name || formatStepName(stepId)}
              </Badge>
            );
          })}
        </div>
      )}
      
      {/* Workflow Diagram */}
      <Card className="w-full">
        <CardContent className="pt-6 w-full">
          <WorkflowDiagram
            steps={appraisalSteps}
            onStepClick={handleReprocessStep}
            onStepHover={setSelectedStep}
            activeStepId={activeStepId}
            pendingSteps={pendingSteps}
          />
        </CardContent>
      </Card>
      
      {/* Step Information Panel */}
      <div className="p-4 bg-muted rounded-md min-h-[80px] w-full">
        <h4 className="text-sm font-medium mb-1">
          {selectedStep ? selectedStep.name : "Hover over any step for details"}
        </h4>
        <p className="text-sm text-muted-foreground">
          {selectedStep ? selectedStep.description : "Select any step to reprocess it"}
        </p>
        {selectedStep && pendingSteps.includes(selectedStep.id) && (
          <p className="text-xs text-blue-600 mt-1">
            <Loader2 className="h-3 w-3 inline-block mr-1 animate-spin" />
            This step is currently being processed in the background
          </p>
        )}
      </div>
      
      {/* Complete Reprocessing Option */}
      <Button 
        onClick={handleReprocessComplete} 
        disabled={isProcessing}
        className="w-full mt-4"
        size="lg"
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
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
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  
  // Define all possible appraisal processing steps
  const appraisalSteps = [
    {
      id: 'ai_analysis',
      name: 'AI Analysis',
      description: 'Collects data, extracts metadata, and analyzes artwork using AI to create comprehensive description.',
      // Combine status of the three original steps - if any is processing or has an error, show that status
      status: getCombinedStepStatus(appraisal, ['data_collection', 'metadata_extraction', 'enhance_description'])
    },
    {
      id: 'metadata_reprocessing',
      name: 'Metadata Reprocessing',
      description: 'Updates operator backend with refined metadata to ensure consistency across systems.',
      status: getStepStatus(appraisal, 'metadata_reprocessing')
    },
    {
      id: 'statistics_visualization',
      name: 'Statistics & Visualization',
      description: 'Computes market comparisons, statistical analysis, and creates interactive visualizations.',
      status: getCombinedStepStatus(appraisal, ['regenerate_statistics', 'generate_html'])
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

  // Function to get the combined status for merged steps
  function getCombinedStepStatus(appraisal, stepIds) {
    if (!appraisal || !appraisal.steps) return 'pending';
    
    // Check if any of the steps are in pendingSteps array
    if (stepIds.some(id => pendingSteps.includes(id))) {
      return 'processing';
    }

    // Find the status of each step
    const statuses = stepIds.map(id => {
      const step = appraisal.steps.find(s => s.name === id);
      return step ? step.status : 'pending';
    });
    
    // If any step is processing, the combined step is processing
    if (statuses.includes('processing') || statuses.includes('in-progress')) {
      return 'processing';
    }
    
    // If any step failed, the combined step failed
    if (statuses.includes('failed') || statuses.includes('error')) {
      return 'failed';
    }
    
    // If all steps are completed, the combined step is completed
    if (statuses.every(status => status === 'completed')) {
      return 'completed';
    }
    
    // Default to pending
    return 'pending';
  }
  
  // Handle reprocessing a specific step
  const handleReprocessStep = async (stepId) => {
    if (!stepId || !appraisalId || isProcessing) return;
    
    try {
      // Set the step as actively being processed
      setActiveStepId(stepId);
      setIsProcessing(true);
      setProcessingError(null);
      
      // Map frontend step IDs to backend step IDs
      let backendStepId;
      if (stepId === 'ai_analysis') {
        backendStepId = 'enhance_description';
      } else if (stepId === 'statistics_visualization') {
        backendStepId = 'regenerate_statistics'; // Use the backend's statistics regeneration endpoint
      } else {
        backendStepId = stepId;
      }
      
      // Add this step to pendingSteps
      if (stepId === 'ai_analysis') {
        // For the AI Analysis step, add all three substeps to pendingSteps
        setPendingSteps(prev => [...prev, 'data_collection', 'metadata_extraction', 'enhance_description']);
      } else if (stepId === 'statistics_visualization') {
        // For the combined Statistics & Visualization step, add both substeps
        setPendingSteps(prev => [...prev, 'regenerate_statistics', 'generate_html']);
      } else {
        setPendingSteps(prev => [...prev, stepId]);
      }
      
      // Show immediate feedback to the user
      setProcessingResult({
        success: true,
        message: `Processing started: ${formatStepName(stepId)}. This will continue in the background.`,
        isTemporary: false
      });
      
      console.log(`Reprocessing step ${backendStepId} for appraisal ${appraisalId}`);
      
      // Call API in the background with the actual backend step
      appraisalService.reprocessStep(appraisalId, backendStepId)
        .then(response => {
          // For all steps, don't refresh the page, just show notification that processing was initiated
          setProcessingResult({
            success: true,
            message: `${formatStepName(stepId)} process initiated. This will continue in the background.`,
            isTemporary: false
          });
          
          // Notify parent component but pass stepId to prevent page refresh
          if (onComplete) {
            onComplete(`Step '${formatStepName(stepId)}' processing initiated. This will continue in the background.`, stepId);
          }
        })
        .catch(error => {
          console.error('Error reprocessing step:', error);
          // Show error in UI
          setProcessingError(`Failed to reprocess step: ${formatStepName(stepId)}. ${error.message}`);
          // Remove from pendingSteps
          if (stepId === 'ai_analysis') {
            // Remove all three substeps
            setPendingSteps(prev => prev.filter(s => !['data_collection', 'metadata_extraction', 'enhance_description'].includes(s)));
          } else if (stepId === 'statistics_visualization') {
            // Remove both statistics steps
            setPendingSteps(prev => prev.filter(s => !['regenerate_statistics', 'generate_html'].includes(s)));
          } else {
            setPendingSteps(prev => prev.filter(s => s !== stepId));
          }
        });
      
    } finally {
      // Reset active processing state but keep the step in pendingSteps
      setIsProcessing(false);
      setActiveStepId(null);
      
      // Don't automatically clear the message for any step
      // as all steps will continue in the background
    }
  };
  
  // Handle complete appraisal reprocessing
  const handleReprocessComplete = async () => {
    if (!appraisalId || isProcessing) return;
    
    try {
      setIsProcessing(true);
      setProcessingError(null);
      
      // Add all steps to pendingSteps to show they're all being processed
      // For the combined steps, add the original backend steps
      setPendingSteps(prev => [
        ...prev, 
        // Add the three original steps for AI Analysis
        'data_collection', 
        'metadata_extraction', 
        'enhance_description',
        // Add the remaining steps
        'metadata_reprocessing',
        'regenerate_statistics',
        'generate_html',
        'generate_pdf'
      ]);
      
      // Show immediate feedback
      setProcessingResult({
        success: true,
        message: 'Complete appraisal reprocessing initiated. All steps will continue in the background.',
        isTemporary: false
      });
      
      console.log(`Initiating complete reprocessing for appraisal ${appraisalId}`);
      
      // Start reprocessing in the background
      appraisalService.reprocessCompletedAppraisal(appraisalId)
        .then(response => {
          if (onComplete) {
            // Pass special value to indicate complete reprocessing
            onComplete('Complete appraisal reprocessing initiated. All steps will continue in the background.', 'all');
          }
        })
        .catch(error => {
          console.error('Error reprocessing completed appraisal:', error);
          setProcessingError(error.message || 'Failed to reprocess appraisal. Please try again.');
          // Remove all steps from pendingSteps
          setPendingSteps([]);
        });
      
    } finally {
      setIsProcessing(false);
      
      // For complete reprocessing, don't automatically clear the message
      // as all steps will continue in the background
    }
  };
  
  // Handle sending confirmation email to customer
  const handleSendConfirmationEmail = async () => {
    if (!appraisalId || isProcessing || isSendingEmail) return;
    
    try {
      setIsSendingEmail(true);
      setProcessingError(null);
      
      // Show immediate feedback to the user
      setProcessingResult({
        success: true,
        message: `Sending confirmation email to customer...`,
        isTemporary: false
      });
      
      console.log(`Sending confirmation email for appraisal ${appraisalId}`);
      
      // Call API to send the email
      const response = await appraisalService.sendConfirmationEmail(appraisalId);
      
      setProcessingResult({
        success: true,
        message: `Confirmation email sent successfully.`,
        isTemporary: false
      });
      
      // Notify parent component
      if (onComplete) {
        onComplete(`Confirmation email sent successfully.`, 'email');
      }
    } catch (error) {
      console.error('Error sending confirmation email:', error);
      // Show error in UI
      setProcessingError(`Failed to send confirmation email. ${error.message}`);
    } finally {
      setIsSendingEmail(false);
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
        disabled={isProcessing || isSendingEmail}
        className="w-full mt-4"
        size="lg"
      >
        {isProcessing && !activeStepId ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Reprocessing...</>
        ) : (
          <><RefreshCw className="mr-2 h-4 w-4" /> Reprocess Entire Appraisal</>
        )}
      </Button>
      
      {/* Send Confirmation Email Button */}
      <Button 
        onClick={handleSendConfirmationEmail} 
        disabled={isProcessing || isSendingEmail}
        className="w-full mt-4"
        variant="outline"
        size="lg"
      >
        {isSendingEmail ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending Email...</>
        ) : (
          <><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg> Send Confirmation Email to Customer</>
        )}
      </Button>
    </div>
  );
};

export default AppraisalProcessingPanel; 
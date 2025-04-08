import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, Loader2, List, RefreshCcw, AlertTriangle } from 'lucide-react';
import * as appraisalService from '../services/appraisals';

// Helper to format step names
const formatStepName = (name) => {
  if (!name) return 'Unknown Step';
  return name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

// Step Status Component - Simplified and more compact
const StepStatus = ({ name, status, timestamp, onClick, isSelected }) => {
  const formattedName = formatStepName(name);
  let StatusIcon;
  let iconColor = 'text-gray-500'; // Default color
  let bgColor = '';

  switch (status?.toLowerCase()) {
    case 'completed':
      StatusIcon = CheckCircle;
      iconColor = 'text-green-500';
      bgColor = 'hover:bg-green-50';
      break;
    case 'failed':
    case 'error':
      StatusIcon = XCircle;
      iconColor = 'text-red-500';
      bgColor = 'hover:bg-red-50';
      break;
    case 'pending':
    case 'skipped': // Consider skipped as pending/neutral
       StatusIcon = List; // Or use Hourglass or similar
       iconColor = 'text-yellow-500';
       bgColor = 'hover:bg-yellow-50';
       break;
    case 'processing':
    case 'in-progress':
       StatusIcon = Loader2;
       iconColor = 'text-blue-500 animate-spin';
       bgColor = 'hover:bg-blue-50';
       break;
    default: // Unknown or not started
      StatusIcon = List; 
  }

  const selectedClass = isSelected ? 'selected-step' : '';

  return (
    <div 
      className={`flex items-center justify-between py-2 px-3 border-b last:border-b-0 cursor-pointer transition-colors step-status-item clickable-step ${bgColor} ${selectedClass}`}
      onClick={() => onClick && onClick(name)}
    >
      <div className="flex items-center">
        <StatusIcon className={`mr-2 h-5 w-5 ${iconColor} shrink-0`} />
        <span className="text-sm font-medium">{formattedName}</span>
      </div>
      <div className="text-xs text-muted-foreground">
        {status?.toLowerCase() === 'completed' && timestamp && (
          new Date(timestamp).toLocaleString('en-US', { 
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
          })
        )}
         {status?.toLowerCase() === 'failed' && "Failed"}
         {status?.toLowerCase() === 'pending' && "Pending"}
         {(status?.toLowerCase() === 'processing' || status?.toLowerCase() === 'in-progress') && "Processing..."}
      </div>
    </div>
  );
};

const StepProcessingPanel = ({ appraisalId, appraisal, onComplete }) => {
  const [reprocessingStepsList, setReprocessingStepsList] = useState([
    'enhance_description',
    'update_wordpress',
    'generate_html',
    'generate_pdf',
    'regenerate_statistics'
  ]);
  const [selectedReprocessStep, setSelectedReprocessStep] = useState(reprocessingStepsList[0] || '');
  const [isReprocessing, setIsReprocessing] = useState(false);
  const [reprocessResult, setReprocessResult] = useState(null);
  const [reprocessError, setReprocessError] = useState(null);
  const [loadingSteps, setLoadingSteps] = useState(false);

  // Extract current steps status from appraisal data
  const currentSteps = appraisal?.steps || [];

  // Handle step selection when clicked from the status list
  const handleStepClick = (stepName) => {
    if (reprocessingStepsList.includes(stepName)) {
      setSelectedReprocessStep(stepName);
    }
  };

  const handleReprocessStep = async () => {
    if (!selectedReprocessStep || !appraisalId) return;

    try {
      setIsReprocessing(true);
      setReprocessError(null);
      setReprocessResult(null);
      
      console.log(`Reprocessing step ${selectedReprocessStep} for appraisal ${appraisalId}`);

      const response = await appraisalService.reprocessStep(
        appraisalId,
        selectedReprocessStep
      );
      
      console.log('Reprocess step response:', response);

      setReprocessResult({
        success: response.success,
        message: response.message || `Successfully reprocessed step: ${formatStepName(selectedReprocessStep)}`,
        result: response.result
      });

      // Notify parent component to reload data
      if (response.success && onComplete) {
        onComplete(`Step '${formatStepName(selectedReprocessStep)}' reprocessed. Refreshing details...`);
      }
    } catch (error) {
      console.error('Error reprocessing step:', error);
      setReprocessError(error.message || `Failed to reprocess step: ${formatStepName(selectedReprocessStep)}. Please try again.`);
    } finally {
      setIsReprocessing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 compact-layout">
      {/* Left column: Current status */}
      <div className="md:col-span-1">
        <Card className="h-full compact-card">
          <CardContent className="pt-4">
            <h4 className="text-md font-semibold mb-2">Current Status</h4>
            <p className="text-xs text-muted-foreground mb-2">Click on a step to select it for reprocessing</p>
            
            {currentSteps.length > 0 ? (
              <div className="rounded-md border divide-y divide-border">
                {currentSteps.map((step, index) => (
                  <StepStatus 
                    key={step.name || index} 
                    name={step.name} 
                    status={step.status} 
                    timestamp={step.timestamp}
                    onClick={handleStepClick}
                    isSelected={step.name === selectedReprocessStep}
                  />
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground text-center py-4 border rounded-md">
                No processing step data available.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right column: Reprocessing controls */}
      <div className="md:col-span-2">
        <Card className="h-full compact-card">
          <CardContent className="pt-4">
            {reprocessError && (
              <Alert variant="destructive" className="mb-3">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Reprocessing Error</AlertTitle>
                <AlertDescription>{reprocessError}</AlertDescription>
              </Alert>
            )}

            {reprocessResult && (
              <Alert 
                variant={reprocessResult.success ? "default" : "destructive"} 
                className="mb-3 bg-opacity-80"
              >
                <AlertTitle>{reprocessResult.success ? "Reprocess Success" : "Reprocess Failed"}</AlertTitle>
                <AlertDescription>
                  {reprocessResult.message}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-3">
              <div>
                <h4 className="text-md font-semibold mb-1">Reprocess Step</h4>
                <p className="text-xs text-muted-foreground mb-2">Select a step to reprocess and click the button</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                <div className="md:col-span-3">
                  <Label htmlFor="reprocessStep" className="mb-1 block">Select Step</Label>
                  <Select
                    disabled={isReprocessing || loadingSteps}
                    value={selectedReprocessStep}
                    onValueChange={setSelectedReprocessStep}
                  >
                    <SelectTrigger id="reprocessStep" className="w-full">
                      <SelectValue placeholder="Select a step to reprocess..." />
                    </SelectTrigger>
                    <SelectContent>
                      {reprocessingStepsList.map((step) => (
                        <SelectItem key={step} value={step}>
                          {formatStepName(step)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="md:col-span-1">
                  <Button 
                    onClick={handleReprocessStep} 
                    disabled={!selectedReprocessStep || isReprocessing || loadingSteps}
                    className="w-full h-10"
                  >
                    {isReprocessing ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
                    ) : (
                      <><RefreshCcw className="mr-2 h-4 w-4" /> Reprocess</>
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground mt-2">
                <ul className="list-disc pl-4 space-y-1 step-description-list">
                  <li><strong>Enhance Description</strong>: Merges AI and appraiser descriptions</li>
                  <li><strong>Update WordPress</strong>: Updates WordPress post with latest data</li>
                  <li><strong>Generate HTML</strong>: Creates HTML report content</li>
                  <li><strong>Generate PDF</strong>: Creates downloadable PDF report</li>
                  <li><strong>Regenerate Statistics</strong>: Updates market analysis and visualizations</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StepProcessingPanel;
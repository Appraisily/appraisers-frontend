import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, Loader2, PlayCircle, Settings, List, RefreshCcw, AlertTriangle } from 'lucide-react';
import * as appraisalService from '../services/appraisals';

// Helper to format step names
const formatStepName = (name) => {
  if (!name) return 'Unknown Step';
  return name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

// Step Status Component
const StepStatus = ({ name, status, timestamp }) => {
  const formattedName = formatStepName(name);
  let StatusIcon;
  let iconColor = 'text-gray-500'; // Default color

  switch (status?.toLowerCase()) {
    case 'completed':
      StatusIcon = CheckCircle;
      iconColor = 'text-green-500';
      break;
    case 'failed':
    case 'error':
      StatusIcon = XCircle;
      iconColor = 'text-red-500';
      break;
    case 'pending':
    case 'skipped': // Consider skipped as pending/neutral
       StatusIcon = List; // Or use Hourglass or similar
       iconColor = 'text-yellow-500';
       break;
    case 'processing':
    case 'in-progress':
       StatusIcon = Loader2;
       iconColor = 'text-blue-500 animate-spin';
       break;
    default: // Unknown or not started
      StatusIcon = List; 
  }

  return (
    <div className="flex items-center justify-between py-2 border-b last:border-b-0">
      <div className="flex items-center">
        <StatusIcon className={`mr-3 h-5 w-5 ${iconColor} shrink-0`} />
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Step-by-Step Processing</CardTitle>
        <CardDescription>Rebuild or regenerate parts of the appraisal</CardDescription>
      </CardHeader>
      <CardContent>
        {reprocessError && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Reprocessing Error</AlertTitle>
            <AlertDescription>{reprocessError}</AlertDescription>
          </Alert>
        )}

        {reprocessResult && (
          <Alert 
            variant={reprocessResult.success ? "default" : "destructive"} 
            className="mb-4 bg-opacity-80"
          >
             <AlertTitle>{reprocessResult.success ? "Reprocess Success" : "Reprocess Failed"}</AlertTitle>
             <AlertDescription>
               {reprocessResult.message}
             </AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          {/* --- Current Step Status Section --- */}
          <div>
            <h4 className="text-md font-semibold mb-3">Current Status</h4>
            {currentSteps.length > 0 ? (
              <div className="rounded-md border divide-y divide-border">
                {currentSteps.map((step, index) => (
                  <StepStatus 
                    key={step.name || index} 
                    name={step.name} 
                    status={step.status} 
                    timestamp={step.timestamp} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground text-center py-4 border rounded-md">
                No processing step data available for this appraisal.
              </div>
            )}
          </div>

           <Separator />

          {/* --- Reprocessing Section --- */}
          <div>
            <h4 className="text-md font-semibold mb-1">Reprocess Individual Step</h4>
            <p className="text-sm text-muted-foreground mb-4">Run a specific step again to update its output.</p>
            
            <div className="space-y-3">
               <div className="space-y-1.5">
                 <Label htmlFor="reprocessStep">Select Step</Label>
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

               <Button 
                 onClick={handleReprocessStep} 
                 disabled={!selectedReprocessStep || isReprocessing || loadingSteps}
                 className="w-full"
               >
                 {isReprocessing ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Reprocessing...</>
                 ) : (
                    <><RefreshCcw className="mr-2 h-4 w-4" /> Reprocess Selected Step</>
                 )}
               </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StepProcessingPanel;
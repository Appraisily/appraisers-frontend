import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import * as appraisalService from '../services/appraisals';

const StepProcessingPanel = ({ appraisalId, appraisalType, onComplete }) => {
  const [pdfSteps, setPdfSteps] = useState([]);
  const [processSteps, setProcessSteps] = useState([]);
  const [reprocessingSteps, setReprocessingSteps] = useState([
    'enhance_description',
    'update_wordpress',
    'generate_html',
    'generate_pdf',
    'regenerate_statistics'
  ]);
  const [selectedPdfStep, setSelectedPdfStep] = useState('');
  const [selectedProcessStep, setSelectedProcessStep] = useState('');
  const [selectedReprocessStep, setSelectedReprocessStep] = useState('enhance_description');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isReprocessing, setIsReprocessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loadingSteps, setLoadingSteps] = useState(true);
  const [skipImageInserts, setSkipImageInserts] = useState(false);

  useEffect(() => {
    // Fetch available steps on component mount
    const fetchSteps = async () => {
      try {
        setLoadingSteps(true);
        setError(null);

        // Fetch PDF steps
        const pdfStepsResponse = await appraisalService.getPdfSteps();
        if (pdfStepsResponse.success && pdfStepsResponse.steps) {
          setPdfSteps(pdfStepsResponse.steps);
          setSelectedPdfStep(pdfStepsResponse.steps[0] || '');
        }

        // Fetch process steps if available
        try {
          const processStepsResponse = await appraisalService.getProcessSteps();
          if (processStepsResponse.success && processStepsResponse.steps) {
            setProcessSteps(processStepsResponse.steps);
            setSelectedProcessStep(processStepsResponse.steps[0] || '');
          }
        } catch (processError) {
          console.warn('Process steps might not be implemented yet:', processError);
          // Don't show error for process steps, they might not be implemented yet
        }
      } catch (error) {
        console.error('Error fetching steps:', error);
        setError('Failed to load available steps. Please try again.');
      } finally {
        setLoadingSteps(false);
      }
    };

    fetchSteps();
  }, []);

  const handleGeneratePdf = async () => {
    if (!selectedPdfStep || !appraisalId) return;

    try {
      setIsGenerating(true);
      setError(null);
      setResult(null);

      const options = {
        skipImageInserts: skipImageInserts
      };

      const response = await appraisalService.generatePdfSteps(
        appraisalId,
        null, // session ID not needed for completed appraisals
        selectedPdfStep,
        options
      );

      setResult({
        type: 'pdf',
        success: response.success,
        message: response.message,
        pdfLink: response.pdfLink,
        docLink: response.docLink,
        steps: response.steps || []
      });

      if (onComplete) {
        onComplete('PDF generation completed successfully');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      setError(error.message || 'Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleProcessFromStep = async () => {
    if (!selectedProcessStep || !appraisalId) return;

    try {
      setIsProcessing(true);
      setError(null);
      setResult(null);

      const options = {
        // Any process-specific options
      };

      const response = await appraisalService.processFromStep(
        appraisalId,
        selectedProcessStep,
        options
      );

      setResult({
        type: 'process',
        success: response.success,
        message: response.message,
        steps: response.steps || []
      });

      if (onComplete) {
        onComplete('Process completed successfully');
      }
    } catch (error) {
      console.error('Error processing from step:', error);
      setError(error.message || 'Failed to process from selected step. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleReprocessStep = async () => {
    if (!selectedReprocessStep || !appraisalId) return;

    try {
      setIsReprocessing(true);
      setError(null);
      setResult(null);
      
      console.log(`Reprocessing step ${selectedReprocessStep} for appraisal ${appraisalId}`);

      const response = await appraisalService.reprocessStep(
        appraisalId,
        selectedReprocessStep
      );
      
      console.log('Reprocess step response:', response);

      setResult({
        type: 'reprocess',
        success: response.success,
        message: response.message || `Successfully reprocessed step: ${selectedReprocessStep}`,
        result: response.result
      });

      if (onComplete) {
        onComplete(`Successfully reprocessed step: ${selectedReprocessStep}`);
      }
    } catch (error) {
      console.error('Error reprocessing step:', error);
      setError(error.message || `Failed to reprocess step: ${selectedReprocessStep}. Please try again.`);
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
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && (
          <Alert variant={result.success ? "default" : "destructive"} className="mb-4">
            <AlertTitle>{result.success ? "Success" : "Failed"}</AlertTitle>
            <AlertDescription>
              {result.message}
              {result.type === 'pdf' && result.success && (
                <div className="mt-2">
                  {result.pdfLink && (
                    <div>
                      <a href={result.pdfLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        View PDF
                      </a>
                    </div>
                  )}
                  {result.docLink && (
                    <div>
                      <a href={result.docLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        View Google Doc
                      </a>
                    </div>
                  )}
                </div>
              )}
              {result.steps && result.steps.length > 0 && (
                <div className="mt-2 max-h-40 overflow-y-auto text-sm bg-slate-50 p-2 rounded">
                  {result.steps.map((step, index) => (
                    <div key={index} className={`mb-1 ${step.level === 'error' ? 'text-red-500' : ''}`}>
                      {step.time && new Date(step.time).toLocaleTimeString()}: {step.message}
                    </div>
                  ))}
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          {/* PDF Generation Section */}
          <div>
            <h3 className="text-lg font-medium">PDF Generation</h3>
            <p className="text-sm text-gray-500 mb-4">Regenerate the PDF document starting from a specific step</p>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pdfStep">Select Starting Step</Label>
                <Select
                  disabled={loadingSteps || isGenerating}
                  value={selectedPdfStep}
                  onValueChange={setSelectedPdfStep}
                >
                  <SelectTrigger id="pdfStep" className="w-full">
                    <SelectValue placeholder="Select a step..." />
                  </SelectTrigger>
                  <SelectContent>
                    {pdfSteps.map((step) => (
                      <SelectItem key={step} value={step}>
                        {step.replace('STEP_', '')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="skipImages"
                  checked={skipImageInserts}
                  onCheckedChange={setSkipImageInserts}
                />
                <Label htmlFor="skipImages">Skip image inserts (faster)</Label>
              </div>

              <Button 
                onClick={handleGeneratePdf} 
                disabled={!selectedPdfStep || loadingSteps || isGenerating}
                className="w-full"
              >
                {isGenerating ? "Generating..." : "Generate PDF"}
              </Button>
            </div>
          </div>

          <Separator />

          {/* Process Rebuild Section */}
          {processSteps.length > 0 && (
            <div>
              <h3 className="text-lg font-medium">Appraisal Process</h3>
              <p className="text-sm text-gray-500 mb-4">Rerun the appraisal process from a specific step</p>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="processStep">Select Starting Step</Label>
                  <Select
                    disabled={loadingSteps || isProcessing}
                    value={selectedProcessStep}
                    onValueChange={setSelectedProcessStep}
                  >
                    <SelectTrigger id="processStep" className="w-full">
                      <SelectValue placeholder="Select a step..." />
                    </SelectTrigger>
                    <SelectContent>
                      {processSteps.map((step) => (
                        <SelectItem key={step} value={step}>
                          {step.replace('STEP_', '')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={handleProcessFromStep} 
                  disabled={!selectedProcessStep || loadingSteps || isProcessing}
                  className="w-full"
                >
                  {isProcessing ? "Processing..." : "Process from Step"}
                </Button>
              </div>
            </div>
          )}

          <Separator className="my-6" />

          {/* Step Reprocessing Section */}
          <div>
            <h3 className="text-lg font-medium">Individual Step Reprocessing</h3>
            <p className="text-sm text-gray-500 mb-4">Reprocess a specific step without running the full workflow</p>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reprocessStep">Select Step to Reprocess</Label>
                <Select
                  disabled={isReprocessing}
                  value={selectedReprocessStep}
                  onValueChange={setSelectedReprocessStep}
                >
                  <SelectTrigger id="reprocessStep" className="w-full">
                    <SelectValue placeholder="Select a step..." />
                  </SelectTrigger>
                  <SelectContent>
                    {reprocessingSteps.map((step) => (
                      <SelectItem key={step} value={step}>
                        {step.replace(/_/g, ' ').split(' ').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleReprocessStep} 
                disabled={!selectedReprocessStep || isReprocessing}
                className="w-full"
              >
                {isReprocessing ? "Reprocessing..." : "Reprocess Step"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StepProcessingPanel;
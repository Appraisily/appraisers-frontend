import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Info, BarChart, FileText, AlignLeft, Check, X, AlertTriangle } from "lucide-react";

const ProcessingStatusCard = ({ processingInfo, renderBoolean, renderSimpleValue }) => {
  if (!processingInfo) return null;

  const hasProcessingSteps = Object.keys(processingInfo.processing_steps || {}).length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Processing Status</CardTitle>
        <CardDescription>Information about the appraisal processing status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
          {/* First column */}
          <div className="space-y-2">
            {processingInfo.appraisal_status && (
              <div className="flex items-baseline gap-2 text-sm">
                <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                <span className="font-medium w-32 shrink-0">Status:</span>
                <span className="capitalize">{processingInfo.appraisal_status}</span>
              </div>
            )}
            
            <div className="flex items-baseline gap-2 text-sm">
              <BarChart className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
              <span className="font-medium w-32 shrink-0">Statistics Available:</span>
              <span>{renderBoolean(processingInfo.statistics_available)}</span>
            </div>
            
            <div className="flex items-baseline gap-2 text-sm">
              <FileText className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
              <span className="font-medium w-32 shrink-0">HTML Available:</span>
              <span>{renderBoolean(processingInfo.html_available)}</span>
            </div>
          </div>
          
          {/* Second column */}
          <div className="space-y-2">
            {/* Show processing steps if available */}
            {hasProcessingSteps && (
              <div className="flex flex-col gap-1 text-sm">
                 <div className="flex items-center gap-2">
                  <AlignLeft className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="font-medium w-32 shrink-0">Processing Steps:</span>
                </div>
                <div className="pl-[1.75rem] text-sm text-gray-600 mt-1 space-y-1">
                  {Object.entries(processingInfo.processing_steps)
                   .sort(([stepA], [stepB]) => stepA.localeCompare(stepB)) // Sort steps alphabetically
                   .map(([step, status]) => (
                    <div key={step} className="flex items-center gap-2">
                      {status === 'completed' ? (
                        <Check className="h-4 w-4 text-green-500 shrink-0" />
                      ) : status === 'failed' || status === 'error' ? (
                        <X className="h-4 w-4 text-red-500 shrink-0" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" /> // Pending or other status
                      )}
                      <span className="capitalize min-w-[100px]">{step.replace(/_/g, ' ')}:</span>
                      <span className="capitalize font-medium">{renderSimpleValue(status)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {!hasProcessingSteps && (
              <div className="text-sm text-gray-500 italic mt-1">
                No processing steps recorded.
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProcessingStatusCard; 
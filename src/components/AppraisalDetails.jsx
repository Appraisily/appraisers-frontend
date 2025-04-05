import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Mail, User, Database, Image } from "lucide-react";

const AppraisalDetails = ({ appraisalData }) => {
  if (!appraisalData) return null;
  
  console.log('AppraisalDetails received data:', appraisalData);
  
  // Handle both completed appraisal structure and regular structure
  const customerEmail = appraisalData.customerEmail || appraisalData.metadata?.customer_email || '';
  const customerName = appraisalData.customerName || appraisalData.metadata?.customer_name || '';
  
  // For links, check both structures
  const wordpressUrl = appraisalData.wordpressUrl || 
                       appraisalData.links?.admin || 
                       appraisalData.links?.public || '';
                       
  const gcsBackupUrl = appraisalData.gcsBackupUrl || '';
  
  // Post ID and value information
  const postId = appraisalData.postId || '';
  const appraisalValue = appraisalData.appraisalValue || appraisalData.value || appraisalData.metadata?.value || '';

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Appraisal Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Customer Information */}
          <div className="space-y-2">
            {customerEmail && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="font-medium">Customer Email:</span>
                <a 
                  href={`mailto:${customerEmail}`}
                  className="text-blue-600 hover:underline"
                >
                  {customerEmail}
                </a>
              </div>
            )}

            {customerName && (
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="font-medium">Customer Name:</span>
                <span>{customerName}</span>
              </div>
            )}
            
            {postId && (
              <div className="flex items-center gap-2 text-sm">
                <Database className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="font-medium">WordPress Post ID:</span>
                <span>{postId}</span>
              </div>
            )}
            
            {appraisalValue && (
              <div className="flex items-center gap-2 text-sm">
                <Database className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="font-medium">Appraisal Value:</span>
                <span>{appraisalValue}</span>
              </div>
            )}
          </div>

          {/* Links */}
          <div className="space-y-2">
            {wordpressUrl && (
              <div className="flex items-center gap-2 text-sm">
                <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="font-medium">WordPress Edit:</span>
                <a 
                  href={wordpressUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline truncate"
                >
                  Open in WordPress
                </a>
              </div>
            )}

            {gcsBackupUrl && (
              <div className="flex items-center gap-2 text-sm">
                <Database className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="font-medium">GCS Backup:</span>
                <a 
                  href={gcsBackupUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline truncate"
                >
                  View Backup
                </a>
              </div>
            )}
            
            {appraisalData.links?.public && (
              <div className="flex items-center gap-2 text-sm">
                <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="font-medium">Public Link:</span>
                <a 
                  href={appraisalData.links.public}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline truncate"
                >
                  View Public Post
                </a>
              </div>
            )}
            
            {appraisalData.links?.pdf && (
              <div className="flex items-center gap-2 text-sm">
                <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="font-medium">PDF Link:</span>
                <a 
                  href={appraisalData.links.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline truncate"
                >
                  View PDF
                </a>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppraisalDetails;
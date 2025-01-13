import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Mail, User, Database, Image } from "lucide-react";

const AppraisalDetails = ({ appraisalData }) => {
  if (!appraisalData) return null;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Appraisal Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Customer Information */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="font-medium">Customer Email:</span>
              <a 
                href={`mailto:${appraisalData.customerEmail}`}
                className="text-blue-600 hover:underline"
              >
                {appraisalData.customerEmail}
              </a>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="font-medium">Customer Name:</span>
              <span>{appraisalData.customerName}</span>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-2">
            {appraisalData.wordpressUrl && (
              <div className="flex items-center gap-2 text-sm">
                <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="font-medium">WordPress Edit:</span>
                <a 
                  href={appraisalData.wordpressUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline truncate"
                >
                  Open in WordPress
                </a>
              </div>
            )}

            {appraisalData.gcsBackupUrl && (
              <div className="flex items-center gap-2 text-sm">
                <Database className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="font-medium">GCS Backup:</span>
                <a 
                  href={appraisalData.gcsBackupUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline truncate"
                >
                  View Backup
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
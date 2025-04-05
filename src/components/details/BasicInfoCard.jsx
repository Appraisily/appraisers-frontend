import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mail, User, Database, Calendar, Clock, ExternalLink, FileText, DollarSign } from "lucide-react";

const BasicInfoCard = ({ basicInfo, links, formatCurrency }) => {
  if (!basicInfo) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Basic Information</CardTitle>
        <CardDescription>Customer and appraisal information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
          {/* Customer Information */}
          <div className="space-y-2">
            {basicInfo.customer_email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="font-medium">Customer Email:</span>
                <a 
                  href={`mailto:${basicInfo.customer_email}`}
                  className="text-blue-600 hover:underline truncate"
                  title={basicInfo.customer_email}
                >
                  {basicInfo.customer_email}
                </a>
              </div>
            )}

            {basicInfo.customer_name && (
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="font-medium">Customer Name:</span>
                <span>{basicInfo.customer_name}</span>
              </div>
            )}
            
            {basicInfo.post_id && (
              <div className="flex items-center gap-2 text-sm">
                <Database className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="font-medium">WordPress Post ID:</span>
                <span>{basicInfo.post_id}</span>
              </div>
            )}
            
            {basicInfo.appraisal_value && (
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="font-medium">Appraisal Value:</span>
                <span className="font-semibold text-green-600">
                  {formatCurrency(basicInfo.appraisal_value)}
                </span>
              </div>
            )}
            
            {basicInfo.date && ( // Assuming this is the main appraisal request date
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="font-medium">Appraisal Date:</span>
                <span>{basicInfo.date}</span>
              </div>
            )}
            
             {basicInfo.created_at && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="font-medium">Created:</span>
                <span>{basicInfo.created_at}</span>
              </div>
            )}
            
            {basicInfo.published_date && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="font-medium">Published:</span>
                <span>{basicInfo.published_date}</span>
              </div>
            )}
            
            {basicInfo.updated_at && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="font-medium">Last Updated:</span>
                <span>{basicInfo.updated_at}</span>
              </div>
            )}
          </div>

          {/* Links */}
          <div className="space-y-2">
            {links?.admin && (
              <div className="flex items-center gap-2 text-sm">
                <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="font-medium">WordPress Edit:</span>
                <a 
                  href={links.admin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline truncate"
                  title={links.admin}
                >
                  Open in WordPress
                </a>
              </div>
            )}

            {links?.gcsBackup && (
              <div className="flex items-center gap-2 text-sm">
                <Database className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="font-medium">GCS Backup:</span>
                <a 
                  href={links.gcsBackup}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline truncate"
                  title={links.gcsBackup}
                >
                  View Backup
                </a>
              </div>
            )}
            
            {links?.public && (
              <div className="flex items-center gap-2 text-sm">
                <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="font-medium">Public Link:</span>
                <a 
                  href={links.public}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline truncate"
                  title={links.public}
                >
                  View Public Post
                </a>
              </div>
            )}
            
            {links?.pdf && (
              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="font-medium">PDF Link:</span>
                <a 
                  href={links.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline truncate"
                  title={links.pdf}
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

export default BasicInfoCard; 
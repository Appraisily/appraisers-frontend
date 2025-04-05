import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ExternalLink, Mail, User, Database, Image, Calendar, Clock, Hash, 
  FileText, Info, BarChart, Palette, Gallery, Maximize, Check, X, AlertTriangle,
  Tag, Award, Star
} from "lucide-react";

const AppraisalDetails = ({ appraisalData }) => {
  const [expandedMetadata, setExpandedMetadata] = useState(false);
  
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
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };
  
  // Helper to display boolean values
  const renderBoolean = (value) => {
    if (value === undefined || value === null) return '';
    return value === true || value === 'true' || value === '1' || value === 1 ? 
      <Check className="h-4 w-4 text-green-500" /> : 
      <X className="h-4 w-4 text-red-500" />;
  };
  
  // Extract metadata for display
  const metadata = appraisalData.metadata || {};
  
  // Prepare tabs data
  const basicInfo = {
    // Basic info tab
    customer_email: customerEmail,
    customer_name: customerName,
    post_id: postId,
    appraisal_value: appraisalValue,
    date: formatDate(appraisalData.date),
    created_at: formatDate(metadata.created_at || appraisalData.createdAt),
    updated_at: formatDate(metadata.updated_at || appraisalData.updatedAt),
    published_date: formatDate(metadata.published_date || appraisalData.publishedDate)
  };
  
  // Artwork details
  const artworkDetails = {
    title: appraisalData.title || '',
    creator: metadata.creator || '',
    object_type: metadata.object_type || '',
    medium: metadata.medium || '',
    dimensions: metadata.dimensions || '',
    estimated_age: metadata.estimated_age || '',
    style: metadata.style || '',
    artist_dates: metadata.artist_dates || '',
    signature: metadata.signature === '1' || metadata.signature === true || metadata.signature === 1,
    signed: metadata.signed || '',
    framed: metadata.framed === '1' || metadata.framed === true || metadata.framed === 1,
    condition_score: metadata.condition_score || '',
    condition_summary: metadata.condition_summary || '',
    provenance: metadata.provenance || '',
    rarity: metadata.rarity || '',
    market_demand: metadata.market_demand || ''
  };
  
  // Status information
  const processingInfo = {
    last_processed: formatDate(metadata.last_processed),
    appraisal_status: metadata.appraisal_status || '',
    processing_steps: metadata.processing_steps || {},
    statistics_available: !!metadata.statistics || false,
    html_available: !!(metadata.enhanced_analytics_html || metadata.appraisal_card_html)
  };
  
  // Format URLs
  const links = {
    admin: appraisalData.links?.admin || wordpressUrl || '',
    public: appraisalData.links?.public || '',
    pdf: appraisalData.links?.pdf || metadata.pdf_url || '',
    gcsBackup: gcsBackupUrl || '',
  };
  
  // Define which metadata fields to show in the expanded view
  const metadataFields = [
    'creator', 'object_type', 'medium', 'dimensions', 'estimated_age', 
    'style', 'artist_dates', 'signature', 'signed', 'framed', 
    'condition_score', 'condition_summary', 'provenance', 'rarity',
    'market_demand', 'pdf_url', 'color_palette'
  ];

  return (
    <Tabs defaultValue="basic" className="mb-6">
      <TabsList>
        <TabsTrigger value="basic">Basic Info</TabsTrigger>
        <TabsTrigger value="artwork">Artwork Details</TabsTrigger>
        <TabsTrigger value="processing">Processing Status</TabsTrigger>
      </TabsList>
      
      <TabsContent value="basic">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Basic Information</CardTitle>
            <CardDescription>Customer and appraisal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Customer Information */}
              <div className="space-y-2">
                {basicInfo.customer_email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="font-medium">Customer Email:</span>
                    <a 
                      href={`mailto:${basicInfo.customer_email}`}
                      className="text-blue-600 hover:underline"
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
                    <BarChart className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="font-medium">Appraisal Value:</span>
                    <span className="font-semibold text-green-600">
                      ${Number(basicInfo.appraisal_value).toLocaleString()}
                    </span>
                  </div>
                )}
                
                {basicInfo.date && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="font-medium">Date:</span>
                    <span>{basicInfo.date}</span>
                  </div>
                )}
                
                {basicInfo.published_date && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="font-medium">Published:</span>
                    <span>{basicInfo.published_date}</span>
                  </div>
                )}
              </div>

              {/* Links */}
              <div className="space-y-2">
                {links.admin && (
                  <div className="flex items-center gap-2 text-sm">
                    <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="font-medium">WordPress Edit:</span>
                    <a 
                      href={links.admin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline truncate"
                    >
                      Open in WordPress
                    </a>
                  </div>
                )}

                {links.gcsBackup && (
                  <div className="flex items-center gap-2 text-sm">
                    <Database className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="font-medium">GCS Backup:</span>
                    <a 
                      href={links.gcsBackup}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline truncate"
                    >
                      View Backup
                    </a>
                  </div>
                )}
                
                {links.public && (
                  <div className="flex items-center gap-2 text-sm">
                    <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="font-medium">Public Link:</span>
                    <a 
                      href={links.public}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline truncate"
                    >
                      View Public Post
                    </a>
                  </div>
                )}
                
                {links.pdf && (
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="font-medium">PDF Link:</span>
                    <a 
                      href={links.pdf}
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
      </TabsContent>
      
      <TabsContent value="artwork">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Artwork Details</CardTitle>
            <CardDescription>Information about the appraised artwork</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First column */}
              <div className="space-y-2">
                {artworkDetails.title && (
                  <div className="flex items-center gap-2 text-sm">
                    <Info className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="font-medium">Title:</span>
                    <span>{artworkDetails.title}</span>
                  </div>
                )}
                
                {artworkDetails.creator && (
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="font-medium">Creator:</span>
                    <span>{artworkDetails.creator}</span>
                  </div>
                )}
                
                {artworkDetails.artist_dates && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="font-medium">Artist Dates:</span>
                    <span>{artworkDetails.artist_dates}</span>
                  </div>
                )}
                
                {artworkDetails.object_type && (
                  <div className="flex items-center gap-2 text-sm">
                    <Tag className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="font-medium">Type:</span>
                    <span>{artworkDetails.object_type}</span>
                  </div>
                )}
                
                {artworkDetails.medium && (
                  <div className="flex items-center gap-2 text-sm">
                    <Palette className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="font-medium">Medium:</span>
                    <span>{artworkDetails.medium}</span>
                  </div>
                )}
                
                {artworkDetails.style && (
                  <div className="flex items-center gap-2 text-sm">
                    <Palette className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="font-medium">Style:</span>
                    <span>{artworkDetails.style}</span>
                  </div>
                )}
                
                {artworkDetails.dimensions && (
                  <div className="flex items-center gap-2 text-sm">
                    <Maximize className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="font-medium">Dimensions:</span>
                    <span>{artworkDetails.dimensions}</span>
                  </div>
                )}
                
                {artworkDetails.estimated_age && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="font-medium">Estimated Age:</span>
                    <span>{artworkDetails.estimated_age}</span>
                  </div>
                )}
              </div>
              
              {/* Second column */}
              <div className="space-y-2">
                {(artworkDetails.signed !== undefined || artworkDetails.signature !== undefined) && (
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="font-medium">Signed:</span>
                    <span>
                      {artworkDetails.signed || renderBoolean(artworkDetails.signature)}
                    </span>
                  </div>
                )}
                
                {artworkDetails.framed !== undefined && (
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="font-medium">Framed:</span>
                    <span>{renderBoolean(artworkDetails.framed)}</span>
                  </div>
                )}
                
                {artworkDetails.condition_score && (
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="font-medium">Condition Score:</span>
                    <span>{artworkDetails.condition_score}</span>
                  </div>
                )}
                
                {artworkDetails.condition_summary && (
                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex items-center">
                      <AlertTriangle className="h-4 w-4 text-muted-foreground shrink-0 mr-2" />
                      <span className="font-medium">Condition Summary:</span>
                    </div>
                    <p className="pl-6 text-sm text-gray-600">
                      {artworkDetails.condition_summary}
                    </p>
                  </div>
                )}
                
                {artworkDetails.rarity && (
                  <div className="flex items-center gap-2 text-sm">
                    <Award className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="font-medium">Rarity:</span>
                    <span>{artworkDetails.rarity}</span>
                  </div>
                )}
                
                {artworkDetails.market_demand && (
                  <div className="flex items-center gap-2 text-sm">
                    <BarChart className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="font-medium">Market Demand:</span>
                    <span>{artworkDetails.market_demand}</span>
                  </div>
                )}
                
                {artworkDetails.provenance && (
                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex items-center">
                      <Award className="h-4 w-4 text-muted-foreground shrink-0 mr-2" />
                      <span className="font-medium">Provenance:</span>
                    </div>
                    <p className="pl-6 text-sm text-gray-600">
                      {artworkDetails.provenance}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="processing">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Processing Status</CardTitle>
            <CardDescription>Information about the appraisal processing status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First column */}
              <div className="space-y-2">
                {processingInfo.last_processed && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="font-medium">Last Processed:</span>
                    <span>{processingInfo.last_processed}</span>
                  </div>
                )}
                
                {processingInfo.appraisal_status && (
                  <div className="flex items-center gap-2 text-sm">
                    <Info className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="font-medium">Status:</span>
                    <span className="capitalize">{processingInfo.appraisal_status}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-sm">
                  <BarChart className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="font-medium">Statistics Available:</span>
                  <span>{renderBoolean(processingInfo.statistics_available)}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="font-medium">HTML Available:</span>
                  <span>{renderBoolean(processingInfo.html_available)}</span>
                </div>
              </div>
              
              {/* Second column */}
              <div className="space-y-2">
                {/* Show processing steps if available */}
                {Object.keys(processingInfo.processing_steps).length > 0 && (
                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex items-center">
                      <Info className="h-4 w-4 text-muted-foreground shrink-0 mr-2" />
                      <span className="font-medium">Processing Steps:</span>
                    </div>
                    <div className="pl-6 text-sm text-gray-600">
                      {Object.entries(processingInfo.processing_steps).map(([step, status]) => (
                        <div key={step} className="flex items-center gap-2 text-sm">
                          {status === 'completed' ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                          )}
                          <span className="capitalize">{step.replace(/_/g, ' ')}:</span>
                          <span className="capitalize">{status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default AppraisalDetails;
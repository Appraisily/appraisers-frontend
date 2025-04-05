import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { 
  ExternalLink, Mail, User, Database, Image, Calendar, Clock, Hash, 
  FileText, Info, BarChart, Palette, Gallery, Maximize, Check, X, AlertTriangle,
  Tag, Award, Star, ChevronDown, ChevronUp, DollarSign, Percent, PieChart,
  LineChart, AlignLeft, Newspaper, ArrowUpRight, Search
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
  
  // Check if we have WordPress error or missing data
  const hasWordPressError = appraisalData.error && appraisalData.error.includes('WordPress');
  const wordPressErrorMessage = hasWordPressError ? appraisalData.error : 
    "WordPress data may be incomplete. Some information may not be displayed.";
  
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
  
  // Extract statistics data
  const statistics = appraisalData.statistics || metadata.statistics || {};
  
  const hasStatistics = Object.keys(statistics).length > 0;
  
  // Check if we have auction results
  const auctionResults = statistics.comparable_sales || [];
  const hasAuctionResults = Array.isArray(auctionResults) && auctionResults.length > 0;
  
  // Check if we have WordPress content and stats
  const hasWordPressContent = !!appraisalData.content;
  const wpStats = {
    wordCount: appraisalData.wordCount || appraisalData.wordpress_stats?.wordCount || 0,
    imageCount: appraisalData.imageCount || appraisalData.wordpress_stats?.imageCount || 0,
    revisionCount: appraisalData.revisionCount || appraisalData.wordpress_stats?.revisionCount || 0,
    commentCount: appraisalData.commentCount || appraisalData.wordpress_stats?.commentCount || 0
  };
  
  // Handle any AI justification or valuation explanation
  const justification = appraisalData.justification || metadata.justification || {};
  const hasJustification = justification.explanation || justification.text;
  
  // Enhanced description fields
  const enhancedDescription = {
    aiDescription: appraisalData.iaDescription || appraisalData.enhanced_description || metadata.ai_description || '',
    customerDescription: appraisalData.customerDescription || metadata.customer_description || '',
    appraiserDescription: appraisalData.appraisersDescription || metadata.appraiser_description || ''
  };
  
  // Format currency values
  const formatCurrency = (value) => {
    if (!value && value !== 0) return 'N/A';
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numValue);
  };

  return (
    <>
      {hasWordPressError && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-amber-800">WordPress Data Issue Detected</p>
              <p className="text-sm text-amber-700 mt-1">
                Some information may be incomplete or missing due to an issue with the WordPress post (ID: {postId}).
                The basic appraisal information is still available.
              </p>
            </div>
          </div>
        </div>
      )}
      
      <Tabs defaultValue="basic" className="mb-6">
        <TabsList>
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="artwork">Artwork Details</TabsTrigger>
          <TabsTrigger value="statistics">Statistics {hasStatistics && '✓'}</TabsTrigger>
          <TabsTrigger value="descriptions">Descriptions</TabsTrigger>
          <TabsTrigger value="processing">Processing Status</TabsTrigger>
          <TabsTrigger value="wordpress">WordPress {hasWordPressError ? '⚠️' : ''}</TabsTrigger>
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
      
      {/* Statistics Tab */}
      <TabsContent value="statistics">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Market Statistics</CardTitle>
            <CardDescription>Market data and statistics for this appraisal</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {!hasStatistics ? (
              <div className="text-center p-4 bg-gray-50 rounded-md">
                <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                <p className="text-gray-600">No statistics data available for this appraisal.</p>
              </div>
            ) : (
              <>
                {/* Key Statistics Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
                    <div className="text-xs text-gray-500 mb-1">Sample Size</div>
                    <div className="text-xl font-bold">{statistics.count || statistics.sample_size || 0}</div>
                  </div>
                  
                  <div className="bg-green-50 p-3 rounded-md border border-green-100">
                    <div className="text-xs text-gray-500 mb-1">Average Price</div>
                    <div className="text-xl font-bold">
                      {formatCurrency(statistics.average_price || statistics.mean || 0)}
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 p-3 rounded-md border border-purple-100">
                    <div className="text-xs text-gray-500 mb-1">Median Price</div>
                    <div className="text-xl font-bold">
                      {formatCurrency(statistics.median_price || 0)}
                    </div>
                  </div>
                  
                  <div className="bg-amber-50 p-3 rounded-md border border-amber-100">
                    <div className="text-xs text-gray-500 mb-1">Percentile</div>
                    <div className="text-xl font-bold">
                      {statistics.percentile || 'N/A'}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Price Range */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Price Range</h3>
                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                      <div>
                        <div className="text-xs text-gray-500">Min</div>
                        <div className="font-medium">
                          {formatCurrency(statistics.price_min || 0)}
                        </div>
                      </div>
                      
                      <div className="h-px bg-gray-300 w-16 mx-2"></div>
                      
                      <div>
                        <div className="text-xs text-gray-500">Max</div>
                        <div className="font-medium">
                          {formatCurrency(statistics.price_max || 0)}
                        </div>
                      </div>
                    </div>
                    
                    {/* Additional Stats */}
                    <div className="space-y-1 pt-2">
                      {statistics.coefficient_of_variation !== undefined && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Coefficient of Variation:</span>
                          <span>{statistics.coefficient_of_variation}</span>
                        </div>
                      )}
                      
                      {statistics.standard_deviation !== undefined && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Standard Deviation:</span>
                          <span>{formatCurrency(statistics.standard_deviation)}</span>
                        </div>
                      )}
                      
                      {statistics.price_trend_percentage && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Price Trend:</span>
                          <span className={statistics.price_trend_percentage.includes('+') ? 
                            'text-green-600' : 'text-red-600'}>
                            {statistics.price_trend_percentage}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Confidence and Notes */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Market Analysis</h3>
                    
                    <div className="bg-gray-50 p-3 rounded-md">
                      <div className="flex items-center gap-2 mb-2">
                        <Info className="h-4 w-4 text-blue-500" />
                        <h4 className="text-sm font-medium">Confidence Level</h4>
                      </div>
                      <p className="text-sm text-gray-600">{statistics.confidence_level || 'Not specified'}</p>
                    </div>
                    
                    {statistics.data_quality && (
                      <div className="bg-gray-50 p-3 rounded-md">
                        <div className="flex items-center gap-2 mb-2">
                          <Search className="h-4 w-4 text-blue-500" />
                          <h4 className="text-sm font-medium">Data Quality</h4>
                        </div>
                        <p className="text-sm text-gray-600">{statistics.data_quality}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Statistics Summary */}
                {(statistics.summary_text || appraisalData.statistics_summary_text) && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Statistics Summary</h3>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-sm text-gray-600 whitespace-pre-line">
                        {statistics.summary_text || appraisalData.statistics_summary_text}
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Auction Results */}
                {hasAuctionResults && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Comparable Auction Results</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Item
                            </th>
                            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Auction House
                            </th>
                            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Price
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {auctionResults.slice(0, 5).map((result, index) => (
                            <tr key={index} className={result.is_current ? "bg-blue-50" : ""}>
                              <td className="px-3 py-2 whitespace-nowrap text-sm">
                                {result.title || 'Unknown'}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm">
                                {result.house || 'Unknown'}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm">
                                {result.date ? formatDate(result.date) : 'Unknown'}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">
                                {formatCurrency(result.price)}
                                {result.diff && <span className="ml-1 text-xs text-gray-500">({result.diff})</span>}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {auctionResults.length > 5 && (
                      <div className="mt-2 text-right">
                        <span className="text-xs text-gray-500">
                          Showing 5 of {auctionResults.length} results
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Justification */}
                {hasJustification && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Valuation Justification</h3>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-sm text-gray-600 whitespace-pre-line">
                        {justification.explanation || justification.text}
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      {/* Descriptions Tab */}
      <TabsContent value="descriptions">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Descriptions</CardTitle>
            <CardDescription>Different descriptions associated with this appraisal</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* AI Enhanced Description */}
            {enhancedDescription.aiDescription && (
              <div>
                <h3 className="text-sm font-medium flex items-center gap-2 mb-2">
                  <Newspaper className="h-4 w-4 text-blue-500" />
                  AI Enhanced Description
                </h3>
                <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
                  <p className="text-sm text-gray-600 whitespace-pre-line">
                    {enhancedDescription.aiDescription}
                  </p>
                </div>
              </div>
            )}
            
            {/* Customer Description */}
            {enhancedDescription.customerDescription && (
              <div>
                <h3 className="text-sm font-medium flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-green-500" />
                  Customer Description
                </h3>
                <div className="bg-green-50 p-3 rounded-md border border-green-100">
                  <p className="text-sm text-gray-600 whitespace-pre-line">
                    {enhancedDescription.customerDescription}
                  </p>
                </div>
              </div>
            )}
            
            {/* Appraiser Description */}
            {enhancedDescription.appraiserDescription && (
              <div>
                <h3 className="text-sm font-medium flex items-center gap-2 mb-2">
                  <Palette className="h-4 w-4 text-purple-500" />
                  Appraiser Description
                </h3>
                <div className="bg-purple-50 p-3 rounded-md border border-purple-100">
                  <p className="text-sm text-gray-600 whitespace-pre-line">
                    {enhancedDescription.appraiserDescription}
                  </p>
                </div>
              </div>
            )}
            
            {/* No Descriptions Available */}
            {!enhancedDescription.aiDescription && 
             !enhancedDescription.customerDescription && 
             !enhancedDescription.appraiserDescription && (
              <div className="text-center p-4 bg-gray-50 rounded-md">
                <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                <p className="text-gray-600">No descriptions available for this appraisal.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      {/* WordPress Tab */}
      <TabsContent value="wordpress">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">WordPress Content</CardTitle>
            <CardDescription>Information about the WordPress post</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {hasWordPressError ? (
              <div className="text-center p-4 bg-red-50 rounded-md border border-red-100">
                <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <p className="text-red-600 font-medium">WordPress Error</p>
                <p className="text-gray-600 mt-2">{wordPressErrorMessage}</p>
                <p className="text-gray-500 mt-2 text-xs">Note: This may happen if the WordPress post was deleted or if there's an access issue with the WordPress API. The Post ID is {postId}.</p>
              </div>
            ) : !hasWordPressContent ? (
              <div className="text-center p-4 bg-gray-50 rounded-md">
                <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                <p className="text-gray-600">No WordPress content available for this appraisal.</p>
              </div>
            ) : (
              <>
                {/* WordPress Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                  <div className="bg-gray-50 p-3 rounded-md text-center">
                    <div className="text-xs text-gray-500 mb-1">Word Count</div>
                    <div className="text-lg font-medium">{wpStats.wordCount}</div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-md text-center">
                    <div className="text-xs text-gray-500 mb-1">Images</div>
                    <div className="text-lg font-medium">{wpStats.imageCount}</div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-md text-center">
                    <div className="text-xs text-gray-500 mb-1">Revisions</div>
                    <div className="text-lg font-medium">{wpStats.revisionCount}</div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-md text-center">
                    <div className="text-xs text-gray-500 mb-1">Comments</div>
                    <div className="text-lg font-medium">{wpStats.commentCount}</div>
                  </div>
                </div>
                
                {/* Post ID and type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Database className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="font-medium">Post ID:</span>
                    <span>{appraisalData.postId || 'Unknown'}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Tag className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="font-medium">Post Type:</span>
                    <span>{appraisalData.postType || 'post'}</span>
                  </div>
                </div>
                
                {/* Links */}
                <div className="mt-4 space-y-2">
                  <h3 className="text-sm font-medium mb-2">WordPress Links</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {links.admin && (
                      <a 
                        href={links.admin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 p-3 rounded-md transition-colors"
                      >
                        <ExternalLink className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium">Edit in WordPress</span>
                        <ArrowUpRight className="h-3 w-3 text-blue-500 ml-auto" />
                      </a>
                    )}
                    
                    {links.public && (
                      <a 
                        href={links.public}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-green-50 hover:bg-green-100 p-3 rounded-md transition-colors"
                      >
                        <Newspaper className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">View Public Post</span>
                        <ArrowUpRight className="h-3 w-3 text-green-500 ml-auto" />
                      </a>
                    )}
                    
                    {links.pdf && (
                      <a 
                        href={links.pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-amber-50 hover:bg-amber-100 p-3 rounded-md transition-colors"
                      >
                        <FileText className="h-4 w-4 text-amber-500" />
                        <span className="text-sm font-medium">Download PDF</span>
                        <ArrowUpRight className="h-3 w-3 text-amber-500 ml-auto" />
                      </a>
                    )}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      {/* Processing Status Tab */}
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
    </>
  );
};

export default AppraisalDetails;
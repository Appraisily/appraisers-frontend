import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  ExternalLink, Mail, User, Database, Image as ImageIcon, Calendar, Clock, Hash, 
  FileText, Info, BarChart, Palette, Maximize, Check, X, AlertTriangle,
  Tag, Award, Star, ChevronDown, ChevronUp, DollarSign, Percent, PieChart,
  LineChart, AlignLeft, Newspaper, ArrowUpRight, Search, LinkIcon
} from "lucide-react";

// Import the new sub-components
import BasicInfoCard from './details/BasicInfoCard';
import ArtworkDetailsCard from './details/ArtworkDetailsCard';
import StatisticsCard from './details/StatisticsCard';
import DescriptionsCard from './details/DescriptionsCard';
import ProcessingStatusCard from './details/ProcessingStatusCard';
import WordPressCard from './details/WordPressCard';

// --- Helper Components ---
const DetailItem = ({ label, value, icon: Icon, isLink = false, linkHref = '#' }) => {
  if (!value && value !== 0 && value !== false) return null; // Don't render if no value (except 0 or false)

  const content = isLink ? (
    <a
      href={linkHref}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline"
    >
      {value}
      <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
    </a>
  ) : (
    value
  );

  return (
    <div className="grid grid-cols-3 gap-2 py-2 items-start">
      <dt className="text-sm font-medium text-muted-foreground flex items-center col-span-1">
        {Icon && <Icon className="mr-2 h-4 w-4 text-gray-500" />}
        {label}
      </dt>
      <dd className="text-sm text-foreground col-span-2">{content}</dd>
    </div>
  );
};

const DescriptionSection = ({ title, text }) => {
  if (!text || text.trim() === '') return null;
  return (
    <div className="mb-4">
      <h4 className="text-sm font-semibold mb-1">{title}</h4>
      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{text}</p>
    </div>
  );
};
// --- End Helper Components ---

const AppraisalDetails = ({ appraisalData }) => {
  const [expandedMetadata, setExpandedMetadata] = useState(false);
  const [showRawMetadata, setShowRawMetadata] = useState(false);
  
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
    // Consider different representations of boolean/truthy values
    const truthyValues = [true, 'true', '1', 1];
    return truthyValues.includes(value) ? 
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
    // Check signature status more robustly
    signature: (metadata.signature === '1' || metadata.signature === true || metadata.signature === 1) ? true : undefined,
    signed: metadata.signed || '', // Use signature field if signed is empty?
    framed: (metadata.framed === '1' || metadata.framed === true || metadata.framed === 1) ? true : undefined,
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

  // Define which metadata fields are already explicitly handled in tabs
  // This helps avoid displaying them twice in the raw section
  const handledMetadataKeys = new Set([
    // Keys handled in basicInfo
    'customer_email', 'customer_name', 'post_id', 'value', 'date', 
    'created_at', 'updated_at', 'published_date',
    // Keys handled in artworkDetails (excluding title which comes from appraisalData)
    'creator', 'object_type', 'medium', 'dimensions', 'estimated_age', 'style', 
    'artist_dates', 'signature', 'signed', 'framed', 'condition_score', 
    'condition_summary', 'provenance', 'rarity', 'market_demand',
    // Keys handled in processingInfo
    'last_processed', 'appraisal_status', 'processing_steps', 
    // Keys handled in statistics / justification / descriptions / WP content
    'statistics', 'enhanced_analytics_html', 'appraisal_card_html', 'pdf_url', 
    'ai_description', 'enhanced_description', 'customer_description', 'appraiser_description', 'iaDescription', 'appraisersDescription',
    'justification',
    // Keys handled elsewhere (e.g., directly from appraisalData)
    'title', 'wordpressUrl', 'gcsBackupUrl', 'links', 'error', 
    'content', 'wordCount', 'imageCount', 'revisionCount', 'commentCount',
    'wordpress_stats', 'statistics_summary_text', 'postId', 'appraisalValue',
    'metadata' // Exclude the metadata object itself
  ]);
  
  // Filter out handled keys for the raw display
  const rawMetadata = Object.entries(metadata)
    .filter(([key, value]) => !handledMetadataKeys.has(key) && value !== null && value !== undefined && value !== '') // Also filter empty values
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB)); // Sort alphabetically

  // Extract statistics data
  const statistics = appraisalData.statistics || metadata.statistics || {};
  const hasStatistics = Object.keys(statistics).length > 0 && typeof statistics === 'object'; // Ensure it's an object

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
  // Ensure justification is treated as an object
  const justificationText = typeof justification === 'string' ? justification : (justification.explanation || justification.text || '');
  const hasJustification = !!justificationText;
  
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
  
  const renderSimpleValue = (value) => {
    if (value === null || value === undefined || value === '') return 'N/A';
    if (typeof value === 'boolean') return renderBoolean(value);
    return String(value);
  }

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
        <TabsList className="flex flex-wrap h-auto justify-start">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="artwork">Artwork Details</TabsTrigger>
          <TabsTrigger value="statistics">Statistics {hasStatistics && '✓'}</TabsTrigger>
          <TabsTrigger value="descriptions">Descriptions</TabsTrigger>
          <TabsTrigger value="processing">Processing Status</TabsTrigger>
          <TabsTrigger value="wordpress">WordPress {hasWordPressError ? '⚠️' : ''}</TabsTrigger>
        </TabsList>
      
        <TabsContent value="basic">
          <BasicInfoCard 
            basicInfo={basicInfo} 
            links={links} 
            formatCurrency={formatCurrency} 
          />
        </TabsContent>
        
        <TabsContent value="artwork">
          <ArtworkDetailsCard 
            artworkDetails={artworkDetails} 
            rawMetadata={rawMetadata} 
            renderBoolean={renderBoolean} 
            renderSimpleValue={renderSimpleValue} 
          />
        </TabsContent>
        
        <TabsContent value="statistics">
          <StatisticsCard 
            statistics={statistics} 
            appraisalData={appraisalData} 
            metadata={metadata} 
            hasStatistics={hasStatistics} 
            hasAuctionResults={hasAuctionResults} 
            auctionResults={auctionResults} 
            hasJustification={hasJustification} 
            justificationText={justificationText} 
            formatDate={formatDate} 
            formatCurrency={formatCurrency} 
            renderSimpleValue={renderSimpleValue} 
          />
        </TabsContent>
        
        <TabsContent value="descriptions">
          <DescriptionsCard enhancedDescription={enhancedDescription} />
        </TabsContent>
        
        <TabsContent value="wordpress">
          <WordPressCard 
            hasWordPressError={hasWordPressError}
            wordPressErrorMessage={wordPressErrorMessage}
            postId={postId}
            appraisalData={appraisalData}
            hasWordPressContent={hasWordPressContent}
            wpStats={wpStats}
            links={links}
            renderSimpleValue={renderSimpleValue}
          />
        </TabsContent>
        
        <TabsContent value="processing">
          <ProcessingStatusCard 
            processingInfo={processingInfo} 
            renderBoolean={renderBoolean} 
            renderSimpleValue={renderSimpleValue} 
          />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default AppraisalDetails;
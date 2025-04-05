import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { 
  Info, User, Calendar, Tag, Palette, Maximize, Clock, Check, AlertTriangle, Star, Award, 
  BarChart, FileText, ChevronDown, ChevronUp
} from "lucide-react";

const ArtworkDetailsCard = ({ artworkDetails, rawMetadata, renderBoolean, renderSimpleValue }) => {
  const [showRawMetadata, setShowRawMetadata] = useState(false);

  if (!artworkDetails) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Artwork Details</CardTitle>
        <CardDescription>Information about the appraised artwork</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing artwork details grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
          {/* First column */}
          <div className="space-y-2">
            {artworkDetails.title && (
              <div className="flex items-baseline gap-2 text-sm">
                <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                <span className="font-medium w-28 shrink-0">Title:</span>
                <span>{artworkDetails.title}</span>
              </div>
            )}
            
            {artworkDetails.creator && (
              <div className="flex items-baseline gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                <span className="font-medium w-28 shrink-0">Creator:</span>
                <span>{artworkDetails.creator}</span>
              </div>
            )}
            
            {artworkDetails.artist_dates && (
              <div className="flex items-baseline gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                <span className="font-medium w-28 shrink-0">Artist Dates:</span>
                <span>{artworkDetails.artist_dates}</span>
              </div>
            )}
            
            {artworkDetails.object_type && (
              <div className="flex items-baseline gap-2 text-sm">
                <Tag className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                <span className="font-medium w-28 shrink-0">Type:</span>
                <span>{artworkDetails.object_type}</span>
              </div>
            )}
            
            {artworkDetails.medium && (
              <div className="flex items-baseline gap-2 text-sm">
                <Palette className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                <span className="font-medium w-28 shrink-0">Medium:</span>
                <span>{artworkDetails.medium}</span>
              </div>
            )}
            
            {artworkDetails.style && (
              <div className="flex items-baseline gap-2 text-sm">
                <Palette className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                <span className="font-medium w-28 shrink-0">Style:</span>
                <span>{artworkDetails.style}</span>
              </div>
            )}
            
            {artworkDetails.dimensions && (
              <div className="flex items-baseline gap-2 text-sm">
                <Maximize className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                <span className="font-medium w-28 shrink-0">Dimensions:</span>
                <span>{artworkDetails.dimensions}</span>
              </div>
            )}
            
            {artworkDetails.estimated_age && (
              <div className="flex items-baseline gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                <span className="font-medium w-28 shrink-0">Estimated Age:</span>
                <span>{artworkDetails.estimated_age}</span>
              </div>
            )}
          </div>
          
          {/* Second column */}
          <div className="space-y-2">
            {(artworkDetails.signed || artworkDetails.signature !== undefined) && (
               <div className="flex items-baseline gap-2 text-sm">
                <Check className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                <span className="font-medium w-28 shrink-0">Signed:</span>
                <span>
                  {artworkDetails.signed ? artworkDetails.signed : renderBoolean(artworkDetails.signature)}
                </span>
              </div>
            )}
            
            {artworkDetails.framed !== undefined && (
              <div className="flex items-baseline gap-2 text-sm">
                <Maximize className="h-4 w-4 text-muted-foreground shrink-0 mt-1" /> {/* Using Maximize icon for frame */}
                <span className="font-medium w-28 shrink-0">Framed:</span>
                <span>{renderBoolean(artworkDetails.framed)}</span>
              </div>
            )}
            
            {artworkDetails.condition_score && (
              <div className="flex items-baseline gap-2 text-sm">
                <Star className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                <span className="font-medium w-28 shrink-0">Condition Score:</span>
                <span>{artworkDetails.condition_score}</span>
              </div>
            )}
            
             {artworkDetails.rarity && (
              <div className="flex items-baseline gap-2 text-sm">
                <Award className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                <span className="font-medium w-28 shrink-0">Rarity:</span>
                <span>{artworkDetails.rarity}</span>
              </div>
            )}
            
            {artworkDetails.market_demand && (
              <div className="flex items-baseline gap-2 text-sm">
                <BarChart className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                <span className="font-medium w-28 shrink-0">Market Demand:</span>
                <span>{artworkDetails.market_demand}</span>
              </div>
            )}

            {artworkDetails.condition_summary && (
              <div className="flex flex-col gap-1 text-sm">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="font-medium w-28 shrink-0">Condition Summary:</span>
                </div>
                <p className="pl-[1.75rem] text-sm text-gray-600 break-words whitespace-pre-wrap">
                  {artworkDetails.condition_summary}
                </p>
              </div>
            )}
            
            {artworkDetails.provenance && (
              <div className="flex flex-col gap-1 text-sm">
                 <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="font-medium w-28 shrink-0">Provenance:</span>
                </div>
                <p className="pl-[1.75rem] text-sm text-gray-600 break-words whitespace-pre-wrap">
                  {artworkDetails.provenance}
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Separator and Toggle for Raw Metadata */}
        {rawMetadata && rawMetadata.length > 0 && (
          <>
            <Separator className="my-4" />
            <div className="flex justify-end">
              <Button 
                variant="outline"
                size="sm"
                onClick={() => setShowRawMetadata(!showRawMetadata)}
              >
                {showRawMetadata ? 'Hide' : 'Show'} Full Metadata ({rawMetadata.length} fields)
                {showRawMetadata ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </>
        )}

        {/* Raw Metadata Display Section */}
        {showRawMetadata && rawMetadata && rawMetadata.length > 0 && (
          <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-md space-y-2 max-h-96 overflow-y-auto">
            <h4 className="text-sm font-medium text-slate-700 mb-2">Additional Metadata Fields:</h4>
            {rawMetadata.map(([key, value]) => (
              <div key={key} className="text-xs grid grid-cols-1 sm:grid-cols-3 gap-x-2 gap-y-1 border-b border-slate-100 py-1 last:border-b-0">
                <span className="font-medium text-slate-600 truncate col-span-1 sm:col-span-1" title={key}>{key.replace(/_/g, ' ')}:</span>
                <span className="text-slate-800 col-span-1 sm:col-span-2 break-words whitespace-pre-wrap">
                  {renderSimpleValue(value)}
                </span>
              </div>
            ))}
          </div>
        )}
        
      </CardContent>
    </Card>
  );
};

export default ArtworkDetailsCard; 
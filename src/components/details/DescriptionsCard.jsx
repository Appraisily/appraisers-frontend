import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User, Palette, Newspaper, AlertTriangle } from "lucide-react";

const DescriptionsCard = ({ enhancedDescription }) => {
  const hasAnyDescription = enhancedDescription?.aiDescription || 
                            enhancedDescription?.customerDescription || 
                            enhancedDescription?.appraiserDescription;

  if (!enhancedDescription) return null;

  return (
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
        {!hasAnyDescription && (
          <div className="text-center p-4 bg-gray-50 rounded-md">
            <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
            <p className="text-gray-600">No descriptions available for this appraisal.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DescriptionsCard; 
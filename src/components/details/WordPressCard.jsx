import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertTriangle, Database, Tag, ExternalLink, Newspaper, FileText, ArrowUpRight } from "lucide-react";

const WordPressCard = ({ 
  hasWordPressError, 
  wordPressErrorMessage, 
  postId, 
  appraisalData, 
  hasWordPressContent, 
  wpStats, 
  links, 
  renderSimpleValue 
}) => {
  
  const hasAnyWpStats = wpStats?.wordCount || wpStats?.imageCount || wpStats?.revisionCount || wpStats?.commentCount;

  return (
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
        ) : !hasWordPressContent && !hasAnyWpStats ? (
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
                <div className="text-lg font-medium">{renderSimpleValue(wpStats.wordCount)}</div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-md text-center">
                <div className="text-xs text-gray-500 mb-1">Images</div>
                <div className="text-lg font-medium">{renderSimpleValue(wpStats.imageCount)}</div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-md text-center">
                <div className="text-xs text-gray-500 mb-1">Revisions</div>
                <div className="text-lg font-medium">{renderSimpleValue(wpStats.revisionCount)}</div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-md text-center">
                <div className="text-xs text-gray-500 mb-1">Comments</div>
                <div className="text-lg font-medium">{renderSimpleValue(wpStats.commentCount)}</div>
              </div>
            </div>
            
            {/* Post ID and type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
              <div className="flex items-baseline gap-2 text-sm">
                <Database className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                <span className="font-medium w-24 shrink-0">Post ID:</span>
                <span>{appraisalData?.postId || 'Unknown'}</span>
              </div>
              
              <div className="flex items-baseline gap-2 text-sm">
                <Tag className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                <span className="font-medium w-24 shrink-0">Post Type:</span>
                <span>{appraisalData?.postType || 'post'}</span>
              </div>
            </div>
            
            {/* Links */}
            {(links?.admin || links?.public || links?.pdf) && (
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
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default WordPressCard; 
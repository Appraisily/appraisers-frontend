import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertTriangle, Info, Search } from "lucide-react";

const StatisticsCard = ({ statistics, appraisalData, metadata, hasStatistics, hasAuctionResults, auctionResults, hasJustification, justificationText, formatDate, formatCurrency, renderSimpleValue }) => {
  if (!statistics && !metadata?.statistics) return null; // Return early if no stats data at all

  return (
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
            {metadata?.statistics && typeof metadata.statistics === 'string' && (
               <p className="text-xs text-gray-500 mt-2">Statistics data might be stored as a string: "{metadata.statistics.substring(0, 100)}..."</p>
            )}
          </div>
        ) : (
          <>
            {/* Key Statistics Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
                <div className="text-xs text-gray-500 mb-1">Sample Size</div>
                <div className="text-xl font-bold">{renderSimpleValue(statistics.count || statistics.sample_size)}</div>
              </div>
              
              <div className="bg-green-50 p-3 rounded-md border border-green-100">
                <div className="text-xs text-gray-500 mb-1">Average Price</div>
                <div className="text-xl font-bold">
                  {formatCurrency(statistics.average_price || statistics.mean)}
                </div>
              </div>
              
              <div className="bg-purple-50 p-3 rounded-md border border-purple-100">
                <div className="text-xs text-gray-500 mb-1">Median Price</div>
                <div className="text-xl font-bold">
                  {formatCurrency(statistics.median_price)}
                </div>
              </div>
              
              <div className="bg-amber-50 p-3 rounded-md border border-amber-100">
                <div className="text-xs text-gray-500 mb-1">Percentile</div>
                <div className="text-xl font-bold">
                  {renderSimpleValue(statistics.percentile)}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Price Range */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Price Range</h3>
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                  <div className="text-center">
                    <div className="text-xs text-gray-500">Min</div>
                    <div className="font-medium">
                      {formatCurrency(statistics.price_min)}
                    </div>
                  </div>
                  
                  <div className="h-px bg-gray-300 grow mx-4"></div>
                  
                  <div className="text-center">
                    <div className="text-xs text-gray-500">Max</div>
                    <div className="font-medium">
                      {formatCurrency(statistics.price_max)}
                    </div>
                  </div>
                </div>
                
                {/* Additional Stats */}
                <div className="space-y-1 pt-2">
                  {statistics.coefficient_of_variation !== undefined && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Coefficient of Variation:</span>
                      <span>{renderSimpleValue(statistics.coefficient_of_variation)}</span>
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
                      <span className={String(statistics.price_trend_percentage).includes('+') ? 
                        'text-green-600' : 'text-red-600'}>
                        {renderSimpleValue(statistics.price_trend_percentage)}
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
                  <p className="text-sm text-gray-600">{renderSimpleValue(statistics.confidence_level)}</p>
                </div>
                
                {statistics.data_quality && (
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="flex items-center gap-2 mb-2">
                      <Search className="h-4 w-4 text-blue-500" />
                      <h4 className="text-sm font-medium">Data Quality</h4>
                    </div>
                    <p className="text-sm text-gray-600">{renderSimpleValue(statistics.data_quality)}</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Statistics Summary */}
            {(statistics.summary_text || appraisalData?.statistics_summary_text) && (
              <div>
                <h3 className="text-sm font-medium mb-2">Statistics Summary</h3>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-600 whitespace-pre-line">
                    {renderSimpleValue(statistics.summary_text || appraisalData.statistics_summary_text)}
                  </p>
                </div>
              </div>
            )}
            
            {/* Auction Results */}
            {hasAuctionResults && (
              <div>
                <h3 className="text-sm font-medium mb-2">Comparable Auction Results</h3>
                <div className="overflow-x-auto border rounded-md">
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
                          <td className="px-3 py-2 text-sm">
                            {result.title || 'Unknown'}
                          </td>
                          <td className="px-3 py-2 text-sm">
                            {result.house || 'Unknown'}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm">
                            {result.date ? formatDate(result.date).split(',')[0] : 'Unknown'} {/* Show only date part */}
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
                    {justificationText}
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default StatisticsCard; 
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Wifi, WifiOff, AlertCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const Controls = ({ 
  onPendingClick, 
  onCompletedClick, 
  onSearch, 
  onRefresh, 
  isRefreshing, 
  isWebSocketConnected = false,
  webSocketError = null,
  onReconnectWebSocket = null
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={onPendingClick}
            className="bg-green-600 hover:bg-green-700"
          >
            Pending
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={onCompletedClick}
          >
            Completed
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="h-8 w-8"
            title="Refresh list"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
          
          {/* Real-time updates indicator */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center ml-2">
                  {isWebSocketConnected ? (
                    <Badge variant="outline" className="gap-1 px-2 border-green-500 text-green-600">
                      <Wifi className="h-3 w-3" />
                      <span className="text-xs">Live</span>
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="gap-1 px-2 border-gray-400 text-gray-500">
                      <WifiOff className="h-3 w-3" />
                      <span className="text-xs">Offline</span>
                    </Badge>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                {isWebSocketConnected 
                  ? "Real-time updates active" 
                  : "Real-time updates unavailable"
                }
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Reconnect button - only visible when disconnected and onReconnectWebSocket is provided */}
          {!isWebSocketConnected && onReconnectWebSocket && (
            <Button
              variant="outline"
              size="sm"
              onClick={onReconnectWebSocket}
              className="h-7 px-2 text-xs"
            >
              Reconnect
            </Button>
          )}
        </div>
        <div className="relative">
          <Input
            type="text"
            placeholder="Search appraisals..."
            onChange={(e) => onSearch(e.target.value)}
            className="w-[250px] h-8"
          />
        </div>
      </div>
      
      {/* WebSocket connection error message */}
      {webSocketError && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md flex items-center text-red-700 text-sm">
          <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
          <div className="flex-1">{webSocketError}</div>
          {onReconnectWebSocket && (
            <Button
              variant="outline"
              size="sm"
              onClick={onReconnectWebSocket}
              className="ml-2 h-7 text-xs border-red-300 hover:bg-red-100"
            >
              Try Again
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default Controls;
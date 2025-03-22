import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Wifi, WifiOff } from "lucide-react";

const Controls = ({ 
  onPendingClick, 
  onCompletedClick, 
  onSearch, 
  onRefresh, 
  isRefreshing, 
  isWebSocketConnected = false 
}) => {
  return (
    <div className="flex items-center justify-between gap-4 mb-6">
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
        <div className="flex items-center ml-2" title={isWebSocketConnected ? "Real-time updates active" : "Real-time updates unavailable"}>
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
  );
};

export default Controls;
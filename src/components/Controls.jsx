import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw, Trash2 } from "lucide-react";

const Controls = ({ 
  onPendingClick, 
  onCompletedClick, 
  onSearch, 
  onRefresh, 
  isRefreshing,
  onCleanPendingClick,
  currentAppraisalType
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
          {currentAppraisalType === 'pending' && (
            <Button
              variant="outline"
              size="sm"
              onClick={onCleanPendingClick}
              disabled={isRefreshing}
              className="text-orange-600 border-orange-600 hover:bg-orange-50 hover:text-orange-700"
              title="Clean Pending List"
            >
              <Trash2 className="h-4 w-4 mr-2" /> 
              Clean List
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
    </div>
  );
};

export default Controls;
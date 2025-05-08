import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw, Plus } from "lucide-react";

const Controls = ({ 
  currentAppraisalType, 
  onTypeChange, 
  onSearch,
  onRefresh,
  isRefreshing,
  onNewAppraisal
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant={currentAppraisalType === 'pending' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onTypeChange('pending')}
            className={currentAppraisalType === 'pending' ? "bg-green-600 hover:bg-green-700" : ""}
          >
            Pending
          </Button>
          <Button
            variant={currentAppraisalType === 'completed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onTypeChange('completed')}
          >
            Completed
          </Button>
          {onRefresh && (
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
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search appraisals..."
              onChange={(e) => onSearch(e.target.value)}
              className="w-[250px] h-8"
            />
          </div>
          {onNewAppraisal && (
            <Button
              variant="default"
              size="sm"
              onClick={onNewAppraisal}
              className="ml-2"
            >
              <Plus className="h-4 w-4 mr-1" /> New Appraisal
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Controls;
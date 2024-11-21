import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw } from "lucide-react";

const Controls = ({ onPendingClick, onCompletedClick, onSearch, onRefresh, isRefreshing }) => {
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
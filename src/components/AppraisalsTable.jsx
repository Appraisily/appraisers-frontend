import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, CheckCircle, ArrowUpDown } from "lucide-react";

const AppraisalsTable = ({ appraisals, currentAppraisalType, onActionClick }) => {
  const [sortConfig, setSortConfig] = useState({
    key: 'date',
    direction: 'desc'
  });

  if (!appraisals || appraisals.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-muted-foreground">
          No {currentAppraisalType} appraisals found.
        </p>
      </div>
    );
  }

  const getShortId = (identifier) => {
    if (!identifier) return '';
    const parts = identifier.split('_');
    return parts[parts.length - 1].slice(-8);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200 hover:bg-yellow-100/80';
      case 'completed':
        return 'text-green-700 bg-green-50 border-green-200 hover:bg-green-100/80';
      case 'in-progress':
        return 'text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100/80';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200 hover:bg-gray-100/80';
    }
  };

  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);

    if (diffInSeconds < 60) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 30) return `${diffInDays}d ago`;
    if (diffInMonths < 12) return `${diffInMonths}mo ago`;
    return `${diffInYears}y ago`;
  };

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const sortedAppraisals = [...appraisals].sort((a, b) => {
    if (sortConfig.key === 'date') {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
    }
    if (sortConfig.key === 'type') {
      return sortConfig.direction === 'asc' 
        ? a.appraisalType.localeCompare(b.appraisalType)
        : b.appraisalType.localeCompare(a.appraisalType);
    }
    return 0;
  });

  return (
    <div className="max-w-4xl mx-auto rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="w-[120px] cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => handleSort('date')}
            >
              <div className="flex items-center gap-2">
                Time
                <ArrowUpDown className="h-4 w-4" />
              </div>
            </TableHead>
            <TableHead 
              className="w-[140px] cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => handleSort('type')}
            >
              <div className="flex items-center gap-2">
                Type
                <ArrowUpDown className="h-4 w-4" />
              </div>
            </TableHead>
            <TableHead className="w-[100px]">Session ID</TableHead>
            <TableHead className="w-[100px]">Status</TableHead>
            <TableHead className="w-[120px] text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedAppraisals.map((appraisal) => (
            <TableRow 
              key={appraisal.id}
              className="group"
            >
              <TableCell 
                className="font-medium"
                title={new Date(appraisal.date).toLocaleString()}
              >
                {getRelativeTime(appraisal.date)}
              </TableCell>
              <TableCell className="truncate">
                {appraisal.appraisalType}
              </TableCell>
              <TableCell 
                className="font-mono text-sm" 
                title={appraisal.identifier}
              >
                {getShortId(appraisal.identifier)}
              </TableCell>
              <TableCell>
                <Badge 
                  variant="outline" 
                  className={`${getStatusColor(appraisal.status)} capitalize`}
                >
                  {appraisal.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant={currentAppraisalType === 'pending' ? 'default' : 'secondary'}
                  size="sm"
                  onClick={() => onActionClick(appraisal.id, appraisal.wordpressUrl)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity gap-2"
                >
                  {currentAppraisalType === 'pending' ? (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Complete
                    </>
                  ) : (
                    <>
                      <Edit className="h-4 w-4" />
                      Edit
                    </>
                  )}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AppraisalsTable;
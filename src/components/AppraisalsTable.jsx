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
import { parseDate, getRelativeTime } from '../utils/dateUtils';

const AppraisalsTable = ({ appraisals, currentAppraisalType, onActionClick }) => {
  const [sortConfig, setSortConfig] = useState({
    key: 'date',
    direction: 'asc'
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
    if (!identifier || typeof identifier !== 'string') return '';
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

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const sortedAppraisals = [...appraisals].sort((a, b) => {
    if (sortConfig.key === 'date') {
      const dateA = parseDate(a.date);
      const dateB = parseDate(b.date);
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
    <div className="w-full mx-auto rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="w-[15%] cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => handleSort('date')}
            >
              <div className="flex items-center gap-2">
                Time
                <ArrowUpDown className="h-4 w-4" />
              </div>
            </TableHead>
            <TableHead 
              className="w-[20%] cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => handleSort('type')}
            >
              <div className="flex items-center gap-2">
                Type
                <ArrowUpDown className="h-4 w-4" />
              </div>
            </TableHead>
            <TableHead className="w-[25%]">Payment Session ID</TableHead>
            <TableHead className="w-[25%]">Customer</TableHead>
            <TableHead className="w-[15%]">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedAppraisals.map((appraisal) => (
            <TableRow 
              key={appraisal.id}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => onActionClick(
                appraisal
              )}
            >
              <TableCell 
                className="font-medium whitespace-nowrap"
                title={new Date(appraisal.date).toLocaleString()}
              >
                {getRelativeTime(appraisal.date)}
              </TableCell>
              <TableCell className="truncate max-w-[200px]">
                {appraisal.appraisalType}
              </TableCell>
              <TableCell 
                className="font-mono text-sm truncate max-w-[200px]" 
                title={appraisal.identifier}
              >
                {appraisal.sessionId || appraisal.identifier || ''}
              </TableCell>
              <TableCell className="truncate max-w-[200px]" title={appraisal.customerName}>
                {appraisal.customerName || 'N/A'}
              </TableCell>
              <TableCell>
                <Badge 
                  variant="outline" 
                  className={`${getStatusColor(appraisal.status)} capitalize whitespace-nowrap`}
                >
                  {appraisal.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AppraisalsTable;
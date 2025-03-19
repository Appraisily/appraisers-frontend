import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { Edit, CheckCircle, ArrowUpDown, Calendar, User, FileText } from "lucide-react";
import { parseDate, getRelativeTime } from '../utils/dateUtils';

const AppraisalsTable = ({ appraisals, currentAppraisalType, onActionClick }) => {
  const navigate = useNavigate();
  const [sortConfig, setSortConfig] = useState({
    key: 'date',
    direction: 'desc' // Changed to desc as default to show newest first
  });

  if (!appraisals || appraisals.length === 0) {
    return (
      <div className="rounded-lg border border-border/50 p-12 text-center bg-muted/30 shadow-elevation-1">
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

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Badge variant="warning">{status}</Badge>;
      case 'completed':
        return <Badge variant="success">{status}</Badge>;
      case 'in-progress':
        return <Badge variant="info">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
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
    <div className="w-full mx-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer hover:bg-muted/70 transition-colors"
              onClick={() => handleSort('date')}
            >
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Time
                <ArrowUpDown className="h-3 w-3 ml-1 opacity-50" />
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/70 transition-colors"
              onClick={() => handleSort('type')}
            >
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                Type
                <ArrowUpDown className="h-3 w-3 ml-1 opacity-50" />
              </div>
            </TableHead>
            <TableHead>Payment Session ID</TableHead>
            <TableHead>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                Customer
              </div>
            </TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedAppraisals.map((appraisal) => (
            <TableRow 
              key={appraisal.id}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => {
                if (appraisal.appraisalType === 'Bulk') {
                  const params = new URLSearchParams({
                    id: appraisal.id
                  });
                  navigate(`/bulk-appraisal?${params.toString()}`);
                } else {
                  onActionClick(appraisal);
                }
              }}
            >
              <TableCell 
                className="font-medium whitespace-nowrap"
                title={new Date(appraisal.date).toLocaleString()}
              >
                {getRelativeTime(appraisal.date)}
              </TableCell>
              <TableCell className="truncate max-w-[200px] font-medium">
                {appraisal.appraisalType}
              </TableCell>
              <TableCell 
                className="font-mono text-xs text-muted-foreground/90 truncate max-w-[200px]" 
                title={appraisal.identifier}
              >
                {appraisal.sessionId || getShortId(appraisal.identifier) || ''}
              </TableCell>
              <TableCell 
                className="truncate max-w-[200px]" 
                title={appraisal.customerName}
              >
                {appraisal.customerName || 'N/A'}
              </TableCell>
              <TableCell>
                {getStatusBadge(appraisal.status)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AppraisalsTable;
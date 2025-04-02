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
import { Edit, CheckCircle, ArrowUpDown, Calendar, User, FileText, Settings, Clipboard } from "lucide-react";
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

  // Sort by the selected column
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Sort the appraisals
  const sortedAppraisals = [...appraisals].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const viewAppraisal = (id) => {
    navigate(`/appraisal?id=${id}`);
  };

  const editAppraisal = (id) => {
    navigate(`/edit-appraisal?id=${id}`);
  };

  const processCompletedAppraisal = (id) => {
    navigate(`/completed-appraisal?id=${id}`);
  };

  const getActionButtons = (appraisal) => {
    const isPending = currentAppraisalType === 'pending';
    const isCompleted = currentAppraisalType === 'completed';
    
    return (
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => viewAppraisal(appraisal.id)}
          title="View Appraisal"
        >
          <FileText className="h-4 w-4" />
        </Button>
        
        {isPending && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => editAppraisal(appraisal.id)}
            title="Edit Appraisal"
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}
        
        {isCompleted && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => processCompletedAppraisal(appraisal.id)}
            title="Process Steps"
          >
            <Settings className="h-4 w-4" />
          </Button>
        )}
        
        {appraisal.post_url && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(appraisal.post_url, '_blank')}
            title="WordPress Post"
          >
            <Clipboard className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="border rounded-lg shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">
              <div className="flex items-center space-x-1" onClick={() => handleSort('id')}>
                <span>ID</span>
                <ArrowUpDown className="h-4 w-4 cursor-pointer" />
              </div>
            </TableHead>
            <TableHead className="min-w-[150px]">
              <div className="flex items-center space-x-1" onClick={() => handleSort('name')}>
                <span>Name/Type</span>
                <ArrowUpDown className="h-4 w-4 cursor-pointer" />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center space-x-1" onClick={() => handleSort('description')}>
                <span>Description</span>
                <ArrowUpDown className="h-4 w-4 cursor-pointer" />
              </div>
            </TableHead>
            <TableHead className="w-[120px]">
              <div className="flex items-center space-x-1" onClick={() => handleSort('status')}>
                <span>Status</span>
                <ArrowUpDown className="h-4 w-4 cursor-pointer" />
              </div>
            </TableHead>
            <TableHead className="w-[140px]">
              <div className="flex items-center space-x-1" onClick={() => handleSort('date')}>
                <Calendar className="h-4 w-4" />
                <span>Date</span>
                <ArrowUpDown className="h-4 w-4 cursor-pointer" />
              </div>
            </TableHead>
            <TableHead>Customer</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedAppraisals.map((appraisal) => (
            <TableRow 
              key={appraisal.id} 
              className="hover:bg-muted/50 cursor-pointer"
              onClick={() => viewAppraisal(appraisal.id)}
            >
              <TableCell className="font-mono text-xs">
                {getShortId(appraisal.identifier || appraisal.id)}
              </TableCell>
              <TableCell>
                <div className="font-medium">{appraisal.name || appraisal.appraisalType || 'Unnamed'}</div>
                <div className="text-xs text-muted-foreground">{appraisal.type || appraisal.appraisalType || 'Standard'}</div>
              </TableCell>
              <TableCell>
                <div className="text-sm truncate max-w-[280px]">
                  {appraisal.description || appraisal.iaDescription || appraisal.customerDescription || appraisal.appraisersDescription || 'No description available'}
                </div>
              </TableCell>
              <TableCell>
                {getStatusBadge(appraisal.status || 'Unknown')}
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-xs">
                    {parseDate(appraisal.date) ? parseDate(appraisal.date).toLocaleDateString() : 'N/A'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {appraisal.date ? getRelativeTime(appraisal.date) : ''}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{appraisal.customer_name || appraisal.customerName || 'Unknown'}</span>
                </div>
              </TableCell>
              <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                {getActionButtons(appraisal)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AppraisalsTable;
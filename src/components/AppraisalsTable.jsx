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
import { Edit, CheckCircle, ArrowUpDown, Calendar, User, FileText, Settings, Clipboard, Eye } from "lucide-react";
import { parseDate, getRelativeTime } from '../utils/dateUtils';

const AppraisalsTable = ({ appraisals, currentAppraisalType, onActionClick }) => {
  const navigate = useNavigate();
  const [sortConfig, setSortConfig] = useState({
    key: 'date',
    direction: 'desc'
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
    switch (status?.toLowerCase()) {
      case 'pending':
        return <Badge variant="warning">{status}</Badge>;
      case 'completed':
        return <Badge variant="success">{status}</Badge>;
      case 'in-progress':
      case 'processing':
        return <Badge variant="info">{status}</Badge>;
      case 'failed':
        return <Badge variant="destructive">{status}</Badge>;
      default:
        return <Badge variant="outline">{status || 'Unknown'}</Badge>;
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedAppraisals = [...appraisals].sort((a, b) => {
    const key = sortConfig.key;
    let valA = a[key];
    let valB = b[key];

    if (key === 'customer_name') {
      valA = a.customer_name || a.customerName || a.metadata?.customer_name;
      valB = b.customer_name || b.customerName || b.metadata?.customer_name;
    } else if (key === 'status') {
      valA = a.status || a.metadata?.appraisal_status;
      valB = b.status || b.metadata?.appraisal_status;
    } else if (key === 'date') {
      valA = a.date || a.createdAt || a.metadata?.created_at;
      valB = b.date || b.createdAt || b.metadata?.created_at;
    }

    valA = valA ?? '';
    valB = valB ?? '';

    if (valA < valB) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (valA > valB) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const viewAppraisal = (id) => {
    if (!id) return;
    const path = currentAppraisalType === 'completed' 
      ? `/appraisals/completed/${id}` 
      : `/appraisals/pending/${id}`;
    navigate(path);
  };

  const editAppraisal = (id) => {
    if (!id) return;
    navigate(`/edit-appraisal?id=${id}`);
  };

  const processCompletedAppraisal = (id) => {
    if (!id) return;
    viewAppraisal(id);
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
          title="View Details"
        >
          <Eye className="h-4 w-4" />
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
            onClick={() => viewAppraisal(appraisal.id)}
            title="View Details / Process"
          >
            <Settings className="h-4 w-4" />
          </Button>
        )}
        
        {appraisal?.links?.admin && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(appraisal.links.admin, '_blank')}
            title="Open WordPress Admin"
          >
            <Clipboard className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="border rounded-lg shadow-sm overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">
              <div className="flex items-center space-x-1">
                <span>ID</span>
              </div>
            </TableHead>
            <TableHead className="min-w-[150px]">
              <div className="flex items-center space-x-1 cursor-pointer" onClick={() => handleSort('name')}>
                <span>Name/Type</span>
                <ArrowUpDown className="h-4 w-4" />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center space-x-1">
                <span>Description</span>
              </div>
            </TableHead>
            <TableHead className="w-[120px]">
              <div className="flex items-center space-x-1 cursor-pointer" onClick={() => handleSort('status')}>
                <span>Status</span>
                <ArrowUpDown className="h-4 w-4" />
              </div>
            </TableHead>
            <TableHead className="w-[140px]">
              <div className="flex items-center space-x-1 cursor-pointer" onClick={() => handleSort('date')}>
                <Calendar className="h-4 w-4" />
                <span>Date</span>
                <ArrowUpDown className="h-4 w-4" />
              </div>
            </TableHead>
            <TableHead className="min-w-[150px]">
               <div className="flex items-center space-x-1 cursor-pointer" onClick={() => handleSort('customer_name')}>
                 <User className="h-4 w-4" />
                 <span>Customer</span>
                 <ArrowUpDown className="h-4 w-4" />
               </div>
            </TableHead>
            <TableHead className="text-right min-w-[150px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedAppraisals.map((appraisal) => {
            const description = appraisal.description || 
                              appraisal.iaDescription || 
                              appraisal.customerDescription || 
                              appraisal.appraisersDescription || 
                              appraisal.metadata?.description || 
                              appraisal.metadata?.iaDescription ||
                              appraisal.metadata?.customer_description ||
                              appraisal.metadata?.appraiser_description || 
                              'No description available';
            const customerName = appraisal.customer_name || appraisal.customerName || appraisal.metadata?.customer_name || 'Unknown';
            const status = appraisal.status || appraisal.metadata?.appraisal_status || 'Unknown';
            const date = appraisal.date || appraisal.createdAt || appraisal.metadata?.created_at;
            const appraisalId = appraisal.id || appraisal.postId;

            return (
              <TableRow 
                key={appraisalId} 
                className="hover:bg-muted/50 cursor-pointer"
                onClick={() => viewAppraisal(appraisalId)}
              >
                <TableCell className="font-mono text-xs">
                  {getShortId(appraisal.identifier || appraisalId)}
                </TableCell>
                <TableCell>
                  <div className="font-medium">{appraisal.name || appraisal.metadata?.title || 'Unnamed'}</div>
                  <div className="text-xs text-muted-foreground">{appraisal.type || appraisal.metadata?.object_type || 'Standard'}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm truncate max-w-[280px]" title={description}>
                    {description}
                  </div>
                </TableCell>
                <TableCell>
                  {getStatusBadge(status)}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-xs">
                      {date ? parseDate(date)?.toLocaleDateString() : 'N/A'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {date ? getRelativeTime(date) : ''}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <span title={customerName}>{customerName}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                  {getActionButtons(appraisal)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default AppraisalsTable;
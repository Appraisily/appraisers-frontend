import React from 'react';
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
import { Edit, CheckCircle, ArrowUpDown, Calendar, User, FileText, Settings, Clipboard, Eye, Trash2 } from "lucide-react";
import { parseDate, getRelativeTime } from '../utils/dateUtils';

const AppraisalsTable = ({ appraisals, currentAppraisalType, onActionClick, onSort, sortConfig, onRemove, onMoveToCompleted }) => {
  const navigate = useNavigate();

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

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <ArrowUpDown className="h-4 w-4" />;
    return sortConfig.direction === 'asc' 
      ? <ArrowUpDown className="h-4 w-4 text-primary" /> 
      : <ArrowUpDown className="h-4 w-4 text-primary rotate-180" />;
  };

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
    navigate(`/appraisals/completed/${id}`);
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
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => editAppraisal(appraisal.id)}
              title="Edit Appraisal"
            >
              <Edit className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                if (onMoveToCompleted) onMoveToCompleted(appraisal.id);
              }}
              title="Move to Completed"
            >
              <CheckCircle className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                if (onRemove) onRemove(appraisal.id);
              }}
              title="Remove Appraisal"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
        
        {isCompleted && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/appraisals/completed/${appraisal.id}`)}
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
            title="Edit in WordPress"
          >
            <FileText className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="rounded-md border shadow-elevation-1">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">
              <Button 
                variant="ghost" 
                className="font-medium hover:bg-transparent hover:underline px-0 flex items-center" 
                onClick={() => onSort('date')}
              >
                Date {getSortIcon('date')}
              </Button>
            </TableHead>
            
            <TableHead>
              <Button 
                variant="ghost" 
                className="font-medium hover:bg-transparent hover:underline px-0 flex items-center" 
                onClick={() => onSort('type')}
              >
                Type {getSortIcon('type')}
              </Button>
            </TableHead>
            
            <TableHead>
              <Button 
                variant="ghost" 
                className="font-medium hover:bg-transparent hover:underline px-0 flex items-center" 
                onClick={() => onSort('status')}
              >
                Status {getSortIcon('status')}
              </Button>
            </TableHead>
            
            <TableHead>
              <Button 
                variant="ghost" 
                className="font-medium hover:bg-transparent hover:underline px-0 flex items-center" 
                onClick={() => onSort('customer')}
              >
                Customer {getSortIcon('customer')}
              </Button>
            </TableHead>
            
            <TableHead className="hidden md:table-cell">Description</TableHead>
            
            <TableHead className="hidden sm:table-cell">
              <Button 
                variant="ghost" 
                className="font-medium hover:bg-transparent hover:underline px-0 flex items-center" 
                onClick={() => onSort('id')}
              >
                ID {getSortIcon('id')}
              </Button>
            </TableHead>
            
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        
        <TableBody>
          {appraisals.map((appraisal) => (
            <TableRow 
              key={appraisal.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => {
                if (onActionClick) {
                  onActionClick(appraisal);
                } else {
                  const path = currentAppraisalType === 'completed' 
                    ? `/appraisals/completed/${appraisal.id}` 
                    : `/appraisals/pending/${appraisal.id}`;
                  navigate(path);
                }
              }}
            >
              <TableCell className="font-medium">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {parseDate(appraisal.date)?.toLocaleDateString() || 'N/A'}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {getRelativeTime(appraisal.date)}
                </div>
              </TableCell>
              
              <TableCell>
                {appraisal.type || appraisal.appraisalType || 'Standard'}
              </TableCell>
              
              <TableCell>
                {getStatusBadge(appraisal.status)}
              </TableCell>
              
              <TableCell>
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {appraisal.customerName || appraisal.customer_name || 'Unknown'}
                    </span>
                  </div>
                  {appraisal.customerEmail && (
                    <div className="text-xs text-muted-foreground">
                      {appraisal.customerEmail}
                    </div>
                  )}
                </div>
              </TableCell>
              
              <TableCell className="max-w-[300px] hidden md:table-cell">
                <div className="truncate">
                  {appraisal.description || 'No description available'}
                </div>
              </TableCell>
              
              <TableCell className="hidden sm:table-cell">
                <div className="font-mono text-xs">
                  <span className="px-2 py-1 rounded bg-muted">
                    {getShortId(appraisal.identifier) || appraisal.id}
                  </span>
                </div>
              </TableCell>
              
              <TableCell className="text-right">
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
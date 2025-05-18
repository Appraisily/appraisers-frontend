import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as appraisalService from '../services/appraisals';
import { checkAuth } from '../services/auth';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Controls from '../components/Controls';
import AppraisalsTable from '../components/AppraisalsTable';
import PaginationControls from '../components/PaginationControls';
import LoadingSpinner from '../components/LoadingSpinner';
import Logo from '../components/Logo';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import './Dashboard.css';
import { useToast } from '@/components/ui/use-toast.jsx';

const Dashboard = () => {
  const [appraisalsList, setAppraisalsList] = useState([]);
  const [allAppraisals, setAllAppraisals] = useState([]);
  const [currentAppraisalType, setCurrentAppraisalType] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [cleaningList, setCleaningList] = useState(false);
  const [cleanupMessage, setCleanupMessage] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: 'date',
    direction: currentAppraisalType === 'completed' ? 'desc' : 'asc'
  });
  const [removingAppraisalId, setRemovingAppraisalId] = useState(null);
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName');
  const { toast } = useToast();

  useEffect(() => {
    if (checkAuth()) {
      loadAppraisals(currentAppraisalType);
    } else {
      // Redirect to login page if not authenticated
      navigate('/login');
    }
  }, [currentAppraisalType, navigate]);

  useEffect(() => {
    // Reset to first page when changing appraisal type
    setCurrentPage(1);
    
    // Set default sort direction based on appraisal type
    setSortConfig({
      key: 'date',
      direction: currentAppraisalType === 'completed' ? 'desc' : 'asc'
    });
  }, [currentAppraisalType]);

  // Apply sorting to all appraisals
  useEffect(() => {
    if (allAppraisals.length > 0) {
      const sorted = sortAppraisals([...allAppraisals], sortConfig);
      setAppraisalsList(sorted);
      setCurrentPage(1); // Reset to first page when sorting
    }
  }, [sortConfig, allAppraisals]);

  const sortAppraisals = (appraisals, config) => {
    return [...appraisals].sort((a, b) => {
      const key = config.key;
      let valA, valB;
      
      if (key === 'customer_name') {
        valA = a.customer_name || a.customerName || a.metadata?.customer_name;
        valB = b.customer_name || b.customerName || b.metadata?.customer_name;
      } else if (key === 'status') {
        valA = a.status || a.metadata?.appraisal_status;
        valB = b.status || b.metadata?.appraisal_status;
      } else if (key === 'date') {
        valA = a.date || a.createdAt || a.metadata?.created_at;
        valB = b.date || b.createdAt || b.metadata?.created_at;
      } else if (key === 'name') {
        valA = a.name || a.metadata?.title;
        valB = b.name || b.metadata?.title;
      } else {
        valA = a[key];
        valB = b[key];
      }

      valA = valA ?? '';
      valB = valB ?? '';

      if (valA < valB) {
        return config.direction === 'asc' ? -1 : 1;
      }
      if (valA > valB) {
        return config.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const loadAppraisals = async (type) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await (type === 'completed' ? 
        appraisalService.getCompleted() : 
        appraisalService.getPending()
      );

      // Set initial default sorting
      const sortedData = sortAppraisals([...data], {
        key: 'date',
        direction: type === 'completed' ? 'desc' : 'asc'
      });

      setAllAppraisals(data); // Store original unsorted data
      setAppraisalsList(sortedData); // Store sorted data for display
      setCurrentPage(1); // Reset to first page when loading new data
    } catch (err) {
      console.error('Error loading appraisals:', err);
      setError(err.message || 'Failed to load appraisals');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleSearch = (query) => {
    if (!query.trim()) {
      // Reset to sorted all appraisals
      const sorted = sortAppraisals([...allAppraisals], sortConfig);
      setAppraisalsList(sorted);
      setCurrentPage(1); // Reset to first page when clearing search
      return;
    }

    const filteredAppraisals = allAppraisals.filter(appraisal => 
      Object.values(appraisal)
        .join(' ')
        .toLowerCase()
        .includes(query.toLowerCase())
    );

    // Apply current sorting to filtered results
    const sortedFiltered = sortAppraisals(filteredAppraisals, sortConfig);
    setAppraisalsList(sortedFiltered);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleCleanList = async () => {
    try {
      setCleaningList(true);
      setCleanupMessage(null);
      const result = await appraisalService.cleanupMovedToCompleted();
      
      // Show success message
      setCleanupMessage({
        type: 'success',
        text: `${result.cleanedCount} "Moved to Completed" or "REMOVED" entries have been deleted from the list.`
      });
      
      // Reload the list
      await loadAppraisals(currentAppraisalType);
    } catch (error) {
      console.error('Error cleaning list:', error);
      setCleanupMessage({
        type: 'error',
        text: error.message || "Something went wrong while cleaning the list."
      });
    } finally {
      setCleaningList(false);
    }
  };

  const handleRemoveAppraisal = async (id) => {
    if (!id) return;
    
    // Confirm before removal
    if (!window.confirm('Are you sure you want to remove this appraisal? It will be moved to the "Removed Appraisals" sheet.')) {
      return;
    }
    
    setRemovingAppraisalId(id);
    
    try {
      await appraisalService.removeAppraisal(id);
      // Reload the appraisals list
      await loadAppraisals(currentAppraisalType);
      setRemovingAppraisalId(null);
    } catch (error) {
      console.error('Error removing appraisal:', error);
      setError(`Failed to remove appraisal: ${error.message}`);
      setRemovingAppraisalId(null);
    }
  };

  const handleMoveToCompleted = async (id) => {
    try {
      if (!confirm('Are you sure you want to move this appraisal to the completed sheet?')) {
        return;
      }
      
      setLoading(true);
      await appraisalService.moveToCompleted(id);
      
      // Show success notification
      toast({
        title: "Success",
        description: "Appraisal moved to completed successfully",
        variant: "success"
      });
      
      // Refresh the list after moving
      loadAppraisals(currentAppraisalType);
    } catch (error) {
      console.error('Error moving appraisal to completed:', error);
      
      // Show error notification
      toast({
        title: "Error",
        description: error.message || "Failed to move appraisal to completed",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = appraisalsList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(appraisalsList.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // If not authenticated, the useEffect will redirect to login page
  // So we don't need to render the login form here anymore
  if (!userName) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto py-6 px-4">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold tracking-tight">Appraisals Dashboard</h1>
            
            {currentAppraisalType === 'pending' && (
              <Button 
                variant="outline" 
                onClick={handleCleanList} 
                disabled={cleaningList}
                className="flex items-center gap-2"
              >
                {cleaningList ? (
                  <>
                    <LoadingSpinner size="small" /> 
                    Cleaning...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" /> 
                    Clean "Moved to Completed" & "REMOVED"
                  </>
                )}
              </Button>
            )}
          </div>
          
          {cleanupMessage && (
            <div className={`p-4 mb-2 text-sm rounded-md ${
              cleanupMessage.type === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {cleanupMessage.text}
            </div>
          )}
          
          <Controls
            currentAppraisalType={currentAppraisalType}
            onTypeChange={setCurrentAppraisalType}
            onSearch={handleSearch}
            onNewAppraisal={() => navigate('/new-appraisal')}
          />
          
          {loading && <LoadingSpinner />}
          
          {!loading && error && (
            <div className="rounded-lg border border-destructive p-4 text-destructive">
              {error}
            </div>
          )}
          
          {!loading && !error && (
            <AppraisalsTable
              appraisals={currentItems}
              currentAppraisalType={currentAppraisalType}
              onActionClick={(appraisal) => {
                const params = new URLSearchParams({
                  id: appraisal.id,
                  wpUrl: appraisal.wordpressUrl || '',
                  sessionId: appraisal.identifier || '',
                  email: appraisal.customerEmail || '',
                  name: appraisal.customerName || ''
                });

                // Check if this is a bulk appraisal
                const isBulkAppraisal = appraisal.appraisalType && 
                  (appraisal.appraisalType.startsWith('Bulk_') || 
                   appraisal.appraisalType.includes('Bulk'));

                if (isBulkAppraisal) {
                  console.log('Bulk appraisal detected in dashboard, navigating to bulk processing page');
                  navigate(`/bulk-appraisal?id=${appraisal.id}`);
                } else if (currentAppraisalType === 'pending') {
                  navigate(`/appraisals/pending/${appraisal.id}`);
                } else {
                  navigate(`/edit-appraisal?${params.toString()}`);
                }
              }}
              onSort={handleSort}
              sortConfig={sortConfig}
              onRemove={handleRemoveAppraisal}
              onMoveToCompleted={handleMoveToCompleted}
            />
          )}
          
          {!loading && appraisalsList.length > 0 && (
            <div className="mt-4">
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={paginate}
                className="py-2"
              />
              <div className="text-xs text-muted-foreground text-center mt-2">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, appraisalsList.length)} of {appraisalsList.length} appraisals
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Loading overlay for when removing an appraisal */}
      {removingAppraisalId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg shadow-lg flex flex-col items-center">
            <LoadingSpinner />
            <p className="mt-4 text-center">Removing appraisal...</p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Dashboard;
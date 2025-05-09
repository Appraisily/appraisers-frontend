import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as appraisalService from '../services/appraisals';
import { checkAuth } from '../services/auth';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Controls from '../components/Controls';
import AppraisalsTable from '../components/AppraisalsTable';
import PaginationControls from '../components/PaginationControls';
import LoginForm from '../components/LoginForm';
import LoadingSpinner from '../components/LoadingSpinner';
import Logo from '../components/Logo';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import './Dashboard.css';

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
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName');

  useEffect(() => {
    if (checkAuth()) {
      loadAppraisals(currentAppraisalType);
    } else {
      setLoading(false);
    }
  }, [currentAppraisalType]);

  useEffect(() => {
    // Reset to first page when changing appraisal type
    setCurrentPage(1);
  }, [currentAppraisalType]);

  const loadAppraisals = async (type) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await (type === 'completed' ? 
        appraisalService.getCompleted() : 
        appraisalService.getPending()
      );

      // Sort the appraisals based on type:
      // - Completed appraisals: Most recent first (newest to oldest)
      // - Pending appraisals: Oldest first (oldest to newest)
      const sortedData = [...data].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        
        if (type === 'completed') {
          return dateB - dateA; // Most recent first for completed
        } else {
          return dateA - dateB; // Oldest first for pending
        }
      });

      setAppraisalsList(sortedData);
      setAllAppraisals(sortedData);
      setCurrentPage(1); // Reset to first page when loading new data
    } catch (err) {
      console.error('Error loading appraisals:', err);
      setError(err.message || 'Failed to load appraisals');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    if (!query.trim()) {
      setAppraisalsList(allAppraisals);
      setCurrentPage(1); // Reset to first page when clearing search
      return;
    }

    const filteredAppraisals = allAppraisals.filter(appraisal => 
      Object.values(appraisal)
        .join(' ')
        .toLowerCase()
        .includes(query.toLowerCase())
    );

    setAppraisalsList(filteredAppraisals);
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
        text: `${result.cleanedCount} "Moved to Completed" entries have been removed.`
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

  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = appraisalsList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(appraisalsList.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (!userName) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="w-full max-w-md space-y-8">
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-4 flex flex-col items-center pb-8">
              <div className="flex flex-col items-center gap-4">
                <Logo size="large" />
                <h1 className="text-2xl font-semibold tracking-tight">
                  Appraisily
                </h1>
              </div>
              <div className="space-y-2 text-center">
                <CardTitle className="text-lg font-semibold tracking-tight">
                  Welcome to Appraisers Dashboard
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Sign in to manage your appraisals
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <LoginForm />
            </CardContent>
          </Card>
        </div>
      </div>
    );
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
                    Clean "Moved to Completed"
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

      <Footer />
    </div>
  );
};

export default Dashboard;
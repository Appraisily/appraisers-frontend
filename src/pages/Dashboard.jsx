import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as appraisalService from '../services/appraisals';
import { checkAuth } from '../services/auth';
import { useWebSocketUpdates } from '../services/websocket';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Controls from '../components/Controls';
import AppraisalsTable from '../components/AppraisalsTable';
import PaginationControls from '../components/PaginationControls';
import LoginForm from '../components/LoginForm';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusUpdateToast from '../components/StatusUpdateToast';
import Logo from '../components/Logo';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import './Dashboard.css';

const Dashboard = () => {
  const [appraisalsList, setAppraisalsList] = useState([]);
  const [allAppraisals, setAllAppraisals] = useState([]);
  const [currentAppraisalType, setCurrentAppraisalType] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [activeToast, setActiveToast] = useState(null);
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName');
  
  // WebSocket status updates
  const { isConnected, statusUpdates, clearStatusUpdate } = useWebSocketUpdates();

  useEffect(() => {
    if (checkAuth()) {
      loadAppraisals(currentAppraisalType);
    } else {
      setLoading(false);
    }
  }, [currentAppraisalType]);

  // Process real-time updates from WebSocket
  useEffect(() => {
    if (statusUpdates.length > 0) {
      // Get the first update to process
      const update = statusUpdates[0];
      
      // Show toast notification for status change
      setActiveToast(update);
      
      // Update the appraisal in the list if it exists
      setAppraisalsList(prevList => {
        const updatedList = prevList.map(appraisal => {
          if (appraisal.id === update.id) {
            return { ...appraisal, ...update };
          }
          return appraisal;
        });
        
        // If the appraisal wasn't in the list and it matches the current type, add it
        const exists = updatedList.some(appraisal => appraisal.id === update.id);
        if (!exists && 
            ((currentAppraisalType === 'pending' && update.status !== 'completed') || 
             (currentAppraisalType === 'completed' && update.status === 'completed'))) {
          return [...updatedList, update];
        }
        
        return updatedList;
      });
      
      // Also update the allAppraisals state for search functionality
      setAllAppraisals(prevList => {
        const updatedList = prevList.map(appraisal => {
          if (appraisal.id === update.id) {
            return { ...appraisal, ...update };
          }
          return appraisal;
        });
        
        const exists = updatedList.some(appraisal => appraisal.id === update.id);
        if (!exists) {
          return [...updatedList, update];
        }
        
        return updatedList;
      });
      
      // Clear the processed update
      clearStatusUpdate(update.id);
    }
  }, [statusUpdates, currentAppraisalType, clearStatusUpdate]);

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
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 relative">
        {error && (
          <div className="p-4 mb-4 text-sm text-red-500 bg-red-50 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <Controls
          onPendingClick={() => setCurrentAppraisalType('pending')}
          onCompletedClick={() => setCurrentAppraisalType('completed')}
          onSearch={handleSearch}
          isRefreshing={loading}
          onRefresh={() => loadAppraisals(currentAppraisalType)}
          isWebSocketConnected={isConnected}
        />

        <div className="relative">
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

              if (currentAppraisalType === 'pending') {
                navigate(`/appraisal?${params.toString()}`);
              } else {
                navigate(`/edit-appraisal?${params.toString()}`);
              }
            }}
          />
          
          {loading && <LoadingSpinner />}
          
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
      
      {/* Status update toast notification */}
      {activeToast && (
        <StatusUpdateToast 
          update={activeToast} 
          onClose={() => setActiveToast(null)} 
        />
      )}
    </div>
  );
};

export default Dashboard;
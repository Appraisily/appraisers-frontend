import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as appraisalService from '../services/appraisals';
import { checkAuth } from '../services/auth';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Controls from '../components/Controls';
import AppraisalsTable from '../components/AppraisalsTable';
import LoginForm from '../components/LoginForm';
import LoadingSpinner from '../components/LoadingSpinner';
import Logo from '../components/Logo';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import './Dashboard.css';

const Dashboard = () => {
  const [appraisalsList, setAppraisalsList] = useState([]);
  const [allAppraisals, setAllAppraisals] = useState([]);
  const [currentAppraisalType, setCurrentAppraisalType] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName');

  useEffect(() => {
    if (checkAuth()) {
      loadAppraisals(currentAppraisalType);
    } else {
      setLoading(false);
    }
  }, [currentAppraisalType]);

  const loadAppraisals = async (type) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await (type === 'completed' ? 
        appraisalService.getCompleted() : 
        appraisalService.getPending()
      );

      setAppraisalsList(data);
      setAllAppraisals(data);
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
      return;
    }

    const filteredAppraisals = allAppraisals.filter(appraisal => 
      Object.values(appraisal)
        .join(' ')
        .toLowerCase()
        .includes(query.toLowerCase())
    );

    setAppraisalsList(filteredAppraisals);
  };

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
        />

        <div className="relative">
          <AppraisalsTable
            appraisals={appraisalsList}
            currentAppraisalType={currentAppraisalType}
            onActionClick={(id, url = '', sessionId = '', email = '', name = '') => {
              const path = currentAppraisalType === 'pending' ? '/appraisal' : '/edit-appraisal';
              const params = new URLSearchParams({
                id,
                wpUrl: url || '',
                sessionId: sessionId || '',
                email: email || '',
                name: name || ''
              });
              navigate(`${path}?${params.toString()}`);
            }}
          />
          {loading && <LoadingSpinner />}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
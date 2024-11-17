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
      <div className="login-container">
        <div className="login-box">
          <Logo size="medium" />
          <div className="welcome-text">
            <h1>Welcome to Appraisers Dashboard</h1>
            <p>Please sign in to continue</p>
          </div>
          <LoginForm />
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Header />
      {loading && <LoadingSpinner message="Loading appraisals..." />}
      
      {error && (
        <div className="message error">
          {error}
        </div>
      )}

      <Controls
        onPendingClick={() => setCurrentAppraisalType('pending')}
        onCompletedClick={() => setCurrentAppraisalType('completed')}
        onSearch={handleSearch}
      />

      <AppraisalsTable
        appraisals={appraisalsList}
        currentAppraisalType={currentAppraisalType}
        onActionClick={(id, url) => {
          const path = currentAppraisalType === 'pending' ? '/appraisal' : '/edit-appraisal';
          navigate(`${path}?id=${id}&wpUrl=${encodeURIComponent(url)}`);
        }}
      />

      <Footer />
    </div>
  );
};

export default Dashboard;
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AppraisalPage from './pages/AppraisalPage';
import EditAppraisalPage from './pages/EditAppraisalPage';
import BulkAppraisalPage from './pages/BulkAppraisalPage';
import CompletedAppraisalPage from './pages/CompletedAppraisalPage';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        
        {/* New routes with ID parameters */}
        <Route path="/appraisals/pending/:id" element={<AppraisalPage />} />
        <Route path="/appraisals/completed/:id" element={<CompletedAppraisalPage />} />
        
        {/* Keep edit and bulk routes (assuming they might need separate logic or already use query params) */}
        <Route path="/edit-appraisal" element={<EditAppraisalPage />} />
        <Route path="/bulk-appraisal" element={<BulkAppraisalPage />} />
        
        {/* Remove old query parameter routes */}
        {/* <Route path="/appraisal" element={<AppraisalPage />} /> */}
        {/* <Route path="/completed-appraisal" element={<CompletedAppraisalPage />} /> */}
        
        {/* Optional: Add a redirect or not found page for the old routes if needed */}

      </Routes>
    </div>
  );
}

export default App;
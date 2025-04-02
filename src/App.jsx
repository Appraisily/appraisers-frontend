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
        <Route path="/appraisal" element={<AppraisalPage />} />
        <Route path="/edit-appraisal" element={<EditAppraisalPage />} />
        <Route path="/bulk-appraisal" element={<BulkAppraisalPage />} />
        <Route path="/completed-appraisal" element={<CompletedAppraisalPage />} />
      </Routes>
    </div>
  );
}

export default App;
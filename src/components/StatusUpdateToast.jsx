import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const StatusUpdateToast = ({ update, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Show the toast with a slight delay for animation
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    // Auto-close after 5 seconds
    const closeTimer = setTimeout(() => {
      setIsVisible(false);
      // Wait for exit animation to complete before calling onClose
      setTimeout(onClose, 300);
    }, 5000);
    
    return () => {
      clearTimeout(showTimer);
      clearTimeout(closeTimer);
    };
  }, [onClose]);
  
  // Get status badge color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'completed':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };
  
  if (!update) return null;
  
  return (
    <div 
      className={`fixed bottom-4 right-4 max-w-sm bg-white rounded-lg shadow-lg border p-4 transform transition-all duration-300 ease-in-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <div className="font-semibold text-gray-900">
            Appraisal Update
          </div>
          <div className="mt-1 text-sm text-gray-600">
            {update.customerName || 'Appraisal'} status changed to:
          </div>
          <div className={`inline-flex items-center px-2.5 py-0.5 mt-2 rounded-full text-xs font-medium ${getStatusColor(update.status)}`}>
            {update.status}
          </div>
        </div>
        <button 
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="text-gray-400 hover:text-gray-500"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default StatusUpdateToast;
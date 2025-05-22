import React, { useState } from 'react';
import { reprocessByPostId } from '../services/appraisals';
import LoadingSpinner from './LoadingSpinner';
import { useToast } from '@/components/ui/use-toast.jsx';

const ReprocessByPostIdModal = ({ isOpen, onClose }) => {
  const [postId, setPostId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!postId || postId.trim() === '') {
      setError('Please enter a WordPress post ID');
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);
      setSuccess(null);

      console.log(`Initiating reprocessing for WordPress post ID: ${postId}`);
      const response = await reprocessByPostId(postId);
      
      setSuccess('Appraisal reprocessing started successfully. This will continue in the background.');
      console.log('Reprocessing response:', response);
      
      // Show success toast
      toast({
        title: "Reprocessing Started",
        description: `Appraisal with post ID ${postId} is being reprocessed. This will continue in the background.`,
        variant: "success"
      });
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setPostId('');
        setSuccess(null);
        onClose();
      }, 3000);
      
    } catch (error) {
      console.error('Error reprocessing by post ID:', error);
      setError(error.message || 'Failed to reprocess appraisal. Please try again.');
      
      // Show error toast
      toast({
        title: "Reprocessing Failed",
        description: error.message || "Failed to reprocess appraisal. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Reprocess by WordPress Post ID</h2>
        
        <p className="mb-4 text-gray-600">
          Enter a WordPress post ID to reprocess the entire appraisal. This will generate a new report with the latest data.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="postId" className="block text-sm font-medium text-gray-700 mb-1">
              WordPress Post ID
            </label>
            <input
              type="text"
              id="postId"
              value={postId}
              onChange={(e) => setPostId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter post ID"
              disabled={isProcessing}
            />
          </div>
          
          {error && (
            <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-2 bg-green-100 border border-green-400 text-green-700 rounded">
              {success}
            </div>
          )}
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={isProcessing}
            >
              {isProcessing ? <LoadingSpinner size="sm" /> : 'Reprocess'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReprocessByPostIdModal; 
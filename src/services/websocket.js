import { useEffect, useRef, useState } from 'react';

// WebSocket service for real-time appraisal status updates
export const useWebSocketUpdates = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [statusUpdates, setStatusUpdates] = useState([]);
  const socketRef = useRef(null);

  const connect = () => {
    // Get WebSocket URL from environment variables or use a default
    const wsUrl = import.meta.env.VITE_WS_URL || 
      `ws://${window.location.hostname}:${import.meta.env.VITE_BACKEND_PORT || '3000'}/ws`;
    
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }

    console.log(`Connecting to WebSocket at ${wsUrl}`);
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('WebSocket connection established');
      setIsConnected(true);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('WebSocket received message:', data);
        
        if (data.type === 'appraisal_update') {
          setStatusUpdates(prev => [...prev, data.payload]);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
      setIsConnected(false);
      
      // Try to reconnect after a delay
      setTimeout(() => {
        if (document.visibilityState !== 'hidden') {
          connect();
        }
      }, 3000);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      socket.close();
    };

    // Handle page visibility changes to reconnect when returning to tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && 
          socketRef.current?.readyState !== WebSocket.OPEN) {
        connect();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  };

  useEffect(() => {
    connect();
    
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  // Clear a specific status update from the queue
  const clearStatusUpdate = (appraisalId) => {
    setStatusUpdates(prev => prev.filter(update => update.id !== appraisalId));
  };

  // Clear all status updates
  const clearAllStatusUpdates = () => {
    setStatusUpdates([]);
  };

  return {
    isConnected,
    statusUpdates,
    clearStatusUpdate,
    clearAllStatusUpdates
  };
};
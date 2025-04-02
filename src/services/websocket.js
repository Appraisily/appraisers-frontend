import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for WebSocket connection and real-time appraisal status updates
 * Handles secure connections (WSS) for HTTPS and standard connections (WS) for HTTP
 */
export const useWebSocketUpdates = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [statusUpdates, setStatusUpdates] = useState([]);
  const [connectionError, setConnectionError] = useState(null);
  const socketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  
  const connect = () => {
    // Clear any existing connection error
    setConnectionError(null);
    
    // Determine the correct WebSocket protocol based on the current page protocol
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    
    // Get WebSocket URL from environment variables or fallback to backend URL
    let wsUrl = '';
    if (import.meta.env.VITE_WS_URL) {
      wsUrl = import.meta.env.VITE_WS_URL;
    } else if (import.meta.env.VITE_BACKEND_URL) {
      // Replace http/https with ws/wss and add /ws path
      wsUrl = import.meta.env.VITE_BACKEND_URL.replace(/^http/, 'ws') + '/ws';
    } else {
      // Fallback to same-origin WebSocket
      wsUrl = `${wsProtocol}//${window.location.hostname}${import.meta.env.VITE_BACKEND_PORT ? ':' + import.meta.env.VITE_BACKEND_PORT : ''}/ws`;
    }
    
    // Disable WebSocket for now if connecting to appraisily.com (known issue)
    if (wsUrl.includes('appraisily.com')) {
      console.log('WebSocket temporarily disabled for appraisily.com domain');
      setConnectionError('WebSocket connections temporarily disabled');
      return; // Skip connection attempt
    }
    
    // Don't attempt to reconnect if we already have an open connection
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }
    
    // Clear any existing reconnect timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    console.log(`Connecting to WebSocket at ${wsUrl} (Attempt ${reconnectAttemptsRef.current + 1}/${maxReconnectAttempts})`);
    
    try {
      const socket = new WebSocket(wsUrl);
      socketRef.current = socket;
      
      // Set connection timeout to abort if taking too long
      const connectionTimeout = setTimeout(() => {
        if (socket && socket.readyState !== WebSocket.OPEN) {
          console.warn('WebSocket connection timeout');
          socket.close();
          
          setConnectionError('Connection timeout. Please check your network connection.');
          handleReconnect();
        }
      }, 10000);
      
      socket.onopen = () => {
        console.log('WebSocket connection established');
        setIsConnected(true);
        reconnectAttemptsRef.current = 0; // Reset reconnect attempts on successful connection
        clearTimeout(connectionTimeout);
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'connection_established') {
            console.log('WebSocket handshake complete:', data.payload);
          } else if (data.type === 'appraisal_update') {
            console.log('WebSocket received update:', data.payload);
            setStatusUpdates(prev => [...prev, data.payload]);
          } else {
            console.log('WebSocket received message:', data);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      socket.onclose = (event) => {
        console.log(`WebSocket connection closed: ${event.code} - ${event.reason || 'No reason provided'}`);
        setIsConnected(false);
        clearTimeout(connectionTimeout);
        
        // Don't attempt to reconnect if closed normally
        if (event.code !== 1000) {
          handleReconnect();
        }
      };

      socket.onerror = (error) => {
        clearTimeout(connectionTimeout);
        
        // Check if error is due to mixed content (HTTPS page trying to connect to WS)
        const isMixedContentError = window.location.protocol === 'https:' && wsUrl.startsWith('ws:');
        if (isMixedContentError) {
          setConnectionError('Mixed content error: Cannot connect to insecure WebSocket (WS) from a secure page (HTTPS). Server must support WSS.');
          console.error('Mixed content error - secure page cannot connect to insecure WebSocket:', error);
        } else {
          setConnectionError('Connection error. Please check your network connection.');
          console.error('WebSocket error:', error);
        }
        
        setIsConnected(false);
        
        // Only attempt to close if the socket is still open
        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.close();
        }
        
        handleReconnect();
      };
      
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      setConnectionError('Failed to create WebSocket connection');
      handleReconnect();
    }
  };
  
  // Handle reconnection with exponential backoff
  const handleReconnect = () => {
    reconnectAttemptsRef.current += 1;
    
    if (reconnectAttemptsRef.current <= maxReconnectAttempts) {
      // Exponential backoff: 1s, 2s, 4s, 8s, 16s
      const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current - 1), 16000);
      
      console.log(`Scheduling reconnect attempt in ${delay}ms`);
      
      reconnectTimeoutRef.current = setTimeout(() => {
        // Only attempt to reconnect if the page is visible
        if (document.visibilityState !== 'hidden') {
          connect();
        }
      }, delay);
    } else {
      console.error(`Maximum reconnection attempts (${maxReconnectAttempts}) reached`);
      setConnectionError(`Failed to connect after ${maxReconnectAttempts} attempts. Please refresh the page.`);
    }
  };

  // Handle page visibility changes to reconnect when returning to tab
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // If we're visible again and not connected, try to reconnect
        if (socketRef.current?.readyState !== WebSocket.OPEN) {
          reconnectAttemptsRef.current = 0; // Reset attempts when user returns to page
          connect();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Initialize connection on component mount
  useEffect(() => {
    connect();
    
    return () => {
      // Clean up on unmount
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      
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
  
  // Manual reconnect function for user-initiated reconnection
  const reconnect = () => {
    reconnectAttemptsRef.current = 0;
    
    if (socketRef.current) {
      socketRef.current.close();
    }
    
    connect();
  };

  return {
    isConnected,
    statusUpdates,
    connectionError,
    clearStatusUpdate,
    clearAllStatusUpdates,
    reconnect
  };
};
import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for WebSocket connection and real-time appraisal status updates
 * Handles secure connections (WSS) for HTTPS and standard connections (WS) for HTTP
 * Includes heartbeat ping to prevent connection timeouts
 */
export const useWebSocketUpdates = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [statusUpdates, setStatusUpdates] = useState([]);
  const [connectionError, setConnectionError] = useState(null);
  const socketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const heartbeatIntervalRef = useRef(null);
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
      // Make WebSocket connection non-critical
      let socket;
      try {
        socket = new WebSocket(wsUrl);
        socketRef.current = socket;
      } catch (wsError) {
        console.warn('Failed to create WebSocket connection:', wsError);
        setConnectionError('WebSocket initialization failed - real-time updates will be disabled');
        return; // Exit early without attempting further connection
      }
      
      // Set connection timeout to abort if taking too long
      const connectionTimeout = setTimeout(() => {
        try {
          if (socket && socket.readyState !== WebSocket.OPEN) {
            console.warn('WebSocket connection timeout');
            socket.close();
            
            setConnectionError('Connection timeout. Real-time updates disabled.');
            handleReconnect();
          }
        } catch (e) {
          console.warn('Error during WebSocket timeout handling:', e);
        }
      }, 10000);
      
      socket.onopen = () => {
        console.log('WebSocket connection established');
        setIsConnected(true);
        reconnectAttemptsRef.current = 0; // Reset reconnect attempts on successful connection
        clearTimeout(connectionTimeout);
        
        // Set up heartbeat to keep connection alive
        if (heartbeatIntervalRef.current) {
          clearInterval(heartbeatIntervalRef.current);
        }
        
        heartbeatIntervalRef.current = setInterval(() => {
          if (socket.readyState === WebSocket.OPEN) {
            // Send ping to server
            socket.send(JSON.stringify({ type: 'ping', timestamp: new Date().toISOString() }));
          }
        }, 25000); // Ping every 25 seconds (less than server's 30-second interval)
      };

      socket.onmessage = (event) => {
        // Prevent any WebSocket message handling from crashing the app
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
          // Don't let message errors affect the app
        }
      };

      socket.onclose = (event) => {
        try {
          console.log(`WebSocket connection closed: ${event.code} - ${event.reason || 'No reason provided'}`);
          setIsConnected(false);
          clearTimeout(connectionTimeout);
          
          // Don't attempt to reconnect if closed normally
          if (event.code !== 1000) {
            handleReconnect();
          }
        } catch (error) {
          console.warn('Error in WebSocket onclose handler:', error);
          // Don't let close errors affect the app
        }
      };

      socket.onerror = (error) => {
        try {
          clearTimeout(connectionTimeout);
          
          // Check if error is due to mixed content (HTTPS page trying to connect to WS)
          const isMixedContentError = window.location.protocol === 'https:' && wsUrl.startsWith('ws:');
          if (isMixedContentError) {
            setConnectionError('Mixed content error: WebSocket connection not available');
            console.error('Mixed content error - secure page cannot connect to insecure WebSocket:', error);
          } else {
            setConnectionError('WebSocket connection error - real-time updates disabled');
            console.error('WebSocket error:', error);
          }
          
          setIsConnected(false);
          
          // Only attempt to close if the socket is still open
          if (socket && socket.readyState === WebSocket.OPEN) {
            socket.close();
          }
          
          handleReconnect();
        } catch (error) {
          console.warn('Error in WebSocket onerror handler:', error);
          // Don't let error handling errors affect the app
        }
      };
      
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      setConnectionError('Failed to create WebSocket connection');
      handleReconnect();
    }
  };
  
  // Handle reconnection with exponential backoff
  const handleReconnect = () => {
    try {
      reconnectAttemptsRef.current += 1;
      
      if (reconnectAttemptsRef.current <= maxReconnectAttempts) {
        // Exponential backoff: 1s, 2s, 4s, 8s, 16s
        const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current - 1), 16000);
        
        console.log(`Scheduling reconnect attempt in ${delay}ms`);
        
        // Clear any existing timeout first
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
        
        reconnectTimeoutRef.current = setTimeout(() => {
          try {
            // Only attempt to reconnect if the page is visible
            if (document.visibilityState !== 'hidden') {
              connect();
            }
          } catch (error) {
            console.warn('Error during WebSocket reconnect attempt:', error);
            // If reconnect fails, just disable WebSockets silently
          }
        }, delay);
      } else {
        console.log(`Maximum reconnection attempts (${maxReconnectAttempts}) reached`);
        setConnectionError(`WebSocket not available - real-time updates disabled`);
      }
    } catch (error) {
      console.warn('Error in WebSocket reconnect handler:', error);
      // Don't let reconnect errors affect the app
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
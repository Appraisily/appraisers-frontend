// WebSocket service has been disabled
export const useWebSocketUpdates = () => {
  // Return a dummy interface that does nothing
  return {
    isConnected: false,
    statusUpdates: [],
    connectionError: null,
    clearStatusUpdate: () => {},
    clearAllStatusUpdates: () => {},
    reconnect: () => {}
  };
};
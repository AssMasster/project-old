export const initializeSocketWithAuth = (socketService) => {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    console.warn('No auth token found for WebSocket connection');
    return false;
  }

  socketService.connect();
  
  socketService.on('connect', () => {
    socketService.emit('authenticate', { token }, (response) => {
      if (response.status !== 'success') {
        console.error('WebSocket authentication failed:', response.message);
      }
    });
  });

  return true;
};

export const sendMessageViaSocket = (socketService, messageData) => {
  return new Promise((resolve, reject) => {
    socketService.emit('sendMessage', messageData, (response) => {
      if (response.status === 'success') {
        resolve(response.data);
      } else {
        reject(new Error(response.message || 'Failed to send message'));
      }
    });
  });
};

export const useSocket = (event, callback, dependencies = []) => {
  const { useEffect } = require('react');
  
  useEffect(() => {
    if (event && callback) {
      socketService.on(event, callback);
      
      return () => {
        socketService.removeListener(event, callback);
      };
    }
  }, [event, callback, ...dependencies]);
  
  return socketService;
};
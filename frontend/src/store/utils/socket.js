import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.listeners = new Map();
  }

  connect() {
    if (this.socket) {
      console.warn('WebSocket already exists');
      return;
    }

    this.socket = io({
      transports: ['websocket', 'polling'],
      timeout: 10000,
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    this.socket.on('connect', () => {
      this.isConnected = true;
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.warn('WebSocket disconnected:', reason);
      this.isConnected = false;
      
      if (reason === 'io server disconnect') {
        this.socket.connect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.isConnected = false;
    });

    this.socket.on('reconnect_attempt', (attempt) => {
      this.reconnectAttempts = attempt;
    });

    this.socket.on('reconnect', (attempt) => {
      console.warn(`WebSocket reconnected successfully after ${attempt} attempts`);
      this.isConnected = true;
      this.reconnectAttempts = 0;
    });

    this.socket.on('reconnect_failed', () => {
      console.error('WebSocket reconnection failed after all attempts');
      this.isConnected = false;
    });

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.listeners.clear();
    }
  }

  onNewMessage(callback) {
    if (!this.socket) {
      console.warn('WebSocket not connected, cannot add listener');
      return;
    }

    this.socket.on('newMessage', callback);
    this.listeners.set('newMessage', callback);
  }

  on(event, callback) {
    if (!this.socket) {
      console.warn('WebSocket not connected, cannot add listener');
      return;
    }

    this.socket.on(event, callback);
    this.listeners.set(event, callback);
  }

  emit(event, data, callback) {
    if (!this.socket || !this.isConnected) {
      console.warn('WebSocket not connected, cannot emit event');
      if (callback) callback(new Error('WebSocket not connected'));
      return;
    }

    this.socket.emit(event, data, callback);
  }

  removeListener(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
      this.listeners.delete(event);
    }
  }

  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.listeners.clear();
    }
  }

  getConnectionState() {
    if (!this.socket) return 'disconnected';
    
    return this.socket.connected ? 'connected' : 'disconnected';
  }

  getSocketId() {
    return this.socket?.id || null;
  }

  reconnect() {
    if (this.socket) {
      this.socket.connect();
    }
  }

  getStats() {
    return {
      isConnected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      maxReconnectAttempts: this.maxReconnectAttempts,
      socketId: this.getSocketId(),
    };
  }
}

const socketService = new SocketService();

export default socketService;
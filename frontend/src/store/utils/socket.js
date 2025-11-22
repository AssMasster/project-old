import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.listeners = new Map(); // Для хранения колбэков
  }

  connect() {
    if (this.socket) {
      console.log('WebSocket already exists');
      return;
    }

    console.log('Connecting WebSocket...');

    this.socket = io({
      transports: ['websocket', 'polling'], // Fallback механизм
      timeout: 10000,
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    // Обработчик успешного подключения
    this.socket.on('connect', () => {
      console.log('WebSocket connected successfully');
      this.isConnected = true;
      this.reconnectAttempts = 0;
    });

    // Обработчик отключения
    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      this.isConnected = false;
      
      if (reason === 'io server disconnect') {
        this.socket.connect();
      }
    });

    // Обработчик ошибки подключения
    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.isConnected = false;
    });

    // Обработчик попытки переподключения
    this.socket.on('reconnect_attempt', (attempt) => {
      this.reconnectAttempts = attempt;
      console.log(`WebSocket reconnect attempt: ${attempt}/${this.maxReconnectAttempts}`);
    });

    // Обработчик успешного переподключения
    this.socket.on('reconnect', (attempt) => {
      console.log(`WebSocket reconnected successfully after ${attempt} attempts`);
      this.isConnected = true;
      this.reconnectAttempts = 0;
    });

    // Обработчик неудачного переподключения
    this.socket.on('reconnect_failed', () => {
      console.error('WebSocket reconnection failed after all attempts');
      this.isConnected = false;
    });

    // Обработчик ошибки
    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  }

  // Отключение WebSocket
  disconnect() {
    if (this.socket) {
      console.log('Disconnecting WebSocket...');
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.listeners.clear();
    }
  }

  // Подписка на событие новых сообщений
  onNewMessage(callback) {
    if (!this.socket) {
      console.warn('WebSocket not connected, cannot add listener');
      return;
    }

    this.socket.on('newMessage', callback);
    this.listeners.set('newMessage', callback);
  }

  // Подписка на любое событие
  on(event, callback) {
    if (!this.socket) {
      console.warn('WebSocket not connected, cannot add listener');
      return;
    }

    this.socket.on(event, callback);
    this.listeners.set(event, callback);
  }

  // Отправка события на сервер
  emit(event, data, callback) {
    if (!this.socket || !this.isConnected) {
      console.warn('WebSocket not connected, cannot emit event');
      if (callback) callback(new Error('WebSocket not connected'));
      return;
    }

    this.socket.emit(event, data, callback);
  }

  // Удаление конкретного слушателя
  removeListener(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
      this.listeners.delete(event);
    }
  }

  // Удаление всех слушателей
  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.listeners.clear();
    }
  }

  // Получение текущего состояния подключения
  getConnectionState() {
    if (!this.socket) return 'disconnected';
    
    return this.socket.connected ? 'connected' : 'disconnected';
  }

  // Получение ID сокета
  getSocketId() {
    return this.socket?.id || null;
  }

  // Принудительное переподключение
  reconnect() {
    if (this.socket) {
      this.socket.connect();
    }
  }

  // Получение статистики подключения
  getStats() {
    return {
      isConnected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      maxReconnectAttempts: this.maxReconnectAttempts,
      socketId: this.getSocketId(),
    };
  }
}

// Создаем единственный экземпляр (Singleton)
const socketService = new SocketService();

export default socketService;
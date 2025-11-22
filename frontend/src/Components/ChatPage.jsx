// frontend/src/components/ChatPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChannels, setCurrentChannel } from '../store/slices/channelsSlice';
import { fetchMessages, sendMessage, addMessageFromSocket } from '../store/slices/messagesSlice';
import socketService from '../utils/socket';

const ChatPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [newMessage, setNewMessage] = useState('');
  
  const { items: channels, currentChannelId, loading: channelsLoading } = useSelector(state => state.channels);
  const { items: messages, loading: messagesLoading, sending: messageSending } = useSelector(state => state.messages);
  
  const currentChannel = channels.find(channel => channel.id === currentChannelId);
  const channelMessages = messages.filter(message => message.channelId === currentChannelId);

  useEffect(() => {
    // Проверка авторизации
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    // Загрузка данных
    dispatch(fetchChannels());
    dispatch(fetchMessages());

    // Подключение WebSocket
    socketService.connect();

    // Подписка на новые сообщения
    socketService.onNewMessage((message) => {
      console.log('New message received:', message);
      dispatch(addMessageFromSocket(message));
    });

    // Очистка при размонтировании
    return () => {
      socketService.removeAllListeners();
      socketService.disconnect();
    };
  }, [navigate, dispatch]);

  // Обработчик отправки сообщения
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !currentChannelId || messageSending) return;

    try {
      await dispatch(sendMessage({
        channelId: currentChannelId,
        body: newMessage.trim(),
      })).unwrap();
      
      setNewMessage(''); // Очищаем поле ввода
    } catch (error) {
      console.error('Ошибка отправки сообщения:', error);
      // Можно показать уведомление пользователю
    }
  };

  if (channelsLoading || messagesLoading) {
    return <div>Загрузка чата...</div>;
  }

  return (
    <div className="chat-container">
      <div className="channels-sidebar">
        <h3>Каналы</h3>
        <ul>
          {channels.map(channel => (
            <li 
              key={channel.id} 
              className={channel.id === currentChannelId ? 'active' : ''}
              onClick={() => dispatch(setCurrentChannel(channel.id))}
            >
              # {channel.name}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="chat-main">
        <h3># {currentChannel?.name || 'Выберите канал'}</h3>
        
        {/* Индикатор подключения */}
        <div className="connection-status">
          {socketService.isConnected ? '🟢 Online' : '🔴 Offline'}
        </div>
        
        <div className="messages-container">
          {channelMessages.map(message => (
            <div key={message.id} className="message">
              <strong>{message.username}:</strong> {message.body}
              <small> ({new Date(message.createdAt).toLocaleTimeString()})</small>
            </div>
          ))}
        </div>
        
        <form className="message-form" onSubmit={handleSendMessage}>
          <input 
            type="text" 
            placeholder="Введите сообщение..." 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={messageSending}
          />
          <button type="submit" disabled={messageSending || !newMessage.trim()}>
            {messageSending ? 'Отправка...' : 'Отправить'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
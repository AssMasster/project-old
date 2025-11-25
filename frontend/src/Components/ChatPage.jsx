import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChannels, setCurrentChannel } from '../store/slices/channelsSlice';
import { fetchMessages, sendMessage, addMessageFromSocket } from '../store/slices/messagesSlice';
import socketService from '../utils/socket';
import AddChannelModal from './modals/AddChannelModal';
import RemoveChannelModal from './modals/RemoveChannelModal';
import RenameChannelModal from './modals/RenameChannelModal';
import ChannelDropdown from './ChannelDropdown';

const ChatPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [newMessage, setNewMessage] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [selectedChannelId, setSelectedChannelId] = useState(null);
  
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

  // Обработчики модальных окон
  const handleShowAddModal = () => setShowAddModal(true);
  const handleHideAddModal = () => setShowAddModal(false);

  const handleShowRemoveModal = (channelId) => {
    setSelectedChannelId(channelId);
    setShowRemoveModal(true);
  };

  const handleHideRemoveModal = () => {
    setShowRemoveModal(false);
    setSelectedChannelId(null);
  };

  const handleShowRenameModal = (channelId) => {
    setSelectedChannelId(channelId);
    setShowRenameModal(true);
  };

  const handleHideRenameModal = () => {
    setShowRenameModal(false);
    setSelectedChannelId(null);
  };

  if (channelsLoading || messagesLoading) {
    return (
      <div className="chat-container">
        <div className="loading-container">
          <div>{t('common.loading')}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="channels-sidebar">
        <div className="channels-header">
          <h3>{t('channels.channels')}</h3>
          <button 
            type="button" 
            className="btn btn-sm btn-outline-primary channel-add-btn"
            onClick={handleShowAddModal}
            title={t('channels.addChannel')}
          >
            +
          </button>
        </div>
        
        <ul className="channels-list">
          {channels.map(channel => (
            <ChannelDropdown
              key={channel.id}
              channelId={channel.id}
              onRename={handleShowRenameModal}
              onRemove={handleShowRemoveModal}
            >
              <li 
                className={channel.id === currentChannelId ? 'active' : ''}
                onClick={() => dispatch(setCurrentChannel(channel.id))}
              >
                <span className="channel-name"># {channel.name}</span>
                {channel.id === currentChannelId && (
                  <span className="channel-dropdown-icon">▼</span>
                )}
              </li>
            </ChannelDropdown>
          ))}
        </ul>
      </div>
      
      <div className="chat-main">
        <div className="chat-header">
          <h3># {currentChannel?.name || t('chat.chooseChannel')}</h3>
          
          {/* Индикатор подключения */}
          <div className={`connection-status ${socketService.isConnected ? 'online' : 'offline'}`}>
            {socketService.isConnected ? `🟢 ${t('common.online')}` : `🔴 ${t('common.offline')}`}
          </div>
        </div>
        
        <div className="messages-container">
          {channelMessages.length === 0 ? (
            <div className="no-messages">
              <p>{t('chat.noMessages')}</p>
              <p className="text-muted">{t('chat.firstMessage')}</p>
            </div>
          ) : (
            channelMessages.map(message => (
              <div key={message.id} className="message">
                <div className="message-header">
                  <strong className="message-username">{message.username}</strong>
                  <small className="message-time">
                    {new Date(message.createdAt).toLocaleTimeString()}
                  </small>
                </div>
                <div className="message-body">{message.body}</div>
              </div>
            ))
          )}
        </div>
        
        <form className="message-form" onSubmit={handleSendMessage}>
          <input 
            type="text" 
            placeholder={t('chat.enterMessageIn', { channel: currentChannel?.name || t('chat.chooseChannel').toLowerCase() })}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={messageSending || !currentChannelId}
          />
          <button 
            type="submit" 
            disabled={messageSending || !newMessage.trim() || !currentChannelId}
            className="send-button"
          >
            {messageSending ? t('common.sending') : t('common.send')}
          </button>
        </form>
      </div>

      {/* Модальные окна */}
      <AddChannelModal 
        show={showAddModal} 
        onHide={handleHideAddModal} 
      />
      
      <RemoveChannelModal 
        show={showRemoveModal}
        onHide={handleHideRemoveModal}
        channelId={selectedChannelId}
      />
      
      <RenameChannelModal 
        show={showRenameModal}
        onHide={handleHideRenameModal}
        channelId={selectedChannelId}
      />
    </div>
  );
};

export default ChatPage;
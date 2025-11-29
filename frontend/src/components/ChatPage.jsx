import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChannels, setCurrentChannel, addChannel, removeChannel, renameChannel, clearProfanityFlag as clearChannelsProfanityFlag } from '../store/slices/channelsSlice';
import { fetchMessages, sendMessage, addMessageFromSocket, clearProfanityFlag as clearMessagesProfanityFlag } from '../store/slices/messagesSlice';
import socketService from '../store/utils/socket';
import AddChannelModal from './modals/AddChannelModal';
import RemoveChannelModal from './modals/RemoveChannelModal';
import RenameChannelModal from './modals/RenameChannelModal';
import ChannelDropdown from './ChannelDropdown';
import { useToast } from '../hooks/useToast';
import { hasProfanity } from '../store/utils/profanityFilter';

const ChatPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    showSuccess,
    showWarning,
    showNetworkError,
    showLoadDataError,
    showChannelAdded,
    showChannelRenamed,
    showChannelRemoved,
    showMessageSent,
    showProfanityWarning,
  } = useToast();
  
  const [newMessage, setNewMessage] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [selectedChannelId, setSelectedChannelId] = useState(null);
  
  const { 
    items: channels, 
    currentChannelId, 
    loading: channelsLoading, 
    lastActionHadProfanity: channelsHadProfanity 
  } = useSelector(state => state.channels);
  
  const { 
    items: messages, 
    loading: messagesLoading, 
    sending: messageSending, 
    lastMessageHadProfanity: messagesHadProfanity 
  } = useSelector(state => state.messages);
  
  const currentChannel = channels.find(channel => channel.id === currentChannelId);
  const channelMessages = messages.filter(message => message.channelId === currentChannelId);

  // Показываем уведомление о фильтрации нецензурных слов в сообщениях
  useEffect(() => {
    if (messagesHadProfanity) {
      showProfanityWarning();
      dispatch(clearMessagesProfanityFlag());
    }
  }, [messagesHadProfanity, showProfanityWarning, dispatch]);

  // Показываем уведомление о фильтрации нецензурных слов в каналах
  useEffect(() => {
    if (channelsHadProfanity) {
      showProfanityWarning();
      dispatch(clearChannelsProfanityFlag());
    }
  }, [channelsHadProfanity, showProfanityWarning, dispatch]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    const loadData = async () => {
      try {
        await Promise.all([
          dispatch(fetchChannels()).unwrap(),
          dispatch(fetchMessages()).unwrap(),
        ]);
      } catch (error) {
        showLoadDataError();
      }
    };

    loadData();

    socketService.connect();
    socketService.onNewMessage((message) => {
      dispatch(addMessageFromSocket(message));
    });

    return () => {
      socketService.removeAllListeners();
      socketService.disconnect();
    };
  }, [navigate, dispatch, showLoadDataError]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !currentChannelId || messageSending) return;

    // Проверяем на нецензурные слова (дополнительная клиентская проверка)
    const containsProfanity = hasProfanity(newMessage);
    
    if (containsProfanity) {
      // Показываем предупреждение, но всё равно отправляем - серверная фильтрация сработает
      showWarning(t('validation.profanityDetected'));
    }

    try {
      const result = await dispatch(sendMessage({
        channelId: currentChannelId,
        body: newMessage.trim(),
      })).unwrap();
      
      setNewMessage('');
      showMessageSent(result.hadProfanity);
    } catch (error) {
      showNetworkError();
    }
  };

  const handleShowAddModal = () => setShowAddModal(true);
  const handleHideAddModal = () => setShowAddModal(false);

  const handleAddChannel = async (channelName) => {
    try {
      const result = await dispatch(addChannel(channelName)).unwrap();
      showChannelAdded(result.hadProfanity);
      handleHideAddModal();
    } catch (error) {
      showNetworkError();
    }
  };

  const handleShowRemoveModal = (channelId) => {
    setSelectedChannelId(channelId);
    setShowRemoveModal(true);
  };

  const handleHideRemoveModal = () => {
    setShowRemoveModal(false);
    setSelectedChannelId(null);
  };

  const handleRemoveChannel = async () => {
    if (!selectedChannelId) return;
    
    try {
      await dispatch(removeChannel(selectedChannelId)).unwrap();
      showChannelRemoved();
      handleHideRemoveModal();
    } catch (error) {
      showNetworkError();
    }
  };

  const handleShowRenameModal = (channelId) => {
    setSelectedChannelId(channelId);
    setShowRenameModal(true);
  };

  const handleHideRenameModal = () => {
    setShowRenameModal(false);
    setSelectedChannelId(null);
  };

  const handleRenameChannel = async (newName) => {
    if (!selectedChannelId) return;
    
    try {
      const result = await dispatch(renameChannel({ 
        channelId: selectedChannelId, 
        newName 
      })).unwrap();
      showChannelRenamed(result.hadProfanity);
      handleHideRenameModal();
    } catch (error) {
      showNetworkError();
    }
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

      <AddChannelModal 
        show={showAddModal} 
        onHide={handleHideAddModal}
        onSubmit={handleAddChannel}
      />
      
      <RemoveChannelModal 
        show={showRemoveModal}
        onHide={handleHideRemoveModal}
        channelId={selectedChannelId}
        onSubmit={handleRemoveChannel}
      />
      
      <RenameChannelModal 
        show={showRenameModal}
        onHide={handleHideRenameModal}
        channelId={selectedChannelId}
        onSubmit={handleRenameChannel}
      />
    </div>
  );
};

export default ChatPage;
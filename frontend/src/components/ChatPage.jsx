import React, { useEffect, useState, useRef } from 'react';
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
  
  const messageInputRef = useRef(null); // Для автофокуса 
  
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

  // Автофокус на поле ввода сообщений при смене канала 
  useEffect(() => {
    if (messageInputRef.current && currentChannelId) {
      messageInputRef.current.focus();
    }
  }, [currentChannelId]);

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

    // Проверяем на нецензурные слова 
    const containsProfanity = hasProfanity(newMessage);
    
    if (containsProfanity) {
      showWarning(t('validation.profanityDetected'));
    }

    try {
      const result = await dispatch(sendMessage({
        channelId: currentChannelId,
        body: newMessage.trim(),
      })).unwrap();
      
      setNewMessage('');
      showMessageSent(result.hadProfanity);
      
      // Возвращаем фокус на поле ввода после отправки
      if (messageInputRef.current) {
        messageInputRef.current.focus();
      }
    } catch (error) {
      showNetworkError();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
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

  // Проверка на read-only 
  const isChannelReadOnly = (channelName) => {
    return channelName === 'general' || channelName === 'random';
  };

  if (channelsLoading || messagesLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">{t('common.loading')}</span>
        </div>
        <span className="ms-2">{t('common.loading')}</span>
      </div>
    );
  }

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        {/* Sidebar with channels */}
        <div className="col-md-3 col-lg-2 border-end p-0 bg-light">
          <div className="d-flex flex-column h-100">
            <div className="p-3 border-bottom">
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">{t('channels.channels')}</h4>
                <button 
                  type="button" 
                  className="btn btn-sm btn-outline-primary"
                  onClick={handleShowAddModal}
                  title={t('channels.addChannel')}
                >
                  +
                </button>
              </div>
            </div>
            
            <div className="flex-grow-1 overflow-auto">
              <ul className="list-unstyled mb-0">
                {channels.map(channel => {
                  const isReadOnly = isChannelReadOnly(channel.name);
                  
                  return (
                    <li key={channel.id} className="border-bottom">
                      <div 
                        className={`d-flex justify-content-between align-items-center p-3 ${channel.id === currentChannelId ? 'bg-primary text-white' : 'hover-bg'}`}
                        onClick={() => dispatch(setCurrentChannel(channel.id))}
                        style={{ cursor: 'pointer' }}
                      >
                        <span className="fw-medium"># {channel.name}</span>
                        
                        {!isReadOnly && channel.id === currentChannelId && (
                          <ChannelDropdown
                            channelId={channel.id}
                            onRename={handleShowRenameModal}
                            onRemove={handleShowRemoveModal}
                          />
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
            
            <div className="p-3 border-top">
              <div className="d-flex align-items-center">
                <div className={`me-2 ${socketService.isConnected ? 'text-success' : 'text-danger'}`}>
                  ●
                </div>
                <small className="text-muted">
                  {socketService.isConnected ? t('common.online') : t('common.offline')}
                </small>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main chat area */}
        <div className="col-md-9 col-lg-10 d-flex flex-column p-0">
          <div className="border-bottom p-3">
            <h3 className="mb-0"># {currentChannel?.name || t('chat.chooseChannel')}</h3>
          </div>
          
          <div className="flex-grow-1 overflow-auto p-3">
            {channelMessages.length === 0 ? (
              <div className="d-flex justify-content-center align-items-center h-100">
                <div className="text-center">
                  <p className="lead">{t('chat.noMessages')}</p>
                  <p className="text-muted">{t('chat.firstMessage')}</p>
                </div>
              </div>
            ) : (
              <div>
                {channelMessages.map(message => (
                  <div key={message.id} className="mb-3">
                    <div className="d-flex align-items-baseline">
                      <strong className="me-2">{message.username}</strong>
                      <small className="text-muted">
                        {new Date(message.createdAt).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </small>
                    </div>
                    <div 
                      className="mt-1 p-2 bg-light rounded"
                      style={{ 
                        wordBreak: 'break-word', // Решение для длинных слов 
                        overflowWrap: 'break-word',
                        whiteSpace: 'pre-wrap'
                      }}
                    >
                      {message.body}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="border-top p-3">
            <form onSubmit={handleSendMessage}>
              <div className="input-group">
                <textarea
                  ref={messageInputRef}
                  className="form-control"
                  placeholder={t('chat.enterMessage')}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={messageSending || !currentChannelId}
                  rows="3"
                  style={{ 
                    resize: 'vertical',
                    wordBreak: 'break-word', // Решение для длинных слов 
                    overflowWrap: 'break-word'
                  }}
                />
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={messageSending || !newMessage.trim() || !currentChannelId}
                >
                  {messageSending ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      {t('common.sending')}
                    </>
                  ) : t('common.send')}
                </button>
              </div>
            </form>
          </div>
        </div>
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
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChannels } from '../store/slices/channelsSlice';
import { fetchMessages } from '../store/slices/messagesSlice';

const ChatPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { items: channels, currentChannelId, loading: channelsLoading } = useSelector(state => state.channels);
  const { items: messages, loading: messagesLoading } = useSelector(state => state.messages);

  const currentChannel = channels.find(channel => channel.id === currentChannelId);

  const channelMessages = messages.filter(message => message.channelId === currentChannelId);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    dispatch(fetchChannels());
    dispatch(fetchMessages());
  }, [navigate, dispatch]);

  if (channelsLoading || messagesLoading) {
    return <div>Загрузка чата...</div>;
  }

  return (
    <div className="chat-container">
      <div className="channels-sidebar">
        <h3>Каналы</h3>
        <ul>
          {channels.map(channel => (
            <li key={channel.id} className={channel.id === currentChannelId ? 'active' : ''}>
              {channel.name}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="chat-main">
        <h3>{currentChannel?.name || 'Выберите канал'}</h3>

        <div className="messages-container">
          {channelMessages.map(message => (
            <div key={message.id} className="message">
              <strong>{message.username}:</strong> {message.body}
            </div>
          ))}
        </div>

        <div className="message-form">
          <input type="text" placeholder="Введите сообщение..." />
          <button>Отправить</button>
        </div>
      </div>
      
      <button onClick={() => {
        localStorage.removeItem('authToken');
        navigate('/login');
      }}>
        Выйти
      </button>
    </div>
  );
};

export default ChatPage;
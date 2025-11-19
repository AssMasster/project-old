import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ChatPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div>
      <h1>Чат</h1>
      <p>Добро пожаловать в чат!</p>
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
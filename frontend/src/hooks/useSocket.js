import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import { messageReceived } from '../app/features/chat/messageSlice.js';
import {
  channelReceived,
  channelRemoved,
  channelRenamed,
} from '../app/features/chat/channelSlice.js';

function useSocket() {
  const dispatch = useDispatch();

  useEffect(() => {
    const socket = io('/');

    socket.on('newMessage', (msg) => dispatch(messageReceived(msg)));
    socket.on('newChannel', (chn) => dispatch(channelReceived(chn)));
    socket.on('removeChannel', ({ id }) => dispatch(channelRemoved({ id })));
    socket.on('renameChannel', (chn) => dispatch(channelRenamed(chn)));

    return () => {
      socket.disconnect(); // разрываем соединение и очищаем слушатели
    };
  }, [dispatch]);
}

export default useSocket;

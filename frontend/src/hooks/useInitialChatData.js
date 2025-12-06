import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import useAuth from './useAuth.js';
import { getChannels } from '../services/api/channelsApi.js';
import { getMessages } from '../services/api/messagesApi.js';

const useInitialChatData = () => {
  const dispatch = useDispatch();
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      dispatch(getChannels());
      dispatch(getMessages());
    }
  }, [token, dispatch]);
};

export default useInitialChatData;

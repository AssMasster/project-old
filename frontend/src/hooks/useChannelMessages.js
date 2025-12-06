import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectMessagesByChannel } from '../app/features/chat/messageSlice.js';

const useChannelMessages = (channelId) => {
  const msgSelector = useMemo(() => selectMessagesByChannel(channelId), [channelId]);
  return useSelector(msgSelector);
};
export default useChannelMessages;

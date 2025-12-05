import {
  createSlice,
  createEntityAdapter,
  createSelector,
} from '@reduxjs/toolkit';
import { addMessage, getMessages } from '../../../services/api/messagesApi.js';
import { removeChannel } from '../../../services/api/channelsApi.js';

const messagesAdapter = createEntityAdapter();

const initialState = messagesAdapter.getInitialState({
  loading: false,
  error: null,
});

const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    messageReceived: (state, action) => {
      messagesAdapter.setOne(state, action.payload);
    },
    removeMessages: (state, action) => {
      messagesAdapter.removeMany(state, action.payload);
    },
  },
  extraReducers: (builder) => {
    // addMessage
    builder
      .addCase(addMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        messagesAdapter.addOne(state, action.payload);
      })
      .addCase(addMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message;
      });
    // getMessages
    builder
      .addCase(getMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.loading = false;
        messagesAdapter.setAll(state, action.payload);
      })
      .addCase(getMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message;
      });
    // removeMessages
    builder.addCase(removeChannel.fulfilled, (state, action) => {
      const deletedChannelId = action.payload;
      const idsToRemove = Object.values(state.entities)
        .filter((m) => m.channelId === deletedChannelId)
        .map((m) => m.id);
      messagesAdapter.removeMany(state, idsToRemove);
    });
  },
});

export const {
  selectById: selectMessageById,
  selectAll: selectAllMessages,
  selectEntities: selectMessagesEntities,
} = messagesAdapter.getSelectors((state) => state.messages);

// prettier-ignore
export const selectMessagesByChannel = (channelId) => createSelector(
  [selectAllMessages],
  (messages) => (
    messages.filter(
      (msg) => msg.channelId === channelId,
    )
  ),
);

export const { messageReceived, removeMessages } = messageSlice.actions;
export default messageSlice.reducer;

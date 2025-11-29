import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../utils/api';
import { filterProfanity, hasProfanity } from '../utils/profanityFilter';

export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/v1/messages');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки сообщений');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async ({ channelId, body }, { rejectWithValue, dispatch }) => {
    try {
      // Фильтруем нецензурные слова в сообщении
      const filteredBody = filterProfanity(body);
      const hadProfanity = hasProfanity(body);
      
      const response = await axios.post('/api/v1/messages', {
        channelId,
        body: filteredBody,
      });

      // Возвращаем информацию о фильтрации
      return {
        ...response.data,
        hadProfanity,
        originalBody: body,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка отправки сообщения');
    }
  }
);

const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    items: [],
    loading: false,
    sending: false,
    error: null,
    lastMessageHadProfanity: false,
  },
  reducers: {
    addMessageFromSocket: (state, action) => {
      // Фильтруем сообщения из WebSocket
      const message = {
        ...action.payload,
        body: filterProfanity(action.payload.body),
      };
      state.items.push(message);
    },
    clearProfanityFlag: (state) => {
      state.lastMessageHadProfanity = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        // Фильтруем все загруженные сообщения
        state.items = action.payload.map(message => ({
          ...message,
          body: filterProfanity(message.body),
        }));
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(sendMessage.pending, (state) => {
        state.sending = true;
        state.error = null;
        state.lastMessageHadProfanity = false;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.sending = false;
        state.lastMessageHadProfanity = action.payload.hadProfanity;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sending = false;
        state.error = action.payload;
        state.lastMessageHadProfanity = false;
      });
  },
});

export const { addMessageFromSocket, clearProfanityFlag } = messagesSlice.actions;
export default messagesSlice.reducer;
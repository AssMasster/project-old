// frontend/src/store/slices/messagesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../utils/api';

// Существующий thunk для получения сообщений
export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async () => {
    const response = await axios.get('/api/v1/messages');
    return response.data;
  }
);

// НОВЫЙ: Отправка сообщения
export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async ({ channelId, body }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/v1/messages', {
        channelId,
        body,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка отправки');
    }
  }
);

const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    items: [],
    loading: false,
    sending: false, // отдельный флаг для отправки
    error: null,
  },
  reducers: {
    // НОВЫЙ: Добавление сообщения из WebSocket
    addMessageFromSocket: (state, action) => {
      state.items.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Загрузка сообщений
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Отправка сообщения
      .addCase(sendMessage.pending, (state) => {
        state.sending = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.sending = false;
        // Сообщение добавляется через WebSocket, поэтому не дублируем здесь
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sending = false;
        state.error = action.payload;
      });
  },
});

export const { addMessageFromSocket } = messagesSlice.actions;
export default messagesSlice.reducer;
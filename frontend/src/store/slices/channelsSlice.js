import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../utils/api';
import { filterProfanity, hasProfanity } from '../utils/profanityFilter';

export const fetchChannels = createAsyncThunk(
  'channels/fetchChannels',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/v1/channels');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки каналов');
    }
  }
);

export const addChannel = createAsyncThunk(
  'channels/addChannel',
  async (channelName, { rejectWithValue }) => {
    try {
      // Фильтруем нецензурные слова в названии канала
      const filteredName = filterProfanity(channelName);
      const hadProfanity = hasProfanity(channelName);
      
      const response = await axios.post('/api/v1/channels', {
        name: filteredName,
      });

      return {
        ...response.data,
        hadProfanity,
        originalName: channelName,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка создания канала');
    }
  }
);

export const renameChannel = createAsyncThunk(
  'channels/renameChannel',
  async ({ channelId, newName }, { rejectWithValue }) => {
    try {
      // Фильтруем нецензурные слова в новом названии канала
      const filteredName = filterProfanity(newName);
      const hadProfanity = hasProfanity(newName);
      
      const response = await axios.patch(`/api/v1/channels/${channelId}`, {
        name: filteredName,
      });

      return {
        ...response.data,
        hadProfanity,
        originalName: newName,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка переименования канала');
    }
  }
);

export const removeChannel = createAsyncThunk(
  'channels/removeChannel',
  async (channelId, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/v1/channels/${channelId}`);
      return channelId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка удаления канала');
    }
  }
);

const channelsSlice = createSlice({
  name: 'channels',
  initialState: {
    items: [],
    currentChannelId: null,
    loading: false,
    error: null,
    lastActionHadProfanity: false,
  },
  reducers: {
    setCurrentChannel: (state, action) => {
      state.currentChannelId = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearProfanityFlag: (state) => {
      state.lastActionHadProfanity = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch channels
      .addCase(fetchChannels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChannels.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        if (!state.currentChannelId && action.payload.length > 0) {
          state.currentChannelId = action.payload[0].id;
        }
      })
      .addCase(fetchChannels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Add channel
      .addCase(addChannel.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.currentChannelId = action.payload.id;
        state.lastActionHadProfanity = action.payload.hadProfanity;
      })
      // Remove channel
      .addCase(removeChannel.fulfilled, (state, action) => {
        const removedChannelId = action.payload;
        state.items = state.items.filter(channel => channel.id !== removedChannelId);
        
        if (state.currentChannelId === removedChannelId) {
          state.currentChannelId = state.items[0]?.id || null;
        }
      })
      // Rename channel
      .addCase(renameChannel.fulfilled, (state, action) => {
        const updatedChannel = action.payload;
        const channelIndex = state.items.findIndex(channel => channel.id === updatedChannel.id);
        if (channelIndex !== -1) {
          state.items[channelIndex] = updatedChannel;
          state.lastActionHadProfanity = updatedChannel.hadProfanity;
        }
      });
  },
});

export const { setCurrentChannel, clearError, clearProfanityFlag } = channelsSlice.actions;
export default channelsSlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk для получения каналов
export const fetchChannels = createAsyncThunk(
  'channels/fetchChannels',
  async () => {
    const response = await axios.get('/api/v1/channels');
    return response.data;
  }
);

const channelsSlice = createSlice({
  name: 'channels',
  initialState: {
    items: [],
    currentChannelId: null,
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentChannel: (state, action) => {
      state.currentChannelId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChannels.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.currentChannelId = action.payload[0]?.id || null;
      })
      .addCase(fetchChannels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setCurrentChannel } = channelsSlice.actions;
export default channelsSlice.reducer;
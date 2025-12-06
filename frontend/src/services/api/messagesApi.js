import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getAuthHeader, handleError } from './apiHelpers.js';

export const getMessages = createAsyncThunk('chat/getMessages', async (_, thunkAPI) => {
  try {
    const response = await axios.get('/api/v1/messages', getAuthHeader());
    return response.data;
  } catch (err) {
    return handleError(err, thunkAPI);
  }
});

export const addMessage = createAsyncThunk(
  'chat/addMessage',
  async ({ body, channelId, username }, thunkAPI) => {
    try {
      const response = await axios.post(
        '/api/v1/messages',
        {
          body,
          channelId,
          username,
        },
        getAuthHeader(),
      );
      return response.data;
    } catch (err) {
      return handleError(err, thunkAPI);
    }
  },
);

export const editMessage = createAsyncThunk(
  'chat/editMessage',
  async ({ body, id }, thunkAPI) => {
    try {
      const response = await axios.patch(
        `/api/v1/messages/${id}`,
        { body },
        getAuthHeader(),
      );
      return response.data;
    } catch (err) {
      return handleError(err, thunkAPI);
    }
  },
);

export const removeMessage = createAsyncThunk(
  'chat/removeMessage',
  async (id, thunkAPI) => {
    try {
      const response = await axios.delete(`/api/v1/messages/${id}`, getAuthHeader());
      return response.data;
    } catch (err) {
      return handleError(err, thunkAPI);
    }
  },
);

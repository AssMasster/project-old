import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getAuthHeader, handleError } from './apiHelpers.js';

const DEFAULT_CHANNEL_ID = '1';

export const getChannels = createAsyncThunk(
  'chat/getChannels',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get('/api/v1/channels', getAuthHeader());
      return response.data;
    } catch (err) {
      return handleError(err, thunkAPI);
    }
  },
);

export const addChannel = createAsyncThunk(
  'chat/addChannel',
  async ({ name }, thunkAPI) => {
    try {
      const response = await axios.post(
        '/api/v1/channels',
        { name },
        getAuthHeader(),
      );
      return response.data;
    } catch (err) {
      return handleError(err, thunkAPI);
    }
  },
);

export const renameChannel = createAsyncThunk(
  'chat/editChannel',
  async ({ name, id }, thunkAPI) => {
    try {
      const response = await axios.patch(
        `/api/v1/channels/${id}`,
        { name },
        getAuthHeader(),
      );
      return response.data;
    } catch (err) {
      return handleError(err, thunkAPI);
    }
  },
);

export const removeChannel = createAsyncThunk(
  'chat/removeChannel',
  async (id, thunkAPI) => {
    try {
      await axios.delete(`/api/v1/channels/${id}`, getAuthHeader());
      thunkAPI.dispatch({
        type: 'channels/setActiveChannel',
        payload: DEFAULT_CHANNEL_ID,
      });
      return id;
    } catch (err) {
      return handleError(err, thunkAPI);
    }
  },
);

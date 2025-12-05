/* eslint-env browser */
export const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
});

export const handleError = (err, thunkAPI) =>
  thunkAPI.rejectWithValue(err.response?.data || 'network error');

export const apiError = (err) =>
  err.response?.data?.message ||
  err.response?.data ||
  err.message ||
  'network error';

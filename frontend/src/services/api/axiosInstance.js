/* eslint-env browser */
import axios from 'axios';

export const axiosInstance = axios.create({ baseURL: '/api/v1' });

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { axiosInstance } from '../../../services/api/axiosInstance.js';
import { apiError } from '../../../services/api/apiHelpers.js';

export const AuthContext = createContext(null);

const readLS = (k) => localStorage.getItem(k);
const writeLS = (k, v) => localStorage.setItem(k, v);
const clearLS = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => readLS('username'));
  const [token, setToken] = useState(() => readLS('token'));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) writeLS('username', user);
    if (token) writeLS('token', token);
  }, [user, token]);

  const login = useCallback(async ({ name, password }) => {
    try {
      setError(null);
      const { data } = await axiosInstance.post('/login', {
        username: name,
        password,
      });
      setUser(data.username);
      setToken(data.token);
    } catch (err) {
      setError(apiError(err));
      throw err;
    }
  }, []);

  const signup = useCallback(async ({ name, password }) => {
    try {
      setError(null);
      const { data } = await axiosInstance.post('/signup', {
        username: name,
        password,
      });
      setUser(data.username);
      setToken(data.token);
    } catch (err) {
      setError(apiError(err));
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    clearLS();
  }, []);

  // Мемоизируем объект value, чтобы он не менялся без необходимости
  const value = useMemo(
    () => ({
      user,
      token,
      error,
      login,
      signup,
      logout,
    }),
    [user, token, error, login, signup, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx)
    throw new Error('useAuthContext must be used inside <AuthProvider>');
  return ctx;
};

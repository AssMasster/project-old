import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React, { useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import NotFoundPage from './components/NotFoundPage';
import ChatPage from './components/ChatPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';

function App() {
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, []);

  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<ChatPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
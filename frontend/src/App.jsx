import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React, { useEffect } from 'react';
import axios from 'axios';
import { NotFoundPage } from './Components/NotFoundPage';
import { ChatPage } from './Components/ChatPage'
import { LoginPage } from './Components/LoginPage'

function App () {
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
      <Routes>
        <Route path='/' element={<ChatPage/>}></Route>
        <Route path='/login' element={<LoginPage/>}></Route>
        <Route path='*' element={<NotFoundPage/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}
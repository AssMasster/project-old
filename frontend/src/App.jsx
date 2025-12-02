import { BrowserRouter, Routes, Route } from 'react-router-dom'
import React, { useEffect } from 'react'
import { ToastContainer } from 'react-toastify'
import { useRollbar } from '@rollbar/react'
import axios from 'axios'
import Header from './components/Header.jsx'
import NotFoundPage from './components/NotFoundPage.jsx'
import ChatPage from './components/ChatPage'
import LoginPage from './components/LoginPage'
import SignupPage from './components/SignupPage'

function App() {
  const rollbar = useRollbar()

  useEffect(() => {
    // Логируем загрузку приложения
    rollbar.info('Application loaded', {
      path: window.location.pathname,
      userAgent: navigator.userAgent,
    })

    const token = localStorage.getItem('authToken')
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      // Конфигурируем Rollbar с информацией о пользователе
      rollbar.configure({
        payload: {
          person: {
            id: localStorage.getItem('userId'),
            username: localStorage.getItem('username'),
          },
        },
      })
    } else {
      delete axios.defaults.headers.common['Authorization']
    }
  }, [rollbar])

  // Глобальный обработчик ошибок
  useEffect(() => {
    const handleGlobalError = (event) => {
      rollbar.error('Global error caught', {
        error: event.error?.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      })
    }

    const handleUnhandledRejection = (event) => {
      rollbar.error('Unhandled promise rejection', {
        reason: event.reason?.message || event.reason,
      })
    }

    window.addEventListener('error', handleGlobalError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('error', handleGlobalError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [rollbar])

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
        
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </BrowserRouter>
  )
}

export default App
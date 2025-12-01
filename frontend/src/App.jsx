import { BrowserRouter, Routes, Route } from 'react-router-dom'
import React, { useEffect } from 'react'
import { ToastContainer } from 'react-toastify'
import { useRollbar } from '@rollbar/react' // Добавлен импорт Rollbar
import axios from 'axios'
import Header from './components/Header.jsx'
import NotFoundPage from './components/NotFoundPage.jsx'
import ChatPage from './components/ChatPage'
import LoginPage from './components/LoginPage'
import SignupPage from './components/SignupPage'

function App() {
  const rollbar = useRollbar() // Инициализация Rollbar

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete axios.defaults.headers.common['Authorization']
    }
  }, [])

  // Тестовая функция для Rollbar
  const testRollbar = () => {
    try {
      const a = null
      a.hello() // Это вызовет ошибку как в примере
    } catch (error) {
      rollbar.error('Test error from Hexlet Chat', error)
      alert('Test error sent to Rollbar! Check dashboard.')
    }
  }

  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <main className="flex-grow-1">
          {/* Тестовая кнопка Rollbar */}
          <div style={{
            padding: '20px',
            margin: '20px',
            border: '2px solid #4CAF50',
            borderRadius: '10px',
            backgroundColor: '#f8fff8'
          }}>
            <h4>Rollbar Test (Stage 11)</h4>
            <button 
              onClick={testRollbar}
              style={{
                padding: '10px 20px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                marginTop: '10px'
              }}
            >
              🐞 Send Test Error to Rollbar
            </button>
            <p style={{ marginTop: '10px', fontSize: '0.9em', color: '#666' }}>
              Token: 7796e27b108a4c25b3fb24b577008db9
            </p>
          </div>

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
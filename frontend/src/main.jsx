import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider as ReduxProvider } from 'react-redux'
import { store } from './store'
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react'
import App from './App.jsx'
import './index.css'
import './i18n'
import 'react-toastify/dist/ReactToastify.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Конфигурация Rollbar с ВАШИМ токеном
const rollbarConfig = {
  accessToken: '7796e27b108a4c25b3fb24b577008db9',
  environment: 'production',
  captureUncaught: true,
  captureUnhandledRejections: true,
  payload: {
    client: {
      javascript: {
        code_version: '1.0.0',
      },
    },
  },
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RollbarProvider config={rollbarConfig}>
      <ErrorBoundary>
        <ReduxProvider store={store}>
          <App />
        </ReduxProvider>
      </ErrorBoundary>
    </RollbarProvider>
  </StrictMode>
)
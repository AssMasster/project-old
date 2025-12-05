import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import { I18nextProvider } from 'react-i18next';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import { Provider as ReduxProvider } from 'react-redux';
import React, { StrictMode } from 'react';
import leoProfanity from 'leo-profanity';
import store from './app/store.js';
import App from './app/App.jsx';
import './index.css';
import i18n from './app/i18n.js';
import rollbarConfig from './utils/rollbarConfig.js';
import { AuthProvider } from './app/features/auth/AuthContext.jsx';

leoProfanity.loadDictionary(['ru', 'en']);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RollbarProvider config={rollbarConfig}>
      <ErrorBoundary>
        <ReduxProvider store={store}>
          <AuthProvider>
            <I18nextProvider i18n={i18n}>
              <App />
            </I18nextProvider>
          </AuthProvider>
        </ReduxProvider>
      </ErrorBoundary>
    </RollbarProvider>
  </StrictMode>
);

import React from 'react';
import LoginPage from './pages/LoginPage.jsx';
import MainChatPage from './pages/MainChatPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import AppLayout from './layouts/AppLayout.jsx';
import ProtectedRoute from './features/auth/ProtectedRoute.jsx';
import { ROUTES } from './routes.jsx';

export const routes = [
  {
    path: ROUTES.LOGIN,
    element: (
      <AppLayout>
        <LoginPage />
      </AppLayout>
    ),
  },
  {
    path: ROUTES.SIGNUP,
    element: (
      <AppLayout>
        <SignupPage />
      </AppLayout>
    ),
  },
  {
    path: ROUTES.NOT_FOUND,
    element: (
      <AppLayout>
        <NotFoundPage />
      </AppLayout>
    ),
  },
  {
    path: ROUTES.ROOT,
    element: (
      <ProtectedRoute>
        <AppLayout>
          <MainChatPage />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
];

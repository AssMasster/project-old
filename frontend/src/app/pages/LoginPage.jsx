import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useAuth from '../../hooks/useAuth.js';
import AuthForm from '../features/auth/AuthForm.jsx';
import { ROUTES } from '../routes.jsx';

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.ROOT);
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (values) => {
    await login(values);
  };

  return (
    <AuthForm
      t={t}
      title={t('auth.login.title')}
      fields={[
        { name: 'name', label: t('auth.formField.nickName') },
        {
          name: 'password',
          label: t('auth.formField.password'),
          type: 'password',
        },
      ]}
      initialValues={{ name: '', password: '' }}
      onSubmit={handleLogin}
      redirectPrompt={t('auth.login.redirectPrompt')}
      redirectName={t('auth.login.redirectName')}
      switchLink={ROUTES.SIGNUP}
      buttonName={t('auth.login.button')}
    />
  );
};

export default LoginPage;

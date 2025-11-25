import React, { useState } from 'react';
import { Formik, Field, Form } from 'formik';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const LoginPage = () => {
  const { t } = useTranslation();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h1>{t('auth.authorization')}</h1>
        
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        
        <Formik
          initialValues={{ username: 'admin', password: 'admin' }}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              setError('');
              const response = await axios.post('/api/v1/login', values);
              
              localStorage.setItem('authToken', response.data.token);
              axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
          
              navigate('/');
            } catch (err) {
              setError(t('auth.authError'));
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  {t('auth.username')}
                </label>
                <Field 
                  id="username"
                  name="username" 
                  type="text"
                  className="form-control"
                  placeholder={t('auth.enterUsername')}
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  {t('auth.password')}
                </label>
                <Field 
                  id="password"
                  name="password" 
                  type="password"
                  className="form-control"
                  placeholder={t('auth.enterPassword')}
                />
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary w-100"
                disabled={isSubmitting}
              >
                {isSubmitting ? t('common.sending') : t('common.login')}
              </button>
            </Form>
          )}
        </Formik>

        <div className="mt-3 text-center">
          <span>{t('auth.noAccount')} </span>
          <Link to="/signup" className="btn btn-link p-0">
            {t('common.signup')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
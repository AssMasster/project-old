import React, { useState } from 'react';
import { useFormik } from 'formik';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { toast } from 'react-toastify';
import { validationSchemas } from '../utils/validationSchemas'; 

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState('');

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: validationSchemas.loginSchema, // Используем схему
    onSubmit: async (values) => {
      // Проверка на заполненность полей
      if (!values.username.trim() || !values.password.trim()) {
        toast.error(t('login.fillAllFields'));
        return;
      }

      try {
        const response = await axios.post('/api/v1/login', values);
        const { token, username, id } = response.data;
        
        localStorage.setItem('authToken', token);
        localStorage.setItem('username', username);
        localStorage.setItem('userId', id);
        
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        toast.success(t('login.success'));
        navigate('/');
      } catch (error) {
        setAuthError(t('login.invalidCredentials'));
        toast.error(t('login.invalidCredentials'));
      }
    },
  });

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-6 col-lg-4">
          <div className="card">
            <div className="card-header">
              <h3 className="text-center mb-0">{t('login.title')}</h3>
            </div>
            <div className="card-body">
              <form onSubmit={formik.handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    {t('login.username')}
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      formik.touched.username && formik.errors.username ? 'is-invalid' : ''
                    }`}
                    id="username"
                    name="username"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    autoComplete="off"
                    placeholder={t('login.enterUsername')}
                  />
                  {formik.touched.username && formik.errors.username && (
                    <div className="invalid-feedback">{formik.errors.username}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    {t('login.password')}
                  </label>
                  <input
                    type="password"
                    className={`form-control ${
                      formik.touched.password && formik.errors.password ? 'is-invalid' : ''
                    }`}
                    id="password"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    autoComplete="off"
                    placeholder={t('login.enterPassword')}
                  />
                  {formik.touched.password && formik.errors.password && (
                    <div className="invalid-feedback">{formik.errors.password}</div>
                  )}
                </div>

                {authError && (
                  <div className="alert alert-danger" role="alert">
                    {authError}
                  </div>
                )}

                <button 
                  type="submit" 
                  className="btn btn-primary w-100"
                  disabled={formik.isSubmitting}
                >
                  {formik.isSubmitting ? t('common.sending') : t('common.login')}
                </button>
              </form>

              <div className="mt-3 text-center">
                <span>{t('login.noAccount')} </span>
                <Link to="/signup" className="btn btn-link p-0">
                  {t('common.signup')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
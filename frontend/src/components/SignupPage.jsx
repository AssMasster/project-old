import React, { useState } from 'react';
import { useFormik } from 'formik';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { toast } from 'react-toastify';
import { validationSchemas } from '../utils/validationSchemas.js';

const SignupPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSignupSubmit = async (values, { setSubmitting }) => {
    // Проверка на заполненность полей
    if (!values.username.trim() || !values.password.trim() || !values.confirmPassword.trim()) {
      toast.error(t('signup.fillAllFields'));
      setSubmitting(false);
      return;
    }

    try {
      const response = await axios.post('/api/v1/signup', {
        username: values.username.trim(),
        password: values.password,
      });

      const { token, username, id } = response.data;
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('username', username);
      localStorage.setItem('userId', id);
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      toast.success(t('signup.success'));
      navigate('/');
    } catch (err) {
      if (err.response?.status === 409) {
        setError(t('signup.userExists'));
        toast.error(t('signup.userExists'));
      } else {
        setError(t('signup.error'));
        toast.error(t('signup.error'));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: validationSchemas.signupSchema,
    onSubmit: handleSignupSubmit,
  });

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-6 col-lg-4">
          <div className="card">
            <div className="card-header">
              <h3 className="text-center mb-0">{t('signup.title')}</h3>
            </div>
            <div className="card-body">
              <form onSubmit={formik.handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    {t('signup.username')}
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
                    placeholder={t('signup.enterUsername')}
                  />
                  {formik.touched.username && formik.errors.username && (
                    <div className="invalid-feedback">{formik.errors.username}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    {t('signup.password')}
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
                    placeholder={t('signup.enterPassword')}
                  />
                  {formik.touched.password && formik.errors.password && (
                    <div className="invalid-feedback">{formik.errors.password}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">
                    {t('signup.confirmPassword')}
                  </label>
                  <input
                    type="password"
                    className={`form-control ${
                      formik.touched.confirmPassword && formik.errors.confirmPassword ? 'is-invalid' : ''
                    }`}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    autoComplete="off"
                    placeholder={t('signup.confirmPasswordPlaceholder')}
                  />
                  {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                    <div className="invalid-feedback">{formik.errors.confirmPassword}</div>
                  )}
                </div>

                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                <button 
                  type="submit" 
                  className="btn btn-primary w-100"
                  disabled={formik.isSubmitting}
                >
                  {formik.isSubmitting ? t('common.sending') : t('common.signup')}
                </button>
              </form>

              <div className="mt-3 text-center">
                <span>{t('signup.haveAccount')} </span>
                <Link to="/login" className="btn btn-link p-0">
                  {t('common.login')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
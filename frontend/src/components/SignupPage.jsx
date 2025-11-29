import React, { useState } from 'react';
import { Formik, Field, Form } from 'formik';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import * as yup from 'yup';

const SignupPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState('');

  const signupSchema = yup.object().shape({
    username: yup
      .string()
      .min(3, t('auth.usernameLength'))
      .max(20, t('auth.usernameLength'))
      .required(t('common.required')),
    password: yup
      .string()
      .min(6, t('auth.passwordLength'))
      .required(t('common.required')),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), null], t('auth.passwordsMatch'))
      .required(t('common.required')),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError('');
      
      const response = await axios.post('/api/v1/signup', {
        username: values.username,
        password: values.password,
      });

      localStorage.setItem('authToken', response.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      
      navigate('/');
    } catch (err) {
      if (err.response?.status === 409) {
        setError(t('auth.userExists'));
      } else {
        setError(t('auth.registrationError'));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h1>{t('auth.registration')}</h1>
        
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        
        <Formik
          initialValues={{ username: '', password: '', confirmPassword: '' }}
          validationSchema={signupSchema}
          onSubmit={handleSubmit}
          validateOnChange={false}
          validateOnBlur={false}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  {t('auth.username')}
                </label>
                <Field
                  id="username"
                  name="username"
                  type="text"
                  className={`form-control ${errors.username && touched.username ? 'is-invalid' : ''}`}
                  placeholder={t('auth.enterUsername')}
                />
                {errors.username && touched.username && (
                  <div className="invalid-feedback">{errors.username}</div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  {t('auth.password')}
                </label>
                <Field
                  id="password"
                  name="password"
                  type="password"
                  className={`form-control ${errors.password && touched.password ? 'is-invalid' : ''}`}
                  placeholder={t('auth.enterPassword')}
                />
                {errors.password && touched.password && (
                  <div className="invalid-feedback">{errors.password}</div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">
                  {t('auth.confirmPassword')}
                </label>
                <Field
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  className={`form-control ${errors.confirmPassword && touched.confirmPassword ? 'is-invalid' : ''}`}
                  placeholder={t('auth.confirmPasswordPlaceholder')}
                />
                {errors.confirmPassword && touched.confirmPassword && (
                  <div className="invalid-feedback">{errors.confirmPassword}</div>
                )}
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-100"
                disabled={isSubmitting}
              >
                {isSubmitting ? t('common.sending') : t('common.signup')}
              </button>
            </Form>
          )}
        </Formik>

        <div className="mt-3 text-center">
          <span>{t('auth.haveAccount')} </span>
          <Link to="/login" className="btn btn-link p-0">
            {t('common.login')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
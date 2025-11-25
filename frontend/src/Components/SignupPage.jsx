// frontend/src/components/SignupPage.jsx
import React, { useState } from 'react';
import { Formik, Field, Form } from 'formik';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import * as yup from 'yup';

const signupSchema = yup.object().shape({
  username: yup
    .string()
    .min(3, 'Имя пользователя должно быть от 3 до 20 символов')
    .max(20, 'Имя пользователя должно быть от 3 до 20 символов')
    .required('Обязательное поле'),
  password: yup
    .string()
    .min(6, 'Пароль должен быть не менее 6 символов')
    .required('Обязательное поле'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Пароли должны совпадать')
    .required('Обязательное поле'),
});

const SignupPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState('');

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError('');
      
      const response = await axios.post('/api/v1/signup', {
        username: values.username,
        password: values.password,
      });

      // Сохраняем токен
      localStorage.setItem('authToken', response.data.token);
      
      // Настраиваем axios
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      
      // Редирект на чат
      navigate('/');
    } catch (err) {
      if (err.response?.status === 409) {
        setError('Пользователь с таким именем уже существует');
      } else {
        setError('Ошибка регистрации. Попробуйте еще раз.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h1>Регистрация</h1>
        
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
                  Имя пользователя
                </label>
                <Field
                  id="username"
                  name="username"
                  type="text"
                  className={`form-control ${errors.username && touched.username ? 'is-invalid' : ''}`}
                  placeholder="Введите имя пользователя"
                />
                {errors.username && touched.username && (
                  <div className="invalid-feedback">{errors.username}</div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Пароль
                </label>
                <Field
                  id="password"
                  name="password"
                  type="password"
                  className={`form-control ${errors.password && touched.password ? 'is-invalid' : ''}`}
                  placeholder="Введите пароль"
                />
                {errors.password && touched.password && (
                  <div className="invalid-feedback">{errors.password}</div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">
                  Подтверждение пароля
                </label>
                <Field
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  className={`form-control ${errors.confirmPassword && touched.confirmPassword ? 'is-invalid' : ''}`}
                  placeholder="Подтвердите пароль"
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
                {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
              </button>
            </Form>
          )}
        </Formik>

        <div className="mt-3 text-center">
          <span>Уже есть аккаунт? </span>
          <Link to="/login" className="btn btn-link p-0">
            Войти
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
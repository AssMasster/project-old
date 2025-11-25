import React, { useState } from 'react';
import { Formik, Field, Form } from 'formik';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h1>Авторизация</h1>
        
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
              
              // Сохраняем токен
              localStorage.setItem('authToken', response.data.token);
              
              // Настраиваем axios headers
              axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
          
              // Редирект на главную
              navigate('/');
            } catch (err) {
              setError('Ошибка авторизации. Проверьте логин и пароль.');
            } finally {
              setSubmitting(false);
            }
          }}
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
                  className="form-control"
                  placeholder="Введите логин"
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Пароль
                </label>
                <Field 
                  id="password"
                  name="password" 
                  type="password"
                  className="form-control"
                  placeholder="Введите пароль"
                />
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary w-100"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Вход...' : 'Войти'}
              </button>
            </Form>
          )}
        </Formik>

        <div className="mt-3 text-center">
          <span>Нет аккаунта? </span>
          <Link to="/signup" className="btn btn-link p-0">
            Зарегистрироваться
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
import React, { useState } from 'react';
import { Formik, Field, Form } from 'formik';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  return (
    <div>
      <h1>Авторизация</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      
      <Formik
        initialValues={{ username: 'admin', password: 'admin' }}
        onSubmit={async (values) => {
          try {
            setError('');
            const response = await axios.post('/api/v1/login', values);
            
            localStorage.setItem('authToken', response.data.token);
        
            navigate('/');
          } catch (err) {
            setError('Ошибка авторизации. Проверьте логин и пароль.');
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <div>
              <label htmlFor="username">Имя пользователя:</label>
              <Field 
                id="username"
                name="username" 
                type="text"
                placeholder="Введите логин"
              />
            </div>
            
            <div>
              <label htmlFor="password">Пароль:</label>
              <Field 
                id="password"
                name="password" 
                type="password"
                placeholder="Введите пароль"
              />
            </div>
            
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Вход...' : 'Войти'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LoginPage;
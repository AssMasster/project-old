// frontend/src/components/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('authToken');

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-light bg-light border-bottom">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          Hexlet Chat
        </Link>
        
        <div className="d-flex">
          {isAuthenticated ? (
            <button 
              className="btn btn-outline-danger btn-sm"
              onClick={handleLogout}
            >
              Выйти
            </button>
          ) : (
            <div className="d-flex gap-2">
              <Link to="/login" className="btn btn-outline-primary btn-sm">
                Войти
              </Link>
              <Link to="/signup" className="btn btn-primary btn-sm">
                Регистрация
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
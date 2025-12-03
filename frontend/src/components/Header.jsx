import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const Header = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('authToken');
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-light bg-light border-bottom">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          {t('common.chatLabel')}
        </Link>
        
        <div className="d-flex align-items-center">
          {isAuthenticated ? (
            <>
              <span className="me-3">{t('common.welcome')}, {username}!</span>
              <button 
                className="btn btn-outline-danger btn-sm"
                onClick={handleLogout}
              >
                {t('common.logout')}
              </button>
            </>
          ) : (
            null
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const Header = () => {
  const { t } = useTranslation();
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
          {t('common.chat')}
        </Link>
        
        <div className="d-flex">
          {isAuthenticated ? (
            <button 
              className="btn btn-outline-danger btn-sm"
              onClick={handleLogout}
            >
              {t('common.logout')}
            </button>
          ) : (
            <div className="d-flex gap-2">
              <Link to="/login" className="btn btn-outline-primary btn-sm">
                {t('common.login')}
              </Link>
              <Link to="/signup" className="btn btn-primary btn-sm">
                {t('common.signup')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
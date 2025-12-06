import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../app/features/auth/AuthContext.jsx';
import { ROUTES } from '../app/routes.jsx';

const useAuth = () => {
  const navigate = useNavigate();
  const {
    user, token, error, login, signup, logout,
  } = useAuthContext();
  const isAuthenticated = Boolean(token);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  return {
    user, token, error, isAuthenticated, login, signup, logout: handleLogout,
  };
};

export default useAuth;

import React from 'react';
import {Link, useLocation} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import LanguageSwitcher from './ui/LanguageSwitcher.jsx';
import useAuth from '../../hooks/useAuth.js';
import {ROUTES} from '../routes.jsx';

const Header = () => {
    const {t} = useTranslation();
    const location = useLocation();
    const hideLogoutButton = location.pathname === ROUTES.ROOT;
    const {logout} = useAuth();

    return (
        <header className="chat-header">
            <h1>
                <Link to={ROUTES.ROOT}>Code Chat</Link>
            </h1>
            <div className="lang-switcher">
                <LanguageSwitcher/>
            </div>
            {hideLogoutButton && (
                <button className="logout-button" onClick={logout}>
                    {t('header.logoutBtn')}
                </button>
            )}
        </header>
    );
};

export default Header;

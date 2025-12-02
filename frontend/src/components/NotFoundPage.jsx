import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

const NotFoundPage = () => {
  const { t } = useTranslation();
  
  return (
    <Container className="text-center mt-5">
      <div className="d-flex flex-column align-items-center">
        <h1 className="display-1 text-muted">404</h1>
        <h2 className="mb-4">{t('errors.notFound')}</h2>
        <p className="lead mb-4">{t('errors.pageNotExist')}</p>
        
        {/* Добавлена кнопка перехода на главную */}
        <div className="mt-4">
          <Button as={Link} to="/" variant="primary" size="lg" className="me-3">
            {t('errors.goToMain')}
          </Button>
          <Button as={Link} to="/login" variant="outline-secondary" size="lg">
            {t('common.login')}
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default NotFoundPage;
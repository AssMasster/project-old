import React from 'react';
import { useTranslation } from 'react-i18next';

export const NotFoundPage = () => {
  const { t } = useTranslation();
  
  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="text-center">
        <h1>{t('errors.notFound')}</h1>
        <p>Запрашиваемая страница не существует</p>
      </div>
    </div>
  );
};
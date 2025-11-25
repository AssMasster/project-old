import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Импорт переводов
import translationRU from './locales/ru/translation.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ru: {
        translation: translationRU,
      },
    },
    lng: 'ru', // Фиксированная локаль
    fallbackLng: 'ru',
    debug: process.env.NODE_ENV === 'development',

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import ruLang from '../locales/ru/translation.json';
import enLang from '../locales/en/translation.json';

i18n.use(initReactI18next).init({
  resources: {
    ru: { translation: ruLang },
    en: { translation: enLang },
  },

  lng: 'ru',
  fallbackLng: 'en',

  debug: false,

  interpolation: { escapeValue: false },
});

export default i18n;

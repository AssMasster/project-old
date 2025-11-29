import { Profanity } from 'leo-profanity';

// Инициализация фильтра
const profanityFilter = new Profanity();

// Настройка русского словаря
profanityFilter.loadDictionary('ru');

// Функция для фильтрации текста
export const filterProfanity = (text) => {
  if (!text || typeof text !== 'string') return text;
  
  return profanityFilter.clean(text);
};

// Функция для проверки содержит ли текст нецензурные слова
export const hasProfanity = (text) => {
  if (!text || typeof text !== 'string') return false;
  
  return profanityFilter.check(text);
};

// Функция для получения списка нецензурных слов в тексте
export const getProfanityWords = (text) => {
  if (!text || typeof text !== 'string') return [];
  
  return profanityFilter.list(text);
};

export default profanityFilter;
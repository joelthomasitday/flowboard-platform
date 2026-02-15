import 'server-only';
import { Locale } from './config';

const dictionaries = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  de: () => import('./dictionaries/de.json').then((module) => module.default),
  fr: () => import('./dictionaries/en.json').then((module) => module.default), // Fallback for demo
  es: () => import('./dictionaries/en.json').then((module) => module.default), // Fallback
};

export const getDictionary = async (locale: Locale) => {
  return dictionaries[locale] ? dictionaries[locale]() : dictionaries.en();
};

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import all locale JSON files
import en from './locales/en.json';
import ar from './locales/ar.json';
import ur from './locales/ur.json';
import tr from './locales/tr.json';
import fr from './locales/fr.json';
import es from './locales/es.json';
import hi from './locales/hi.json';
import id from './locales/id.json';
import de from './locales/de.json';
import ru from './locales/ru.json';
import bn from './locales/bn.json';
import pt from './locales/pt.json';
import zh from './locales/zh.json';
import ja from './locales/ja.json';
import sw from './locales/sw.json';
import ko from './locales/ko.json';

const resources = {
  en: { translation: en },
  ar: { translation: ar },
  ur: { translation: ur },
  tr: { translation: tr },
  fr: { translation: fr },
  es: { translation: es },
  hi: { translation: hi },
  id: { translation: id },
  de: { translation: de },
  ru: { translation: ru },
  bn: { translation: bn },
  pt: { translation: pt },
  zh: { translation: zh },
  ja: { translation: ja },
  sw: { translation: sw },
  ko: { translation: ko },
};

/** All supported locale codes – mirrors the Locale type in types.ts */
export const SUPPORTED_LOCALES = [
  'en', 'ar', 'ur', 'tr', 'fr', 'es', 'hi', 'id',
  'de', 'ru', 'bn', 'pt', 'zh', 'ja', 'sw', 'ko',
] as const;

/** RTL locale detection */
export const RTL_LOCALES = ['ar', 'ur'];
export function isRTLLocale(locale: string): boolean {
  return RTL_LOCALES.includes(locale as any);
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: SUPPORTED_LOCALES as unknown as string[],
    interpolation: {
      escapeValue: false, // React already escapes
    },
    detection: {
      // Priority: localStorage key > htmlTag > navigator
      order: ['localStorage', 'htmlTag', 'navigator'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;

import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { en, pt, type TranslationKey } from './translations';

export type Language = 'pt' | 'en';

const STORAGE_KEY = 'superbicho:language';
const dictionaries: Record<Language, Record<TranslationKey, string>> = { pt, en };

// Idioma atual também fica num módulo: mensagens de erro e o texto do lembrete
// são montados fora dos componentes
let currentLanguage: Language = 'pt';

export function getLanguage() {
  return currentLanguage;
}

export function getLocale(language: Language = currentLanguage) {
  return language === 'en' ? 'en-US' : 'pt-BR';
}

export type TranslationParams = Record<string, string | number>;

export function t(key: TranslationKey, params?: TranslationParams) {
  const text = dictionaries[currentLanguage][key] ?? pt[key];
  if (!params) return text;
  return text.replace(/\{(\w+)\}/g, (match, name) =>
    params[name] != null ? String(params[name]) : match,
  );
}

// "2026-11-02" → 02/11/2026 (pt) ou 11/02/2026 (en)
export function formatIsoDate(isoDate: string) {
  const [year, month, day] = isoDate.slice(0, 10).split('-').map(Number);
  if (!year || !month || !day) return isoDate;
  return new Date(year, month - 1, day).toLocaleDateString(getLocale(), {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

// Status vindo da API (AGENDADO, CANCELADO...); desconhecidos aparecem como vieram
export function translateStatus(status: string) {
  const key = `status.${status}` as TranslationKey;
  return key in pt ? t(key) : status;
}

interface LanguageContextData {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: typeof t;
}

const LanguageContext = createContext<LanguageContextData>({
  language: 'pt',
  setLanguage: () => {},
  toggleLanguage: () => {},
  t,
});

export function LanguageProvider({ children }: PropsWithChildren) {
  const [language, setLanguageState] = useState<Language>(currentLanguage);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => {
        if (saved === 'pt' || saved === 'en') setLanguage(saved);
      })
      .catch(() => {});
  }, []);

  function setLanguage(next: Language) {
    currentLanguage = next;
    setLanguageState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
  }

  function toggleLanguage() {
    setLanguage(language === 'pt' ? 'en' : 'pt');
  }

  // t muda de identidade a cada idioma: componentes que dependem dele re-renderizam
  const translate: typeof t = (key, params) => t(key, params);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t: translate }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  return useContext(LanguageContext);
}

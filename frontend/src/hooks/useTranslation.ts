import { useState, useEffect } from 'react';
import en from '../locales/en.json';
import ko from '../locales/ko.json';
import zh from '../locales/zh.json';
import ar from '../locales/ar.json';

const translations: any = { en, ko, zh, ar };

export const useTranslation = () => {
  const [currentLang, setCurrentLang] = useState(() => {
    const saved = localStorage.getItem('language');
    return saved && translations[saved] ? saved : 'en';
  });

  // 언어 변경 이벤트 감지
  useEffect(() => {
    const handler = () => {
      const saved = localStorage.getItem('language');
      if (saved && translations[saved]) {
        setCurrentLang(saved);
      }
    };
    window.addEventListener('languageChange', handler);
    return () => window.removeEventListener('languageChange', handler);
  }, []);

  const setLanguage = (lang: string) => {
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    window.dispatchEvent(new Event('languageChange')); // 🔑 강제 알림
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[currentLang];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  return { t, currentLang, setLanguage };
};

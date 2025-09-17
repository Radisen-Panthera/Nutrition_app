import { useState } from 'react';
import en from '../locales/en.json';
import ko from '../locales/ko.json';
import zh from '../locales/zh.json';
import ar from '../locales/ar.json';

const translations: any = { en, ko, zh, ar };

export const useTranslation = () => {
  const [currentLang, setCurrentLang] = useState(() => {
    // 초기값을 localStorage에서 가져오기
    const saved = localStorage.getItem('language');
    return saved && translations[saved] ? saved : 'en';
  });

  const setLanguage = (lang: string) => {
    setCurrentLang(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
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
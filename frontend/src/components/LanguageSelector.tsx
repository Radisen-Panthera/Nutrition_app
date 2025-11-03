import React from 'react';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next'; // i18n 훅 가져오기
import './LanguageSelector.css';

interface LanguageSelectorProps {
  currentLang: string;
  onLanguageChange: (lang: string) => void;
}

const languages = [
  { code: 'en', name: 'English', flag: 'EN' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'zh', name: '繁體中文', flag: '🇹🇼' },
  { code: 'ar', name: 'العربية', flag: '🇦🇪' }
];

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  currentLang, 
  onLanguageChange 
}) => {
  const { i18n } = useTranslation();

  const handleChangeLang = (langCode: string) => {
    onLanguageChange(langCode);
    i18n.changeLanguage(langCode); // 🔑 이걸 추가해야 새로고침 없이 즉시 반영됨
  };

  return (
    <div className="language-selector">
      <Globe className="language-icon" size={20} />
      <div className="language-buttons">
        {languages.map((lang) => (
          <motion.button
            key={lang.code}
            onClick={() => handleChangeLang(lang.code)}
            className={`language-button ${currentLang === lang.code ? 'active' : ''}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="language-flag">{lang.flag}</span>
            <span className="language-name">{lang.name}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;

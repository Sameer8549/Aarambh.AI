
'use client';

import type { Language } from '@/types';
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

import en from '@/locales/en.json';
import hi from '@/locales/hi.json';
import hinglish from '@/locales/hinglish.json';
import ta from '@/locales/ta.json';
import kn from '@/locales/kn.json';
import bn from '@/locales/bn.json';

type Translations = Record<string, any>;

const translations: Record<Language, Translations> = {
  en,
  hi,
  hinglish,
  ta,
  kn,
  bn,
};

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, options?: Record<string, string | number>) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string, options?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let text = translations[language];
    try {
        for (const k of keys) {
            text = text[k];
        }
    } catch(e) {
        return key;
    }
    
    if (typeof text !== 'string') {
        return key;
    }

    if (options) {
        return Object.entries(options).reduce((acc, [k, v]) => {
            return acc.replace(`{{${k}}}`, String(v));
        }, text);
    }
    
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

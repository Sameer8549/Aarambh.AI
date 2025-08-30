
'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Language } from '@/types';

const languages: { value: Language; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'हिंदी' },
  { value: 'hinglish', label: 'Hinglish' },
  { value: 'ta', label: 'தமிழ்' },
  { value: 'kn', label: 'ಕನ್ನಡ' },
  { value: 'bn', label: 'বাংলা' },
];

export default function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage();

  const handleValueChange = (value: string) => {
    setLanguage(value as Language);
  };

  return (
    <Select value={language} onValueChange={handleValueChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={t('common.language')} />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.value} value={lang.value}>
            {lang.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

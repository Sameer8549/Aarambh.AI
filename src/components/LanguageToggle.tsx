
'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Languages } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Language } from '@/types';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';


const languages: { value: Language; label: string, short: string }[] = [
  { value: 'en', label: 'English', short: 'En' },
  { value: 'hi', label: 'हिंदी', short: 'हिं' },
  { value: 'hinglish', label: 'Hinglish', short: 'Hi' },
  { value: 'ta', label: 'தமிழ்', short: 'த' },
  { value: 'kn', label: 'ಕನ್ನಡ', short: 'ಕ' },
  { value: 'bn', label: 'বাংলা', short: 'বা' },
];

export default function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage();

  const handleValueChange = (value: string) => {
    setLanguage(value as Language);
  };

  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <DropdownMenu>
       <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="px-2">
           <Languages className="h-5 w-5"/>
           <span className="sr-only">{t('common.language')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {languages.map((lang) => (
          <DropdownMenuItem key={lang.value} onClick={() => handleValueChange(lang.value)}>
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  MessageCircle,
  Wind,
  BookText,
  Library,
  Home,
  PanelLeft,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import AarambhIcon from './AarambhIcon';
import LanguageToggle from './LanguageToggle';
import { Button } from './ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import ThemeToggle from './ThemeToggle';
import { useLanguage } from '@/contexts/LanguageContext';

const NavLink = ({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} passHref>
      <Button
        variant={isActive ? 'secondary' : 'ghost'}
        className={'w-full justify-start'}
        aria-current={isActive ? 'page' : undefined}
      >
        <Icon className="h-5 w-5 mr-3" />
        <span className={'font-medium'}>{label}</span>
      </Button>
    </Link>
  );
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();

  const navItems = [
    { href: '/', label: t('nav.home'), icon: Home },
    { href: '/chat', label: t('nav.chat'), icon: MessageCircle },
    { href: '/calm', label: t('nav.calm'), icon: Wind },
    { href: '/journal', label: t('nav.journal'), icon: BookText },
    { href: '/resources', label: t('nav.resources'), icon: Library },
    { href: '/generate', label: t('nav.generate'), icon: Sparkles },
  ];

  React.useEffect(() => {
    setIsSheetOpen(false);
  }, [pathname]);

  const showBackButton = pathname !== '/';

  return (
    <div className="flex h-screen bg-background">
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between p-4 border-b bg-card">
          <div className="flex items-center gap-2">
            {showBackButton && (
              <Button
                variant="ghost"
                onClick={() => router.back()}
                aria-label={t('common.back')}
                className="pl-0 pr-2"
              >
                <ArrowLeft className="h-6 w-6" />
              </Button>
            )}
             <Link href="/" className="flex items-center gap-2">
              <AarambhIcon />
              <h1 className="text-xl font-bold font-headline">Aarambh.AI</h1>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  aria-label={t('nav.openMenu')}
                  className="px-2"
                >
                  <PanelLeft className="h-6 w-6" />
                   <span className="ml-2 font-medium hidden sm:inline">{t('common.menu')}</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0 flex flex-col">
                <SheetHeader className="p-4 border-b">
                  <SheetTitle>{t('nav.title')}</SheetTitle>
                </SheetHeader>
                <nav className="p-4 space-y-2 flex-1">
                  {navItems.map((item) => (
                    <NavLink key={item.href} {...item} />
                  ))}
                </nav>
                <div className="p-4 border-t space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">{t('common.language')}</p>
                    <LanguageToggle />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">{t('common.theme')}</p>
                    <ThemeToggle />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}

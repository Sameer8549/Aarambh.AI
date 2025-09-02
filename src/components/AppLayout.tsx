
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  MessageCircle,
  Wind,
  BookText,
  Home,
  PanelLeft,
  Wand,
  ArrowLeft,
  BrainCircuit,
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
  label:string;
  icon: React.ElementType;
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} passHref>
      <Button
        variant={isActive ? 'secondary' : 'ghost'}
        className={'w-full justify-start text-base py-6'}
        aria-current={isActive ? 'page' : undefined}
      >
        <Icon className="h-5 w-5 mr-4" />
        <span className={'font-medium'}>{label}</span>
      </Button>
    </Link>
  );
};

const SidebarContent = () => {
    const { t } = useLanguage();
    const navItems = [
        { href: '/', label: t('nav.home'), icon: Home },
        { href: '/chat', label: t('nav.chat'), icon: MessageCircle },
        { href: '/calm', label: t('nav.calm'), icon: Wind },
        { href: '/journal', label: t('nav.journal'), icon: BookText },
        { href: '/knowledge', label: t('nav.knowledge'), icon: BrainCircuit },
        { href: '/story', label: t('nav.story'), icon: Wand },
    ];
    return (
        <div className='h-full flex flex-col'>
            <div className="p-4 border-b">
                <Link href="/" className="flex items-center gap-3">
                 <AarambhIcon className="h-10 w-10" />
                  <h2 className="text-2xl font-bold font-headline">Aarambh.AI</h2>
               </Link>
           </div>
            <nav className="p-4 space-y-2 flex-1">
              {navItems.map((item) => (
                <NavLink key={item.href} {...item} />
              ))}
            </nav>
        </div>
    )
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();

  React.useEffect(() => {
    setIsSheetOpen(false);
  }, [pathname]);

  const isHomePage = pathname === '/';

  if (isHomePage) {
    return (
        <div className="relative min-h-screen bg-secondary/30">
            <div className='absolute top-4 right-4 flex items-center gap-2'>
                <LanguageToggle />
                <ThemeToggle />
            </div>
            {children}
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary/30 lg:grid lg:grid-cols-[280px_1fr]">
        <aside className="hidden lg:flex lg:flex-col lg:border-r bg-card">
            <SidebarContent />
        </aside>
      <div className="flex flex-col h-screen">
          <header className="flex items-center justify-between p-2 border-b bg-card lg:hidden">
              <div className="flex items-center gap-2">
                 <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                    <Button
                        variant="ghost"
                        aria-label={t('nav.openMenu')}
                        className="px-2"
                    >
                        <PanelLeft className="h-6 w-6" />
                        <span className="sr-only">{t('common.menu')}</span>
                    </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80 p-0 flex flex-col">
                        <SheetHeader className="p-4 border-b">
                            <Link href="/" className="flex items-center gap-3">
                                <AarambhIcon className="h-10 w-10" />
                                <h2 className="text-2xl font-bold font-headline">Aarambh.AI</h2>
                            </Link>
                            <SheetTitle className="sr-only">{t('nav.title')}</SheetTitle>
                        </SheetHeader>
                        <SidebarContent />
                         <div className="p-4 border-t space-y-4">
                            <div>
                                <p className="text-sm font-semibold text-muted-foreground mb-2">{t('common.language')}</p>
                                <LanguageToggle />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-muted-foreground mb-2">{t('common.theme')}</p>
                                <ThemeToggle />
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
                 <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    aria-label={t('common.back')}
                    className="px-2"
                >
                    <ArrowLeft className="h-6 w-6" />
                </Button>
              </div>

              <Link href="/" className="flex items-center gap-2" aria-label="Aarambh.AI Home">
                <AarambhIcon className="h-8 w-8" />
                <h1 className="text-xl font-bold font-headline hidden sm:block">Aarambh.AI</h1>
              </Link>
            
               <div className="w-24 justify-end flex items-center">
                 <div className="lg:hidden">
                    <ThemeToggle />
                    <LanguageToggle />
                 </div>
               </div>
          </header>
          <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}

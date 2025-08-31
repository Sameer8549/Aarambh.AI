
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
  Wand,
  LogIn,
  LogOut,
  User,
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
import { useAuth } from '@/contexts/AuthContext';
import { auth } from '@/lib/firebase';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';

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
  const { user } = useAuth();

  const navItems = [
    { href: '/', label: t('nav.home'), icon: Home },
    { href: '/chat', label: t('nav.chat'), icon: MessageCircle },
    { href: '/calm', label: t('nav.calm'), icon: Wind },
    { href: '/journal', label: t('nav.journal'), icon: BookText },
    { href: '/resources', label: t('nav.resources'), icon: Library },
    { href: '/story', label: t('nav.story'), icon: Wand },
  ];

  React.useEffect(() => {
    setIsSheetOpen(false);
  }, [pathname]);

  const showBackButton = pathname !== '/';

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/');
  }

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
          <div className="flex items-center gap-4">
             {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                        <AvatarFallback><User/></AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.displayName}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>{t('login.logout')}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
             ) : (
                <Button asChild variant='outline'>
                    <Link href="/login">
                        <LogIn />
                        <span>{t('login.login')}</span>
                    </Link>
                </Button>
             )}
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

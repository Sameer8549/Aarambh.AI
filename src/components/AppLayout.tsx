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

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/chat', label: 'AI Chat', icon: MessageCircle },
  { href: '/calm', label: 'Calming Activities', icon: Wind },
  { href: '/journal', label: 'Gratitude Journal', icon: BookText },
  { href: '/resources', label: 'Resource Hub', icon: Library },
];

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
                size="icon"
                onClick={() => router.back()}
                aria-label="Go back"
              >
                <ArrowLeft className="h-6 w-6" />
              </Button>
            )}
            <Link href="/" className="flex items-center gap-2">
              <AarambhIcon className="h-8 w-8" />
              <h1 className="text-xl font-bold font-headline">Aarambh.AI</h1>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open navigation menu"
                >
                  <PanelLeft className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <SheetHeader className="p-4 border-b">
                  <SheetTitle>App Navigation</SheetTitle>
                </SheetHeader>
                <nav className="p-4 space-y-2">
                  {navItems.map((item) => (
                    <NavLink key={item.href} {...item} />
                  ))}
                </nav>
                <div className="p-4 absolute bottom-0 w-full border-t">
                  <LanguageToggle />
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

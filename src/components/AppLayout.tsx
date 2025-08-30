'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  MessageCircle,
  Wind,
  BookText,
  Library,
  Home,
  PanelLeft,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import AarambhIcon from './AarambhIcon';
import LanguageToggle from './LanguageToggle';
import { Button } from './ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from './ui/sheet';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/chat', label: 'Chat', icon: MessageCircle },
  { href: '/calm', label: 'Calm', icon: Wind },
  { href: '/journal', label: 'Journal', icon: BookText },
  { href: '/resources', label: 'Resources', icon: Library },
];

const NavLink = ({
  href,
  label,
  icon: Icon,
  isMobile = false,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  isMobile?: boolean;
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} passHref>
      <Button
        variant={isActive ? 'secondary' : 'ghost'}
        className={cn('w-full justify-start', isMobile && 'justify-center')}
        aria-current={isActive ? 'page' : undefined}
      >
        <Icon className="h-5 w-5 mr-3" />
        <span className={cn(isMobile && 'sr-only', 'font-medium')}>
          {label}
        </span>
      </Button>
    </Link>
  );
};

const MobileNav = () => (
  <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t shadow-t-lg z-50">
    <div className="flex justify-around items-center h-16">
      {navItems.map((item) => (
        <Link href={item.href} key={item.href} className="flex-1">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'flex flex-col h-full w-full rounded-none',
              usePathname() === item.href && 'text-primary bg-secondary'
            )}
          >
            <item.icon className="h-6 w-6" />
            <span className="text-xs">{item.label}</span>
          </Button>
        </Link>
      ))}
    </div>
  </nav>
);

const DesktopSidebar = () => (
  <aside className="hidden md:flex flex-col w-64 border-r bg-card/50">
    <div className="p-4 border-b">
      <Link href="/" className="flex items-center gap-2">
        <AarambhIcon className="h-8 w-8" />
        <h1 className="text-xl font-bold font-headline">Aarambh.AI</h1>
      </Link>
    </div>
    <nav className="flex-1 p-4 space-y-2">
      {navItems.map((item) => (
        <NavLink key={item.href} {...item} />
      ))}
    </nav>
    <div className="p-4 border-t">
      <LanguageToggle />
    </div>
  </aside>
);

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background">
      <DesktopSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="md:hidden flex items-center justify-between p-4 border-b bg-card">
          <Link href="/" className="flex items-center gap-2">
            <AarambhIcon className="h-8 w-8" />
            <h1 className="text-xl font-bold font-headline">Aarambh.AI</h1>
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <PanelLeft className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SheetHeader className="p-4 border-b">
                 <Link href="/" className="flex items-center gap-2">
                    <AarambhIcon className="h-8 w-8" />
                    <h1 className="text-xl font-bold font-headline">Aarambh.AI</h1>
                </Link>
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
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-20 md:pb-8">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}

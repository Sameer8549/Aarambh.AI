
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
import { Separator } from './ui/separator';

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
          <div className="flex items-center gap-4">
            {showBackButton && (
              <Button
                variant="ghost"
                onClick={() => router.back()}
                aria-label="Go back"
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
                  aria-label="Open navigation menu"
                  className="px-2"
                >
                  <PanelLeft className="h-6 w-6" />
                   <span className="ml-2 font-medium sr-only sm:not-sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0 flex flex-col">
                <SheetHeader className="p-4 border-b">
                   <SheetTitle>App Navigation</SheetTitle>
                </SheetHeader>
                <nav className="p-4 space-y-2 flex-1">
                  {navItems.map((item) => (
                    <NavLink key={item.href} {...item} />
                  ))}
                </nav>
                <div className="p-4 border-t space-y-4">
                  <div>
                    <p className='text-sm text-muted-foreground mb-2'>Language</p>
                    <LanguageToggle />
                  </div>
                  <div>
                    <p className='text-sm text-muted-foreground mb-2'>Theme</p>
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

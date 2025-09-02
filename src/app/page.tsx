
'use client';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  MessageCircle,
  Wind,
  BookText,
  Library,
  HeartPulse,
  Wand,
} from 'lucide-react';
import AarambhIcon from '@/components/AarambhIcon';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageToggle from '@/components/LanguageToggle';
import ThemeToggle from '@/components/ThemeToggle';

export default function Home() {
  const { t } = useLanguage();

  const features = [
    {
      title: t('features.chat.title'),
      description: t('features.chat.description'),
      href: '/chat',
      icon: <MessageCircle className="h-8 w-8 text-primary" />,
    },
    {
      title: t('features.calm.title'),
      description: t('features.calm.description'),
      href: '/calm',
      icon: <Wind className="h-8 w-8 text-primary" />,
    },
    {
      title: t('features.journal.title'),
      description: t('features.journal.description'),
      href: '/journal',
      icon: <BookText className="h-8 w-8 text-primary" />,
    },
    {
      title: t('features.resources.title'),
      description: t('features.resources.description'),
      href: '/resources',
      icon: <Library className="h-8 w-8 text-primary" />,
    },
    {
      title: t('features.story.title'),
      description: t('features.story.description'),
      href: '/story',
      icon: <Wand className="h-8 w-8 text-primary" />,
    },
  ];


  return (
    <div className="flex flex-col items-center justify-center min-h-full p-4 md:p-8 from-background to-secondary/50 bg-gradient-to-b">
       <div className='absolute top-4 right-4 flex items-center gap-2'>
        <LanguageToggle />
        <ThemeToggle />
       </div>

      <header className="text-center mb-8 md:mb-12">
        <AarambhIcon className="h-40 w-40 mx-auto" />
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-foreground tracking-tight mt-4">
          Aarambh.AI
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          {t('home.tagline')}
        </p>
      </header>

      <main className="w-full max-w-5xl">
        <div className="text-center my-8">
            <h2 className="font-headline text-3xl font-bold text-foreground">
                {t('home.offerTitle')}
            </h2>
            <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
                {t('home.offerSubtitle')}
            </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
             <Link href={feature.href} key={feature.href} passHref>
              <Card className="h-full transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer bg-card/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                  {feature.icon}
                  <CardTitle className="font-headline text-2xl">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>

      <footer className="mt-12 text-center text-muted-foreground text-sm">
        <p>
          <HeartPulse className="inline-block h-4 w-4 mr-1" />
          {t('home.footer')}
        </p>
      </footer>
    </div>
  );
}

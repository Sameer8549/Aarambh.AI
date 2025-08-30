import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  MessageCircle,
  Wind,
  BookText,
  Library,
  HeartPulse,
} from 'lucide-react';
import AarambhIcon from '@/components/AarambhIcon';

const features = [
  {
    title: 'AI Chat',
    description: 'Talk anonymously with an empathetic AI friend.',
    href: '/chat',
    icon: <MessageCircle className="h-8 w-8 text-primary" />,
  },
  {
    title: 'Calming Activities',
    description: 'Relax with guided breathing and soothing music.',
    href: '/calm',
    icon: <Wind className="h-8 w-8 text-primary" />,
  },
  {
    title: 'Gratitude Journal',
    description: 'Reflect on the good things in your life.',
    href: '/journal',
    icon: <BookText className="h-8 w-8 text-primary" />,
  },
  {
    title: 'Resource Hub',
    description: 'Find helpful articles, videos, and helplines.',
    href: '/resources',
    icon: <Library className="h-8 w-8 text-primary" />,
  },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-full p-4 md:p-8">
      <header className="text-center mb-8 md:mb-12">
        <div className="inline-block p-4 bg-white/80 rounded-full shadow-md mb-4">
          <AarambhIcon className="h-24 w-24" />
        </div>
        <h1 className="font-headline text-4xl md:text-6xl font-bold text-foreground tracking-tight">
          Welcome to Aarambh.AI
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Your safe and supportive space for mental wellness. Start your journey
          to a calmer mind today.
        </p>
      </header>

      <main className="w-full max-w-4xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
          You are not alone. Support is always available.
        </p>
      </footer>
    </div>
  );
}

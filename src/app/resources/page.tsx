import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Phone,
  Youtube,
  Mic,
  FileText,
  Globe,
  Headphones,
} from 'lucide-react';

const resourceCategories = [
  {
    title: 'Helplines',
    icon: <Phone className="h-6 w-6 text-primary" />,
    items: [
      {
        name: 'National Suicide Prevention Lifeline',
        description: '24/7, free and confidential support for people in distress.',
        link: 'tel:988',
      },
      {
        name: 'Govt. of India National Helpline',
        description:
          'Mental Health Support from the Government of India.',
        link: 'tel:1800-599-0019',
      },
    ],
  },
  {
    title: 'Guided Meditations',
    icon: <Youtube className="h-6 w-6 text-primary" />,
    items: [
      {
        name: '10-Minute Meditation for Beginners',
        description: 'A short, guided meditation to calm your mind.',
        link: 'https://www.youtube.com/watch?v=O-6f5wQXSu8',
      },
      {
        name: 'Meditation for Anxiety',
        description:
          'A guided practice to help ease anxiety and find peace.',
        link: 'https://www.youtube.com/watch?v=4pLUleLdwYI',
      },
    ],
  },
  {
    title: 'Podcasts',
    icon: <Headphones className="h-6 w-6 text-primary" />,
    items: [
      {
        name: 'The Happiness Lab',
        description:
          'Dr. Laurie Santos explores the science of happiness.',
        link: 'https://open.spotify.com/show/3i5TCKhc6GY42pOWkpWveG',
      },
      {
        name: 'Feeling Good Podcast',
        description:
          'Dr. David Burns discusses techniques to overcome depression and anxiety.',
        link: 'https://open.spotify.com/show/0h36N7k3r3aP2aR0Ie19p9',
      },
    ],
  },
  {
    title: 'Blogs & Articles',
    icon: <FileText className="h-6 w-6 text-primary" />,
    items: [
      {
        name: 'WHO on Mental Health',
        description:
          'Information and resources from the World Health Organization.',
        link: 'https://www.who.int/health-topics/mental-health',
      },
      {
        name: 'Psychology Today',
        description: 'A collection of articles on mental health and well-being.',
        link: 'https://www.psychologytoday.com/us',
      },
    ],
  },
];

export default function ResourcesPage() {
  return (
    <div>
      <header className="mb-8">
        <h1 className="text-4xl font-bold font-headline">Resource Hub</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Explore a curated list of resources for mental health and well-being.
        </p>
      </header>

      <div className="space-y-8">
        {resourceCategories.map((category) => (
          <section key={category.title}>
            <h2 className="text-2xl font-bold font-headline flex items-center gap-3 mb-4">
              {category.icon}
              {category.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {category.items.map((item) => (
                <a
                  key={item.name}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Card className="h-full hover:bg-secondary/50 transition-colors">
                    <CardHeader>
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

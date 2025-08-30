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
        name: 'Vandrevala Foundation Mental Health Helpline',
        description: '24/7, free and confidential support for people in distress, available in multiple Indian languages.',
        link: 'tel:9999666555',
      },
      {
        name: 'KIRAN - Mental Health Rehabilitation Helpline',
        description:
          'A national helpline by the Govt. of India for anxiety, stress, depression, and other mental health concerns.',
        link: 'tel:1800-599-0019',
      },
    ],
  },
  {
    title: 'Guided Meditations (Hindi)',
    icon: <Youtube className="h-6 w-6 text-primary" />,
    items: [
      {
        name: '10-Minute Meditation for Stress & Anxiety',
        description: 'A popular, calming guided meditation in Hindi to find peace.',
        link: 'https://www.youtube.com/watch?v=sJ02s1-2vto',
      },
      {
        name: '5-Minute Meditation for Positive Energy',
        description:
          'A short practice to refresh your mind and boost positivity.',
        link: 'https://www.youtube.com/watch?v=s75_N6s59as',
      },
    ],
  },
   {
    title: 'Guided Meditations (English)',
    icon: <Youtube className="h-6 w-6 text-primary" />,
    items: [
      {
        name: '10-Minute Meditation for Beginners',
        description: 'A simple and effective meditation to start your practice.',
        link: 'https://www.youtube.com/watch?v=O-6f5wQXSu8',
      },
      {
        name: 'Meditation for Anxiety',
        description:
          'A guided practice specifically designed to help ease anxiety and find calm.',
        link: 'https://www.youtube.com/watch?v=4pLUleLdwYI',
      },
    ],
  },
  {
    title: 'Podcasts',
    icon: <Headphones className="h-6 w-6 text-primary" />,
    items: [
      {
        name: 'The Ranveer Show (English)',
        description:
          'Conversations on health, career, and mindset for young Indians.',
        link: 'https://open.spotify.com/show/6ZcvVBPQ2To2C2I4pB2HRm',
      },
      {
        name: 'The Habit Coach with Ashdin Doctor',
        description:
          'Actionable advice on building good habits for a better life.',
        link: 'https://open.spotify.com/show/2Q2GUI0A4vA22dI3Sg2K34',
      },
    ],
  },
  {
    title: 'Articles & Information',
    icon: <FileText className="h-6 w-6 text-primary" />,
    items: [
      {
        name: 'Healthline: Mental Health Resources',
        description:
          'Reliable, expert-reviewed articles on various mental health topics.',
        link: 'https://www.healthline.com/health/mental-health-resources',
      },
      {
        name: 'NIMHANS - Self Help Booklets',
        description: 'Helpful booklets on various mental health issues from a premier Indian institute.',
        link: 'https://nimhans.ac.in/well-being-centre-psychology-services/self-help-booklets/',
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
          Explore a curated list of verified resources for mental health and well-being.
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

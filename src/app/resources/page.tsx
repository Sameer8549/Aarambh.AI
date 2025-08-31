
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Phone,
  Youtube,
  Headphones,
  FileText,
  Music,
  Dumbbell,
  AppWindow,
  ExternalLink,
  Book,
} from 'lucide-react';
import {
  wellnessResources,
  groupResourcesByType,
  ResourceTypeEnum,
} from '@/ai/resources';
import type { Resource, ResourceType } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

const iconMap: Record<string, React.ElementType> = {
  helpline: Phone,
  video: Youtube,
  podcast: Headphones,
  article: FileText,
  music: Music,
  exercise: Dumbbell,
  app: AppWindow,
  book: Book
};


function constructSearchUrl(item: Resource): string {
    switch (item.type) {
        case ResourceTypeEnum.Video:
            return `https://www.youtube.com/results?search_query=${encodeURIComponent(item.link)}`;
        case ResourceTypeEnum.Music:
            return `https://open.spotify.com/search/${encodeURIComponent(item.link)}`;
        case ResourceTypeEnum.Podcast:
             return `https://open.spotify.com/search/${encodeURIComponent(item.link)}`;
        case ResourceTypeEnum.App:
            return `https://play.google.com/store/search?q=${encodeURIComponent(item.link)}&c=apps`;
        case ResourceTypeEnum.Helpline:
             if (item.link.startsWith('tel:')) return item.link;
             return `https://www.google.com/search?q=${encodeURIComponent(item.link)}`;
        default:
            return `https://www.google.com/search?q=${encodeURIComponent(item.link)}`;
    }
}


export default function ResourcesPage() {
    const [groupedResources, setGroupedResources] = useState<Record<string, Resource[]>>({});
    const { t } = useLanguage();

    const categoryTitles: Record<string, string> = {
        helpline: t('resources.categories.helpline'),
        video: t('resources.categories.video'),
        podcast: t('resources.categories.podcast'),
        article: t('resources.categories.article'),
        music: t('resources.categories.music'),
        exercise: t('resources.categories.exercise'),
        app: t('resources.categories.app'),
        book: t('resources.categories.book')
    }

    useEffect(() => {
        setGroupedResources(groupResourcesByType(wellnessResources));
    }, []);

    const orderedCategories: ResourceType[] = ['helpline', 'exercise', 'app', 'video', 'music', 'podcast', 'article', 'book'];

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-4xl font-bold font-headline">{t('resources.title')}</h1>
        <p className="text-lg text-muted-foreground mt-2">
          {t('resources.subtitle')}
        </p>
      </header>

      <div className="space-y-8">
        {orderedCategories.map(categoryKey => {
            const resources = groupedResources[categoryKey];
            if(!resources || resources.length === 0) return null;

            const CategoryIcon = iconMap[categoryKey] || FileText;
            const categoryTitle = categoryTitles[categoryKey] || "Resources";

            return (
                 <section key={categoryTitle}>
                    <h2 className="text-2xl font-bold font-headline flex items-center gap-3 mb-4">
                        <CategoryIcon className="h-6 w-6 text-primary" />
                        {categoryTitle}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {resources.map((item) => (
                            <a
                            key={item.title}
                            href={constructSearchUrl(item)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block group"
                            >
                            <Card className="h-full hover:bg-secondary/50 transition-colors">
                                <CardHeader className='flex flex-row items-start justify-between'>
                                <CardTitle className="text-lg">{item.title}</CardTitle>
                                 <ExternalLink className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
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
            )
        })}
      </div>
    </div>
  );
}

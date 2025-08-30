'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Phone,
  Youtube,
  Headphones,
  FileText,
  Music,
} from 'lucide-react';
import {
  wellnessResources,
  groupResourcesByType,
} from '@/ai/resources';
import type { Resource } from '@/types';


const iconMap: Record<string, React.ElementType> = {
  helpline: Phone,
  video: Youtube,
  podcast: Headphones,
  article: FileText,
  music: Music,
};


const categoryTitles: Record<string, string> = {
    helpline: "Global Helplines & Support",
    video: "Guided Meditations & Mindfulness",
    podcast: "Podcasts for Mental Well-being",
    article: "Articles & Information",
    music: "Calming Music & Sounds"
}


export default function ResourcesPage() {
    const [groupedResources, setGroupedResources] = useState<Record<string, Resource[]>>({});

    useEffect(() => {
        setGroupedResources(groupResourcesByType(wellnessResources));
    }, []);

    const orderedCategories = ['helpline', 'video', 'music', 'podcast', 'article'];

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-4xl font-bold font-headline">Resource Hub</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Explore a curated list of verified global resources for mental health and well-being.
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
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                            >
                            <Card className="h-full hover:bg-secondary/50 transition-colors">
                                <CardHeader>
                                <CardTitle className="text-lg">{item.title}</CardTitle>
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

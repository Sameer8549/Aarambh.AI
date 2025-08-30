/**
 * @fileOverview A centralized list of curated, verified Indian mental health resources.
 */

import type { Resource } from "@/types";

export enum IndianResourceType {
    Helpline = 'helpline',
    Video = 'video',
    Podcast = 'podcast',
    Article = 'article',
    Book = 'book',
    Music = 'music',
}

export const indianResources: Resource[] = [
    // Helplines (Verified and Stable)
    {
      title: 'Vandrevala Foundation Mental Health Helpline',
      description: '24/7, free and confidential support for people in distress, available in multiple Indian languages.',
      link: 'tel:9999666555',
      type: 'helpline' as any, // Bypassing strict type for 'tel:' links
      keywords: ['helpline', 'emergency', 'talk', 'suicide', 'distress', 'help'],
    },
    {
      title: 'KIRAN - Mental Health Rehabilitation Helpline',
      description: 'A national helpline by the Govt. of India for anxiety, stress, depression, and other mental health concerns.',
      link: 'tel:1800-599-0019',
      type: 'helpline' as any,
      keywords: ['helpline', 'government', 'anxiety', 'stress', 'depression', 'help'],
    },
    // Guided Meditations & Breathing Exercises (Stable Web Sources)
    {
        title: 'Art of Living - Guided Meditation for Relaxation',
        description: 'An online guided meditation from the Art of Living foundation to calm the mind and body.',
        link: 'https://www.artofliving.org/in-en/guided-meditations-for-relaxation',
        type: 'video',
        keywords: ['meditation', 'english', 'art of living', 'relaxation', 'calm', 'video'],
    },
    {
        title: 'Isha Foundation - Isha Kriya for Clarity',
        description: 'A powerful 12-minute guided meditation for clarity and wellbeing from Sadhguru\'s Isha Foundation.',
        link: 'https://www.isha.sadhguru.org/in/en/yoga-meditation/yoga-program-for-beginners/isha-kriya',
        type: 'video',
        keywords: ['meditation', 'english', 'sadhguru', 'clarity', 'well-being', 'isha', 'video'],
    },
     {
        title: 'Mindful - 10-Minute Breathing Meditation',
        description: 'A simple, effective breathing meditation practice to ground yourself in the present moment.',
        link: 'https://www.mindful.org/a-10-minute-breathing-meditation-to-foster-mindfulness/',
        type: 'video', // Categorized as video as it contains an audio/visual guide
        keywords: ['meditation', 'english', 'breathing', 'mindfulness', 'quick', 'video'],
    },
    // Podcasts (Stable Platforms)
    {
      title: 'The Ranveer Show (English)',
      description: 'Conversations on health, career, and mindset for young Indians.',
      link: 'https://open.spotify.com/show/6ZcvVBPQ2To2C2I4pB2HRm',
      type: 'podcast',
      keywords: ['podcast', 'english', 'ranveer', 'health', 'career', 'mindset', 'self improvement'],
    },
    {
      title: 'The Habit Coach with Ashdin Doctor',
      description: 'Actionable advice on building good habits for a better life.',
      link: 'https://open.spotify.com/show/2Q2GUI0A4vA22dI3Sg2K34',
      type: 'podcast',
      keywords: ['podcast', 'english', 'habits', 'life advice', 'motivation'],
    },
    // Articles & Information (Reputable Organizations)
    {
      title: 'The Live Love Laugh Foundation - Helplines & Resources',
      description: 'Articles and resources on stress, anxiety, depression, and more from an Indian perspective.',
      link: 'https://www.thelivelovelaughfoundation.org/helpline',
      type: 'article',
      keywords: ['article', 'information', 'stress', 'anxiety', 'depression', 'tllf'],
    },
    {
      title: 'NIMHANS - Self Help Booklets',
      description: 'Helpful booklets on various mental health issues from a premier Indian institute.',
      link: 'https://nimhans.ac.in/well-being-centre-psychology-services/self-help-booklets/',
      type: 'article',
      keywords: ['article', 'booklet', 'nimhans', 'self help', 'mental health'],
    },
    {
        title: 'Fortis Healthcare - Understanding Mental Health',
        description: 'An information hub covering various mental health topics from a leading healthcare provider in India.',
        link: 'https://www.fortishealthcare.com/india/speciality/mental-health-and-behavioural-sciences',
        type: 'article',
        keywords: ['article', 'fortis', 'mental health', 'information', 'stress', 'anxiety'],
    },
    // Music & Calming Sounds (Curated from reliable platforms)
    {
      title: 'Indian Classical Music for Relaxation',
      description: 'A curated Spotify playlist of calming Indian classical music.',
      link: 'https://open.spotify.com/playlist/37i9dQZF1DWZNJBw0yX1in',
      type: 'music',
      keywords: ['music', 'indian classical', 'instrumental', 'relaxation', 'spotify'],
    },
    {
      title: 'Bollywood Lofi & Slowed Reverb',
      description: 'A popular playlist for relaxing with modern, calming Bollywood tracks.',
      link: 'https://open.spotify.com/playlist/37i9dQZF1DX2L0iB23Enbq',
      type: 'music',
      keywords: ['music', 'lofi', 'bollywood', 'slowed', 'reverb', 'calm'],
    },
    {
      title: 'Sufi & Spiritual Music',
      description: 'A collection of soulful and contemplative Sufi music from across India.',
      link: 'https://open.spotify.com/playlist/37i9dQZF1DX6E3d9d0go6I',
      type: 'music',
      keywords: ['music', 'sufi', 'spiritual', 'contemplation', 'devotional'],
    },
    {
      title: 'Peaceful Nature Sounds of India',
      description: 'Listen to the calming sounds of Indian forests and nature.',
      link: 'https://www.youtube.com/watch?v=c6l2_ys-R4A',
      type: 'music',
      keywords: ['music', 'nature sounds', 'forest', 'calming', 'ambience'],
    },
];

/**
 * A simple keyword-based search function to find relevant resources.
 * @param query The search query from the AI.
 * @param resourceType Optional filter for the resource type.
 * @returns A list of matching resources.
 */
export function getIndianResources(query: string, resourceType?: IndianResourceType): Resource[] {
    const queryKeywords = query.toLowerCase().split(/\s+/);
    
    const matchedResources = indianResources.filter(resource => {
        // Filter by resource type if provided
        if (resourceType && resource.type !== resourceType) {
            return false;
        }

        // Check for keyword matches in title, description, and keywords
        const searchCorpus = [
            resource.title.toLowerCase(),
            resource.description.toLowerCase(),
            ...(resource.keywords || [])
        ].join(' ');

        return queryKeywords.some(qWord => searchCorpus.includes(qWord));
    });

    // Return a limited number of the best matches
    return matchedResources.slice(0, 3);
}


/**
 * Returns a filtered list of resources by type.
 * @param types An array of resource types to filter by.
 * @returns A list of matching resources.
 */
export function getResourcesByType(types: IndianResourceType[]): Resource[] {
    return indianResources.filter(resource => types.includes(resource.type as IndianResourceType));
}

/**
 * Groups resources by their type.
 * @param resources A list of resources.
 * @returns An object where keys are resource types and values are lists of resources.
 */
export function groupResourcesByType(resources: Resource[]): Record<string, Resource[]> {
    return resources.reduce((acc, resource) => {
        const type = resource.type;
        if (!acc[type]) {
            acc[type] = [];
        }
        acc[type].push(resource);
        return acc;
    }, {} as Record<string, Resource[]>);
}

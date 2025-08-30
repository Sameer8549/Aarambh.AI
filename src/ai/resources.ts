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
    // Helplines
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
    // Guided Meditations from Web Sources
    {
        title: 'Art of Living - Guided Meditation for Relaxation',
        description: 'An online guided meditation from the Art of Living foundation to calm the mind and body.',
        link: 'https://www.artofliving.org/in-en/guided-meditations-for-relaxation',
        type: 'video',
        keywords: ['meditation', 'english', 'art of living', 'relaxation', 'calm'],
    },
    {
        title: 'Isha Foundation - Isha Kriya',
        description: 'A powerful 12-minute guided meditation for clarity and wellbeing from Sadhguru\'s Isha Foundation.',
        link: 'https://www.isha.sadhguru.org/in/en/yoga-meditation/yoga-program-for-beginners/isha-kriya',
        type: 'video',
        keywords: ['meditation', 'english', 'sadhguru', 'clarity', 'well-being', 'isha'],
    },
     {
        title: 'Mindful - A 10-Minute Breathing Meditation',
        description: 'A simple, effective breathing meditation practice to ground yourself in the present moment.',
        link: 'https://www.mindful.org/a-10-minute-breathing-meditation-to-foster-mindfulness/',
        type: 'video', // Categorized as video for simplicity, though it's an audio player on a webpage
        keywords: ['meditation', 'english', 'breathing', 'mindfulness', 'quick'],
    },
    // Podcasts
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
    // Articles & Information
    {
      title: 'The Live Love Laugh Foundation',
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
    // Music from Web Sources
    {
      title: 'Raga Yaman by Hariprasad Chaurasia',
      description: 'Classical Indian flute music for relaxation. (YouTube)',
      link: 'https://www.youtube.com/watch?v=O8keFY32-iU',
      type: 'music',
      keywords: ['music', 'indian classical', 'flute', 'yaman', 'hariprasad chaurasia'],
    },
    {
      title: 'Maeri by Euphoria',
      description: 'Iconic Indian folk rock song. (YouTube)',
      link: 'https://www.youtube.com/watch?v=d2G9A8t1k2s',
      type: 'music',
      keywords: ['music', 'indian folk rock', 'euphoria', 'maeri'],
    },
    {
      title: 'Kun Faya Kun by A.R. Rahman',
      description: 'A soulful Sufi track from the movie Rockstar. (YouTube)',
      link: 'https://www.youtube.com/watch?v=T94PHkuydcw',
      type: 'music',
      keywords: ['music', 'sufi', 'ar rahman', 'kun faya kun', 'bollywood'],
    },
    {
      title: 'Kabira by Tochi Raina, Rekha Bhardwaj',
      description: 'A beautiful folk-pop song from Yeh Jawaani Hai Deewani. (YouTube)',
      link: 'https://www.youtube.com/watch?v=jHNNMj5bNQw',
      type: 'music',
      keywords: ['music', 'indian folk pop', 'kabira', 'bollywood'],
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

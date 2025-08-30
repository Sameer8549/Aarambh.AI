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
}

const indianResources: Resource[] = [
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
    // Guided Meditations (Hindi)
    {
      title: '10-Minute Meditation for Stress & Anxiety (Hindi)',
      description: 'A popular, calming guided meditation in Hindi to find peace.',
      link: 'https://www.youtube.com/watch?v=sJ02s1-2vto',
      type: 'video',
      keywords: ['meditation', 'hindi', 'stress', 'anxiety', 'calm', 'peace'],
    },
    {
      title: '5-Minute Meditation for Positive Energy (Hindi)',
      description: 'A short practice to refresh your mind and boost positivity.',
      link: 'https://www.youtube.com/watch?v=s75_N6s59as',
      type: 'video',
      keywords: ['meditation', 'hindi', 'positive energy', 'quick', 'refresh'],
    },
    // Guided Meditations (English)
    {
      title: 'Sadhguru - Isha Kriya',
      description: 'A simple yet powerful 12-minute guided meditation for clarity and well-being.',
      link: 'https://www.youtube.com/watch?v=yzM94_a7de0',
      type: 'video',
      keywords: ['meditation', 'english', 'sadhguru', 'clarity', 'well-being', 'isha'],
    },
    {
      title: 'Sri Sri Ravi Shankar - Meditation for Hope',
      description: 'A guided meditation for anxiety and to instill hope, from the Art of Living foundation.',
      link: 'https://www.youtube.com/watch?v=3m_i0_yD8so',
      type: 'video',
      keywords: ['meditation', 'english', 'art of living', 'hope', 'anxiety'],
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

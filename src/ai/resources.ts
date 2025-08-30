/**
 * @fileOverview A centralized list of curated, verified global mental health resources.
 */

import type { Resource } from "@/types";

export enum ResourceTypeEnum {
    Helpline = 'helpline',
    Video = 'video',
    Podcast = 'podcast',
    Article = 'article',
    Book = 'book',
    Music = 'music',
    Exercise = 'exercise',
    App = 'app',
}

export const wellnessResources: Resource[] = [
    // === Indian Helplines ===
    {
      title: 'KIRAN - Mental Health Helpline (India)',
      description: 'A 24/7 national helpline by the Government of India offering first-aid, advice, and referral for mental health support. Call 1800-599-0019.',
      link: 'tel:1800-599-0019',
      type: ResourceTypeEnum.Helpline,
      keywords: ['helpline', 'india', 'government', 'support', 'crisis', 'kiran'],
    },
    {
      title: 'Vandrevala Foundation (India)',
      description: 'A 24/7 free and confidential helpline providing emotional support for depression, anxiety, and stress.',
      link: 'https://www.google.com/search?q=Vandrevala+Foundation+helpline',
      type: ResourceTypeEnum.Helpline,
      keywords: ['helpline', 'india', 'vandrevala', 'depression', 'anxiety', 'support'],
    },
    {
      title: 'AASRA (India)',
      description: 'A 24/7 helpline for those who are distressed, depressed, or feeling suicidal. Provides confidential support. Call +91-9820466726.',
      link: 'tel:+91-9820466726',
      type: ResourceTypeEnum.Helpline,
      keywords: ['helpline', 'india', 'suicide', 'depression', 'support', 'aasra'],
    },
    {
      title: 'iCALL (India)',
      description: 'A psychosocial helpline run by TISS providing free telephone and email-based counseling services by trained professionals.',
      link: 'https://www.google.com/search?q=iCALL+TISS+helpline',
      type: ResourceTypeEnum.Helpline,
      keywords: ['helpline', 'india', 'icall', 'counseling', 'tiss', 'support'],
    },

    // === Global Helplines ===
    {
      title: 'Crisis Text Line',
      description: '24/7, free, confidential crisis support via text message. Text HOME to 741741 from anywhere in the US, UK, Canada & Ireland.',
      link: 'https://www.google.com/search?q=Crisis+Text+Line',
      type: ResourceTypeEnum.Helpline,
      keywords: ['helpline', 'emergency', 'crisis', 'text', 'global', 'support'],
    },
    {
      title: 'The Trevor Project',
      description: 'Information & support to LGBTQ young people 24/7, all year round.',
      link: 'https://www.google.com/search?q=The+Trevor+Project',
      type: ResourceTypeEnum.Helpline,
      keywords: ['helpline', 'lgbtq', 'youth', 'support', 'crisis'],
    },
     {
      title: 'Befrienders Worldwide',
      description: 'A global network of emotional support centers to prevent suicide. Find a helpline in your country.',
      link: 'https://www.google.com/search?q=Befrienders+Worldwide',
      type: ResourceTypeEnum.Helpline,
      keywords: ['helpline', 'global', 'suicide', 'support', 'emotional support'],
    },

    // === Guided Meditations & Mindfulness (Stable Web Sources) ===
    {
        title: 'UCLA Mindful Awareness Research Center - Guided Meditations',
        description: 'Free, streamable guided meditations for various needs (breathing, sleep, coping with pain) from UCLA.',
        link: 'https://www.youtube.com/results?search_query=UCLA+Mindful+Awareness+Research+Center+Guided+Meditations',
        type: ResourceTypeEnum.Video, // Categorized as video as they are audio/visual guides
        keywords: ['meditation', 'english', 'ucla', 'mindfulness', 'free', 'breathing', 'sleep', 'exercise'],
    },
    {
        title: 'Tara Brach - Guided Meditations',
        description: 'A large collection of free guided meditations and talks from a world-renowned meditation teacher.',
        link: 'https://www.youtube.com/results?search_query=Tara+Brach+Guided+Meditations',
        type: ResourceTypeEnum.Video,
        keywords: ['meditation', 'english', 'tara brach', 'mindfulness', 'self-compassion', 'calm', 'exercise'],
    },
    {
        title: 'Headspace - Weathering the storm',
        description: 'A free, curated collection of meditations, sleep, and movement exercises from Headspace.',
        link: 'https://www.youtube.com/results?search_query=Headspace+Weathering+the+storm',
        type: ResourceTypeEnum.Video,
        keywords: ['meditation', 'english', 'headspace', 'mindfulness', 'anxiety', 'stress', 'exercise'],
    },
    
    // === Exercises for Mental Health ===
    {
      title: 'Yoga With Adriene - Yoga for Anxiety and Stress',
      description: 'A 27-minute gentle yoga practice to help you feel calm and release tension.',
      link: 'https://www.youtube.com/results?search_query=Yoga+With+Adriene+Yoga+for+Anxiety+and+Stress',
      type: ResourceTypeEnum.Exercise,
      keywords: ['exercise', 'yoga', 'anxiety', 'stress', 'video', 'gentle'],
    },
    {
      title: '7-Minute Workout',
      description: 'A quick, science-based high-intensity circuit workout that can boost mood and energy.',
      link: 'https://www.youtube.com/results?search_query=7-Minute+Workout+Johnson+%26+Johnson',
      type: ResourceTypeEnum.Exercise,
      keywords: ['exercise', 'workout', 'fitness', 'quick', 'energy', 'hiit'],
    },
    {
      title: 'Progressive Muscle Relaxation',
      description: 'A guided script to help you release physical tension, a common symptom of anxiety.',
      link: 'https://www.google.com/search?q=Progressive+Muscle+Relaxation+guided+script',
      type: ResourceTypeEnum.Exercise,
      keywords: ['exercise', 'relaxation', 'anxiety', 'tension', 'pmr', 'article'],
    },

    // === Mental Health Apps ===
     {
      title: 'Calm',
      description: 'A popular app for sleep, meditation, and relaxation, with both free and paid content.',
      link: 'https://www.google.com/search?q=Calm+app',
      type: ResourceTypeEnum.App,
      keywords: ['app', 'meditation', 'sleep', 'relaxation', 'calm'],
    },
    {
      title: 'Headspace',
      description: 'An app that teaches you how to meditate with guided exercises for various topics.',
      link: 'https://www.google.com/search?q=Headspace+app',
      type: ResourceTypeEnum.App,
      keywords: ['app', 'meditation', 'mindfulness', 'stress', 'anxiety', 'headspace'],
    },

    // === Podcasts (Stable Platforms) ===
    {
      title: 'The Happiness Lab with Dr. Laurie Santos',
      description: 'Yale professor Dr. Laurie Santos shares surprising and inspiring stories about the science of happiness.',
      link: 'https://open.spotify.com/search/The%20Happiness%20Lab',
      type: ResourceTypeEnum.Podcast,
      keywords: ['podcast', 'english', 'happiness', 'science', 'psychology', 'well-being'],
    },
    {
      title: 'Ten Percent Happier with Dan Harris',
      description: 'Interviews with meditation teachers, scientists, and celebrities about how to train your mind.',
      link: 'https://www.google.com/search?q=Ten+Percent+Happier+podcast',
      type: ResourceTypeEnum.Podcast,
      keywords: ['podcast', 'english', 'meditation', 'mindfulness', 'dan harris', 'anxiety'],
    },

    // === Articles & Information (Reputable Global Organizations) ===
    {
      title: 'World Health Organization (WHO) - Mental Health',
      description: 'Fact sheets, publications, and information on mental health from the global public health agency.',
      link: 'https://www.google.com/search?q=World+Health+Organization+Mental+Health',
      type: ResourceTypeEnum.Article,
      keywords: ['article', 'information', 'who', 'global health', 'mental health', 'depression', 'treatment', 'medicine'],
    },
    {
      title: 'NIMH - Health Topics',
      description: 'Detailed information on a wide range of mental health disorders from the U.S. National Institute of Mental Health.',
      link: 'https://www.google.com/search?q=NIMH+mental+health+topics',
      type: ResourceTypeEnum.Article,
      keywords: ['article', 'information', 'nimh', 'mental disorders', 'anxiety', 'depression', 'stress', 'treatment', 'medicine'],
    },
    {
        title: 'Mind (UK) - Information & Support',
        description: 'A leading UK mental health charity providing clear, accessible information on A-Z of mental health.',
        link: 'https://www.google.com/search?q=Mind+UK+mental+health+information',
        type: ResourceTypeEnum.Article,
        keywords: ['article', 'information', 'mind uk', 'mental health', 'support', 'well-being', 'treatment', 'medicine'],
    },

    // === Music & Calming Sounds (Curated from reliable platforms) ===
    {
      title: 'Lofi Girl - Relaxing Lofi Music',
      description: 'Famous curated Spotify playlist of calming lofi hip hop music, perfect for studying, relaxing, or sleeping.',
      link: 'https://open.spotify.com/search/lofi%20girl',
      type: ResourceTypeEnum.Music,
      keywords: ['music', 'lofi', 'instrumental', 'relaxation', 'study', 'spotify'],
    },
    {
      title: 'Peaceful Piano Playlist',
      description: 'A popular playlist of soft, solo piano music to help you relax, focus, or find peace.',
      link: 'https://open.spotify.com/search/peaceful%20piano',
      type: ResourceTypeEnum.Music,
      keywords: ['music', 'piano', 'instrumental', 'calm', 'focus', 'classical'],
    },
    {
      title: 'Nature Sounds for Relaxation',
      description: 'A collection of nature soundscapes like rain, forests, and oceans for sleep or meditation.',
      link: 'https://open.spotify.com/search/nature%20sounds',
      type: ResourceTypeEnum.Music,
      keywords: ['music', 'nature sounds', 'ambience', 'sleep', 'meditation', 'calming'],
    },
];

/**
 * A simple keyword-based search function to find relevant resources.
 * @param query The search query from the AI.
 * @param resourceType Optional filter for the resource type.
 * @returns A list of matching resources.
 */
export function getWellnessResources(query: string, resourceType?: ResourceTypeEnum): Resource[] {
    const queryKeywords = query.toLowerCase().split(/\s+/);
    
    const matchedResources = wellnessResources.filter(resource => {
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
export function getResourcesByType(types: ResourceTypeEnum[]): Resource[] {
    return wellnessResources.filter(resource => types.includes(resource.type as ResourceTypeEnum));
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

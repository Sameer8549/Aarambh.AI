
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
      link: 'Vandrevala Foundation helpline',
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
      link: 'iCALL TISS helpline',
      type: ResourceTypeEnum.Helpline,
      keywords: ['helpline', 'india', 'icall', 'counseling', 'tiss', 'support'],
    },

    // === Global Helplines ===
    {
      title: 'Crisis Text Line',
      description: '24/7, free, confidential crisis support via text message. Text HOME to 741741 from anywhere in the US, UK, Canada & Ireland.',
      link: 'Crisis Text Line',
      type: ResourceTypeEnum.Helpline,
      keywords: ['helpline', 'emergency', 'crisis', 'text', 'global', 'support'],
    },
    {
      title: 'The Trevor Project',
      description: 'Information & support to LGBTQ young people 24/7, all year round.',
      link: 'The Trevor Project',
      type: ResourceTypeEnum.Helpline,
      keywords: ['helpline', 'lgbtq', 'youth', 'support', 'crisis'],
    },
     {
      title: 'Befrienders Worldwide',
      description: 'A global network of emotional support centers to prevent suicide. Find a helpline in your country.',
      link: 'Befrienders Worldwide',
      type: ResourceTypeEnum.Helpline,
      keywords: ['helpline', 'global', 'suicide', 'support', 'emotional support'],
    },

    // === Guided Meditations & Mindfulness (Stable Web Sources) ===
    {
        title: 'UCLA Mindful Awareness Research Center - Guided Meditations',
        description: 'Free, streamable guided meditations for various needs (breathing, sleep, coping with pain) from UCLA.',
        link: 'UCLA Mindful Awareness Research Center Guided Meditations',
        type: ResourceTypeEnum.Video, 
        keywords: ['meditation', 'english', 'ucla', 'mindfulness', 'free', 'breathing', 'sleep', 'exercise', 'anxiety', 'stress', 'sad'],
    },
    {
        title: 'Tara Brach - Guided Meditations',
        description: 'A large collection of free guided meditations and talks from a world-renowned meditation teacher.',
        link: 'Tara Brach Guided Meditations for anxiety',
        type: ResourceTypeEnum.Video,
        keywords: ['meditation', 'english', 'tara brach', 'mindfulness', 'self-compassion', 'calm', 'exercise', 'anxiety', 'stress', 'sad'],
    },
    {
        title: 'Headspace - Weathering the storm',
        description: 'A free, curated collection of meditations, sleep, and movement exercises from Headspace.',
        link: 'Headspace guided meditation for stress',
        type: ResourceTypeEnum.Video,
        keywords: ['meditation', 'english', 'headspace', 'mindfulness', 'anxiety', 'stress', 'exercise', 'sad', 'feeling low'],
    },
     {
        title: 'The Honest Guys - Guided Imagery',
        description: 'Immersive guided imagery meditations to transport you to peaceful, calming places.',
        link: 'The Honest Guys guided imagery meditation for relaxation',
        type: ResourceTypeEnum.Video,
        keywords: ['meditation', 'english', 'guided imagery', 'visualization', 'relaxation', 'story', 'exercise', 'calm', 'peace'],
    },
    {
        title: 'Goodful - Mindful Living',
        description: 'A variety of videos on mindfulness, self-care, and simple tips for a healthier mind.',
        link: 'Goodful mindfulness for beginners',
        type: ResourceTypeEnum.Video,
        keywords: ['mindfulness', 'english', 'self-care', 'well-being', 'tips', 'anxiety', 'stress'],
    },
    {
        title: 'Great Meditation - 10-Minute Meditation for Self-Love',
        description: 'A short guided meditation focused on cultivating self-love and acceptance.',
        link: '10-Minute Meditation for Self-Love Great Meditation',
        type: ResourceTypeEnum.Video,
        keywords: ['meditation', 'self-love', 'acceptance', 'short', 'guided', 'sad', 'lonely', 'confidence'],
    },
    {
      title: 'TED - How to deal with anxiety',
      description: 'An informative TED talk by Olivia Remes on simple, actionable coping skills for anxiety.',
      link: 'TED how to deal with anxiety Olivia Remes',
      type: ResourceTypeEnum.Video,
      keywords: ['video', 'anxiety', 'coping skills', 'ted talk', 'information', 'stress'],
    },
    {
      title: 'AsapSCIENCE - The Science of Motivation',
      description: 'An engaging and scientific look at what drives motivation and how to harness it.',
      link: 'AsapSCIENCE The Science of Motivation',
      type: ResourceTypeEnum.Video,
      keywords: ['video', 'motivation', 'science', 'procrastination', 'study', 'work'],
    },
    {
      title: 'Headspace - 10-Minute Meditation for Sleep',
      description: 'A calming guided meditation from Headspace designed to help you unwind and prepare for a restful sleep.',
      link: 'Headspace 10 minute meditation for sleep',
      type: ResourceTypeEnum.Video,
      keywords: ['video', 'meditation', 'sleep', 'headspace', 'calm', 'relax', 'anxiety'],
    },
    {
      title: 'Anna Freud Centre - Dealing with loss and bereavement',
      description: 'Advice for young people on how to cope with feelings of grief and loss, from a leading UK charity.',
      link: 'Anna Freud Centre dealing with loss and bereavement for young people',
      type: ResourceTypeEnum.Video,
      keywords: ['video', 'grief', 'loss', 'bereavement', 'sad', 'coping', 'support'],
    },
    {
      title: 'Kurzgesagt – In a Nutshell - Gratitude',
      description: 'A beautifully animated video explaining the science and benefits of practicing gratitude.',
      link: 'Kurzgesagt Gratitude',
      type: ResourceTypeEnum.Video,
      keywords: ['video', 'gratitude', 'happiness', 'animation', 'science', 'positive'],
    },
    
    // === Exercises for Mental Health ===
    {
      title: 'Yoga With Adriene - Yoga for Anxiety and Stress',
      description: 'A 27-minute gentle yoga practice to help you feel calm and release tension.',
      link: 'Yoga With Adriene Yoga for Anxiety and Stress',
      type: ResourceTypeEnum.Exercise,
      keywords: ['exercise', 'yoga', 'anxiety', 'stress', 'video', 'gentle', 'feeling low'],
    },
    {
      title: '7-Minute Workout',
      description: 'A quick, science-based high-intensity circuit workout that can boost mood and energy.',
      link: '7-Minute Workout Johnson & Johnson',
      type: ResourceTypeEnum.Exercise,
      keywords: ['exercise', 'workout', 'fitness', 'quick', 'energy', 'hiit', 'motivation'],
    },
    {
      title: 'Progressive Muscle Relaxation',
      description: 'A guided script to help you release physical tension, a common symptom of anxiety.',
      link: 'Progressive Muscle Relaxation guided script',
      type: ResourceTypeEnum.Exercise,
      keywords: ['exercise', 'relaxation', 'anxiety', 'tension', 'pmr', 'article', 'stress'],
    },
     {
      title: 'The 5-4-3-2-1 Grounding Technique',
      description: 'A simple but powerful grounding exercise to help you cope with anxiety by using your five senses.',
      link: '5-4-3-2-1 Grounding Technique for anxiety',
      type: ResourceTypeEnum.Exercise,
      keywords: ['exercise', 'anxiety', 'grounding', '5 senses', 'mindfulness', 'article', 'panic'],
    },
    {
      title: 'Quick 10-Minute Dance Workout',
      description: 'An energetic and fun dance workout to boost your mood and get your body moving.',
      link: '10 minute fun dance workout for beginners',
      type: ResourceTypeEnum.Exercise,
      keywords: ['exercise', 'dance', 'workout', 'fun', 'energy', 'video', 'happy', 'motivation'],
    },


    // === Mental Health Apps ===
     {
      title: 'Calm',
      description: 'A popular app for sleep, meditation, and relaxation, with both free and paid content.',
      link: 'Calm app',
      type: ResourceTypeEnum.App,
      keywords: ['app', 'meditation', 'sleep', 'relaxation', 'calm', 'anxiety', 'stress'],
    },
    {
      title: 'Headspace',
      description: 'An app that teaches you how to meditate with guided exercises for various topics.',
      link: 'Headspace app',
      type: ResourceTypeEnum.App,
      keywords: ['app', 'meditation', 'mindfulness', 'stress', 'anxiety', 'headspace'],
    },
    {
      title: 'Wysa: AI Chatbot for Mental Health',
      description: 'An AI chatbot that helps you reframe thoughts through CBT and offers mindfulness exercises.',
      link: 'Wysa app',
      type: ResourceTypeEnum.App,
      keywords: ['app', 'chatbot', 'cbt', 'anxiety', 'stress', 'wysa', 'feeling low', 'sad'],
    },
     {
      title: 'Intellect: Create a better you',
      description: 'A mental health app with guided journaling, rescue sessions, and learning paths based on CBT.',
      link: 'Intellect app',
      type: ResourceTypeEnum.App,
      keywords: ['app', 'cbt', 'journaling', 'anxiety', 'stress', 'intellect', 'therapy'],
    },

    // === Podcasts (Stable Platforms) ===
    {
      title: 'The Happiness Lab with Dr. Laurie Santos',
      description: 'Yale professor Dr. Laurie Santos shares surprising and inspiring stories about the science of happiness.',
      link: 'The Happiness Lab podcast',
      type: ResourceTypeEnum.Podcast,
      keywords: ['podcast', 'english', 'happiness', 'science', 'psychology', 'well-being', 'motivation'],
    },
    {
      title: 'Ten Percent Happier with Dan Harris',
      description: 'Interviews with meditation teachers, scientists, and celebrities about how to train your mind.',
      link: 'Ten Percent Happier podcast',
      type: ResourceTypeEnum.Podcast,
      keywords: ['podcast', 'english', 'meditation', 'mindfulness', 'dan harris', 'anxiety', 'stress'],
    },
     {
      title: 'On Purpose with Jay Shetty',
      description: 'Fascinating conversations with wise people, offering insights on purpose, mindset, and well-being.',
      link: 'On Purpose with Jay Shetty podcast',
      type: ResourceTypeEnum.Podcast,
      keywords: ['podcast', 'english', 'purpose', 'mindset', 'interviews', 'well-being', 'motivation'],
    },
    {
      title: 'The Calmer You Podcast',
      description: 'Chloe Brotheridge, a hypnotherapist and coach, shares advice on managing anxiety and building confidence.',
      link: 'The Calmer You Podcast anxiety',
      type: ResourceTypeEnum.Podcast,
      keywords: ['podcast', 'anxiety', 'confidence', 'calm', 'self-help', 'stress'],
    },

    // === Articles & Information (Reputable Global Organizations) ===
    {
      title: 'World Health Organization (WHO) - Mental Health',
      description: 'Fact sheets, publications, and information on mental health from the global public health agency.',
      link: 'World Health Organization Mental Health',
      type: ResourceTypeEnum.Article,
      keywords: ['article', 'information', 'who', 'global health', 'mental health', 'treatment', 'medicine', 'anxiety', 'stress'],
    },
    {
      title: 'NIMH - Health Topics',
      description: 'Detailed information on a wide range of mental health disorders from the U.S. National Institute of Mental Health.',
      link: 'NIMH mental health topics',
      type: ResourceTypeEnum.Article,
      keywords: ['article', 'information', 'nimh', 'mental disorders', 'anxiety', 'stress', 'treatment', 'medicine', 'feeling low'],
    },
    {
        title: 'Mind (UK) - Information & Support',
        description: 'A leading UK mental health charity providing clear, accessible information on A-Z of mental health.',
        link: 'Mind UK mental health information',
        type: ResourceTypeEnum.Article,
        keywords: ['article', 'information', 'mind uk', 'mental health', 'support', 'well-being', 'treatment', 'medicine', 'anxiety'],
    },
    {
      title: 'HelpGuide - How to Stop Worrying',
      description: 'Practical tips and techniques from HelpGuide.org to break the chronic worrying cycle.',
      link: 'HelpGuide.org how to stop worrying',
      type: ResourceTypeEnum.Article,
      keywords: ['article', 'worry', 'anxiety', 'helpguide', 'tips', 'stress'],
    },
    {
      title: 'Verywell Mind - How to Practice Mindfulness',
      description: 'A beginner\'s guide from Verywell Mind on how to start practicing mindfulness for stress reduction.',
      link: 'Verywell Mind how to practice mindfulness for beginners',
      type: ResourceTypeEnum.Article,
      keywords: ['article', 'mindfulness', 'beginners', 'verywell mind', 'stress', 'anxiety'],
    },
    {
      title: 'WHO - Adolescent Mental Health',
      description: 'Information from the World Health Organization on mental health specific to adolescents.',
      link: 'WHO adolescent mental health',
      type: ResourceTypeEnum.Article,
      keywords: ['article', 'teen', 'youth', 'adolescent', 'who', 'information'],
    },
    {
      title: 'NIMH - I\'m So Stressed Out!',
      description: 'A factsheet for teens from the National Institute of Mental Health on understanding and coping with stress.',
      link: 'NIMH I\'m So Stressed Out! Fact-Sheet',
      type: ResourceTypeEnum.Article,
      keywords: ['article', 'stress', 'teen', 'nimh', 'coping', 'factsheet'],
    },


    // === Music & Calming Sounds (Curated from reliable platforms) ===
    {
      title: 'Lofi Girl - Relaxing Lofi Music',
      description: 'Famous curated playlist of calming lofi hip hop music, perfect for studying, relaxing, or sleeping.',
      link: 'lofi girl',
      type: ResourceTypeEnum.Music,
      keywords: ['music', 'lofi', 'instrumental', 'relaxation', 'study', 'spotify', 'focus', 'calm'],
    },
    {
      title: 'Peaceful Piano Playlist',
      description: 'A popular playlist of soft, solo piano music to help you relax, focus, or find peace.',
      link: 'peaceful piano',
      type: ResourceTypeEnum.Music,
      keywords: ['music', 'piano', 'instrumental', 'calm', 'focus', 'classical', 'sad', 'relax'],
    },
    {
      title: 'Nature Sounds for Relaxation',
      description: 'A collection of nature soundscapes like rain, forests, and oceans for sleep or meditation.',
      link: 'nature sounds',
      type: ResourceTypeEnum.Music,
      keywords: ['music', 'nature sounds', 'ambience', 'sleep', 'meditation', 'calming', 'stress'],
    },
    {
      title: 'Ambient Chill Music',
      description: 'Relaxing electronic music with soft pads and atmospheric textures to reduce stress and improve focus.',
      link: 'ambient chill',
      type: ResourceTypeEnum.Music,
      keywords: ['music', 'ambient', 'electronic', 'focus', 'relaxation', 'chill', 'stress'],
    },
    {
      title: 'Indian Classical for Relaxation',
      description: 'Soothing instrumental Indian classical music featuring instruments like sitar and flute.',
      link: 'indian classical for relaxation',
      type: ResourceTypeEnum.Music,
      keywords: ['music', 'indian classical', 'instrumental', 'sitar', 'flute', 'meditation', 'calming', 'sad'],
    },
    {
      title: 'Calm Music for Stress Relief',
      description: 'A curated playlist designed to soothe the mind and reduce feelings of stress and anxiety.',
      link: 'Calm Music for Stress Relief',
      type: ResourceTypeEnum.Music,
      keywords: ['music', 'stress relief', 'anxiety', 'calming', 'soothing'],
    },
    {
      title: 'Uplifting English Pop Songs',
      description: 'A playlist of feel-good pop music to boost your mood and energy.',
      link: 'uplifting pop songs',
      type: ResourceTypeEnum.Music,
      keywords: ['music', 'english', 'pop', 'happy', 'uplifting', 'feel good', 'motivation'],
    },
    {
      title: 'Calm Bollywood Melodies',
      description: 'A collection of gentle and soothing Bollywood songs perfect for unwinding.',
      link: 'calm bollywood songs',
      type: ResourceTypeEnum.Music,
      keywords: ['music', 'indian', 'bollywood', 'hindi', 'calming', 'soothing', 'sad', 'relax'],
    },

    // === Books ===
    {
      title: 'The Gifts of Imperfection by Brené Brown',
      description: 'Learn to embrace your imperfections and live a wholehearted life. A guide to courage, compassion, and connection.',
      link: 'The Gifts of Imperfection by Brené Brown',
      type: ResourceTypeEnum.Book,
      keywords: ['book', 'self-compassion', 'courage', 'shame', 'vulnerability', 'brené brown'],
    },
    {
      title: 'Atomic Habits by James Clear',
      description: 'An easy and proven way to build good habits and break bad ones. Learn how small changes can lead to remarkable results.',
      link: 'Atomic Habits by James Clear',
      type: ResourceTypeEnum.Book,
      keywords: ['book', 'self-improvement', 'productivity', 'motivation', 'james clear'],
    },
    {
      title: 'Man\'s Search for Meaning by Viktor Frankl',
      description: 'A classic book on finding meaning in suffering, based on the author\'s experience in Nazi concentration camps.',
      link: 'Man\'s Search for Meaning by Viktor Frankl',
      type: ResourceTypeEnum.Book,
      keywords: ['book', 'meaning', 'purpose', 'psychology', 'logotherapy', 'viktor frankl', 'suffering', 'resilience'],
    },
    {
      title: 'Mindset: The New Psychology of Success by Carol S. Dweck',
      description: 'Learn about the power of a growth mindset versus a fixed mindset and how it can impact all areas of your life.',
      link: 'Mindset: The New Psychology of Success by Carol S. Dweck',
      type: ResourceTypeEnum.Book,
      keywords: ['book', 'mindset', 'growth', 'psychology', 'success', 'carol dweck', 'learning'],
    },
    {
      title: 'The Subtle Art of Not Giving a F*ck by Mark Manson',
      description: 'A counterintuitive approach to living a good life, focusing on what truly matters.',
      link: 'The Subtle Art of Not Giving a F*ck by Mark Manson',
      type: ResourceTypeEnum.Book,
      keywords: ['book', 'happiness', 'values', 'self-help', 'mark manson'],
    },
    {
      title: 'Daring Greatly by Brené Brown',
      description: 'How the courage to be vulnerable transforms the way we live, love, parent, and lead.',
      link: 'Daring Greatly by Brené Brown',
      type: ResourceTypeEnum.Book,
      keywords: ['book', 'vulnerability', 'courage', 'shame', 'brené brown'],
    }
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
    return matchedResources.slice(0, 15);
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

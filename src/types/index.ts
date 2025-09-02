
export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  resources?: Resource[];
};

export type GenkitChatMessage = {
  role: 'user' | 'model';
  content: { text: string }[];
};

export type Language = 'en' | 'hi' | 'hinglish' | 'ta' | 'kn' | 'bn';

export type ResourceType = 'book' | 'video' | 'article' | 'podcast' | 'helpline' | 'music' | 'exercise' | 'app';

export type Resource = {
    title: string;
    description: string;
    link: string;
    type: ResourceType;
    keywords?: string[];
};

export type JournalEntry = {
    id: string;
    entry: string;
    timestamp: number;
    imageUrl?: string;
}

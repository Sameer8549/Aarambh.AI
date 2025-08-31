export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  recommendations?: BookRecommendation[];
  resources?: Resource[];
};

export type BookRecommendation = {
  title: string;
  author: string;
  summary: string;
  link: string;
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

export type CommunityEntry = {
    id: string;
    entry: string;
    timestamp: number;
}

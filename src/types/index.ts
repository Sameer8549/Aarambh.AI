export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  recommendations?: BookRecommendation[];
};

export type BookRecommendation = {
  title: string;
  author: string;
  summary: string;
  link: string;
};

export type Language = 'en' | 'hi' | 'hinglish' | 'ta' | 'kn' | 'bn';

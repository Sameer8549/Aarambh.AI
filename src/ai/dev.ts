
'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/calming-activity-encouragement.ts';
import '@/ai/flows/multilingual-chatbot.ts';
import '@/ai/flows/story-generation.ts';
import '@/ai/flows/chatbot-book-recommendations.ts';
import '@/ai/flows/image-generation.ts';

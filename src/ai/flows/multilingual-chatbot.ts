// This is a server-side file!
'use server';

/**
 * @fileOverview A multilingual chatbot flow that provides responses in the user's chosen Indian language.
 *
 * - chatbotRespondMultilingually - A function that handles the chatbot interaction and responds in the correct language.
 * - ChatbotInput - The input type for the chatbotRespondMultilingually function.
 * - ChatbotOutput - The return type for the chatbotRespondMultilingually function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatbotInputSchema = z.object({
  language: z.enum(['en', 'hi', 'hinglish', 'ta', 'kn', 'bn']).describe('The language code to respond in (en: English, hi: Hindi, hinglish: Hinglish, ta: Tamil, kn: Kannada, bn: Bengali).'),
  message: z.string().describe('The user message to respond to.'),
});
export type ChatbotInput = z.infer<typeof ChatbotInputSchema>;

const ChatbotOutputSchema = z.object({
  response: z.string().describe('The chatbot response in the specified language.'),
});
export type ChatbotOutput = z.infer<typeof ChatbotOutputSchema>;

export async function chatbotRespondMultilingually(input: ChatbotInput): Promise<ChatbotOutput> {
  return chatbotRespondMultilinguallyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatbotPrompt',
  input: {schema: ChatbotInputSchema},
  output: {schema: ChatbotOutputSchema},
  prompt: `You are a helpful and empathetic AI chatbot assisting users with wellness. Your primary goal is to provide clear, supportive, and easy-to-read advice.

Please respond to the user's message in the language they specify.

Your response must follow these formatting rules:
1.  **Do NOT use any markdown.** This means no asterisks for bolding or lists (e.g., no **text** or * item).
2.  Structure your response with clear, point-wise suggestions. Each suggestion should be a separate part.
3.  Start each point with a clear heading or title on its own line.
4.  Follow the heading with a short, easy-to-read explanation on a new line.
5.  Use a newline character to separate each complete point (heading and explanation) for better readability.
6.  Keep the tone empathetic and professional.

Example of a good response format:

Acknowledge Your Feelings
It's completely valid to feel that way. Recognizing and naming your feelings is a great first step.

Try Deep Breathing
When you feel stressed, try a simple breathing exercise. Inhale slowly for four counts, hold for seven, and exhale for eight.

Focus on the Present
Use your senses to ground yourself. Name five things you can see, four you can touch, and three you can hear.

Language: {{language}}
Message: {{{message}}}

Response:`,
});

const chatbotRespondMultilinguallyFlow = ai.defineFlow(
  {
    name: 'chatbotRespondMultilinguallyFlow',
    inputSchema: ChatbotInputSchema,
    outputSchema: ChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

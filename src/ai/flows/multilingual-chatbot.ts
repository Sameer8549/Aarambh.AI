// This is a server-side file!
'use server';

/**
 * @fileOverview A multilingual chatbot flow that provides responses in the user's chosen language.
 *
 * - chatbotRespondMultilingually - A function that handles the chatbot interaction and responds in the correct language.
 * - ChatbotInput - The input type for the chatbotRespondMultilingually function.
 * - ChatbotOutput - The return type for the chatbotRespondMultilingually function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {getWellnessResources, ResourceTypeEnum} from '@/ai/resources';

const findResourcesTool = ai.defineTool(
  {
    name: 'findResources',
    description: 'Finds relevant resources (articles, videos, etc.) for the user based on a query.',
    inputSchema: z.object({
      query: z.string().describe('A search query describing the type of resource needed (e.g., "video for anxiety", "article on stress").'),
      resourceType: z.enum(['book', 'video', 'article', 'podcast', 'helpline', 'music']).optional().describe('The specific type of resource to find.'),
    }),
    outputSchema: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
        link: z.string(),
        type: z.enum(['book', 'video', 'article', 'podcast', 'helpline', 'music']),
      })
    ),
  },
  async ({query, resourceType}) => {
    return getWellnessResources(query, resourceType as ResourceTypeEnum);
  }
);


const ChatbotInputSchema = z.object({
  language: z.enum(['en', 'hi', 'hinglish', 'ta', 'kn', 'bn']).describe('The language code to respond in (en: English, hi: Hindi, hinglish: Hinglish, ta: Tamil, kn: Kannada, bn: Bengali).'),
  message: z.string().describe('The user message to respond to.'),
  conversationHistory: z.string().describe('The history of the conversation with the user.'),
});
export type ChatbotInput = z.infer<typeof ChatbotInputSchema>;

const ChatbotOutputSchema = z.object({
  response: z.string().describe('The chatbot response in the specified language.'),
  resources: z.array(
    z.object({
      title: z.string().describe('The title of the resource.'),
      description: z.string().describe('A brief, one-sentence summary of the resource.'),
      link: z.string().describe('A direct and valid link to the resource. **It is critical that you only provide valid, working links from verified sources. Do not make up links.**'),
      type: z.enum(['book', 'video', 'article', 'podcast', 'helpline', 'music']).describe('The type of resource.'),
    })
  ).optional().describe('A list of helpful resources like well-known books, popular and verified YouTube videos, or articles from reputable sources. **It is critical that you only provide valid, working links from verified sources. Do not make up links.**'),
});
export type ChatbotOutput = z.infer<typeof ChatbotOutputSchema>;

export async function chatbotRespondMultilingually(input: ChatbotInput): Promise<ChatbotOutput> {
  return chatbotRespondMultilinguallyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatbotPrompt',
  input: {schema: ChatbotInputSchema},
  output: {schema: ChatbotOutputSchema},
  tools: [findResourcesTool],
  prompt: `You are Aarambh.AI, a helpful and empathetic AI wellness coach for young people. Your goal is to provide detailed, practical, and youth-friendly guidance.

Your response should be empathetic, supportive, and provide practical advice.

- Use simple, clear, and empathetic language. No jargon.
- The response must be tailored to the user's message, providing specific, detailed advice and insights.
- If the user's message indicates a need for deeper help, you MUST use the findResources tool to find helpful resources like well-known books, popular and verified videos, or articles from reputable sources. **Do not make up links or resources. Only use the tool provided.**

**Your Task:**
Respond to the user's message below. Provide a helpful and empathetic response. If relevant, use the findResources tool to provide a list of helpful resources. The response must be in the specified language.

Language: {{language}}
Conversation History: {{{conversationHistory}}}
Message: {{{message}}}
`,
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

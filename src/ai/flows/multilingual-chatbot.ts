
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
    description: 'Finds relevant resources (articles, videos, exercises, apps, etc.) for the user based on a query.',
    inputSchema: z.object({
      query: z.string().describe('A search query describing the type of resource needed (e.g., "video for anxiety", "article on stress", "exercise for energy").'),
      resourceType: z.string().optional().describe('The specific type of resource to find.'),
    }),
    outputSchema: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
        link: z.string(),
        type: z.nativeEnum(ResourceTypeEnum),
      })
    ),
  },
  async ({query, resourceType}) => {
    return getWellnessResources(query, resourceType ? (resourceType as ResourceTypeEnum) : undefined);
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
      link: z.string().describe('A direct and valid link to the resource. For YouTube videos, create a precise search query based on the user\'s feelings (e.g., "guided meditation for anxiety and overthinking"). **It is critical that you only provide valid, working links from verified sources. Do not make up links.**'),
      type: z.enum(['book', 'video', 'article', 'podcast', 'helpline', 'music', 'exercise', 'app']).describe('The type of resource.'),
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
  prompt: `You are Aarambh.AI, a helpful and empathetic AI wellness coach for young people. Your goal is to provide detailed, practical, and youth-friendly guidance. Your responses should be structured like expert advice from a wellness coach, providing a comprehensive and supportive answer.

Your response MUST follow this structure:
1.  **Acknowledge and Validate**: Start by acknowledging the user's feelings with empathy. (e.g., "It sounds like you're going through a lot, and it's completely understandable to feel that way.")
2.  **Provide Insight (Psychoeducation)**: Give a simple, relatable explanation for why they might be feeling this way. (e.g., "When we face a lot of pressure, our minds can feel overwhelmed, making it hard to focus.")
3.  **Offer Actionable Advice**: Provide a clear, bulleted or numbered list of 2-3 small, manageable steps the user can take right now. These should be practical and easy to implement. (e.g., "Here are a few things you could try: 1. The 5-4-3-2-1 grounding technique... 2. Take a 10-minute walk...")
4.  **Recommend Resources (If Needed)**: If the user's message indicates a need for deeper help (e.g., they mention "anxiety", "stress", "depression", "feeling low", "exercise", "workout", "sad", "lonely"), you MUST use the findResources tool to find helpful resources. Create a search query for the tool based on the user's message to find the most relevant resources.
5.  **Important Disclaimer**: You MUST end your response by reminding the user that you are an AI and not a substitute for a real doctor.

Key instructions:
- Use simple, clear, and empathetic language. No jargon.
- Do not use markdown formatting like asterisks for bolding. Use plain text.
- The response must be tailored to the user's message.
- For video resources, create a highly specific and accurate YouTube search query in the 'link' field based on the user's feelings.
- **CRITICAL**: Never provide medical advice, diagnosis, or prescribe medicine. If the user asks about medication, use the findResources tool to find articles from trusted sources like the WHO or NIMH that provide general information, and always, always recommend they speak to a doctor for medical advice.

Your Task:
Respond to the user's message below. Provide a comprehensive, structured, and empathetic response. If relevant, use the findResources tool to provide a list of helpful resources. The response must be in the specified language.

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

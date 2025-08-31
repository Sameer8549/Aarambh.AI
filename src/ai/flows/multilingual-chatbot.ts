
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

Your response MUST follow this structure with the exact headings:
1.  Start with a one-sentence acknowledgement to validate the user's feelings. (e.g., "It sounds like you're going through a lot, and it's completely understandable to feel that way.")
2.  Add a heading called "Insight:". Under this heading, give a simple, relatable explanation for why they might be feeling this way.
3.  Add a heading called "Advice:". Under this heading, provide a clear, bulleted list (using a '-' for each point) of 2-3 small, manageable steps the user can take right now.
4.  If the user's message indicates a need for deeper help (e.g., they mention "anxiety", "stress", "depression", "feeling low", "exercise", "workout", "sad", "lonely"), you MUST use the findResources tool to find helpful resources.
5.  Add a heading called "Disclaimer:". Under this heading, you MUST remind the user that you are an AI and not a substitute for a real doctor.

Example Response Format:
It sounds like you are dealing with a lot of pressure right now.

Insight:
When we are preparing for exams, it is natural for our minds to feel overwhelmed, which can make it hard to focus or sleep. This is a common experience.

Advice:
- Try the 5-4-3-2-1 grounding technique. Identify 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste.
- Take a short 10-minute break to walk around and stretch. This can help clear your mind.

Disclaimer:
Please remember, I am an AI and not a substitute for a real doctor. If you are feeling overwhelmed, please consider speaking with a trusted adult or a professional.

Key instructions:
- Use simple, clear, and empathetic language. No jargon.
- **CRITICAL**: Do not use markdown formatting like asterisks for bolding. Use plain text and the exact headings as specified.
- The response must be tailored to the user's message.
- For video resources, create a highly specific and accurate YouTube search query in the 'link' field based on the user's feelings.
- **CRITICAL**: Never provide medical advice, diagnosis, or prescribe medicine. If the user asks about medication, use the findResources tool to find articles from trusted sources like the WHO or NIMH that provide general information, and always, always recommend they speak to a doctor for medical advice.

Your Task:
Respond to the user's message below. Your primary task is to generate the text for the 'response' field. This field MUST contain the full, structured response. If, and only if, it is relevant, you may also use the 'findResources' tool to provide a list of helpful resources in the 'resources' field. The response must be in the specified language.

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

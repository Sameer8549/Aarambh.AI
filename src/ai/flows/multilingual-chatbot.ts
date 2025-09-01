
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
import {provideBookRecommendations} from '@/ai/flows/chatbot-book-recommendations';
import {ToolRequest, tool} from 'genkit/ai';

const findResourcesTool = ai.defineTool(
  {
    name: 'findResources',
    description: 'Finds relevant resources (articles, videos, exercises, apps, etc.) for the user based on a query. You MUST use this tool if the user is in crisis or asks for help.',
    inputSchema: z.object({
      query: z.string().describe('A search query describing the type of resource needed (e.g., "video for anxiety", "article on stress", "exercise for energy", "helpline for crisis in India").'),
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

const bookRecommendationTool = ai.defineTool(
  {
    name: 'provideBookRecommendations',
    description: 'Provides book recommendations if the user is looking for books to read.',
    inputSchema: z.object({
      conversationHistory: z.string().describe('The history of the conversation with the user.'),
    }),
    outputSchema: z.array(
      z.object({
        title: z.string().describe('The title of the book.'),
        author: z.string().describe('The author of the book.'),
        summary: z.string().describe('A brief summary of the book.'),
        link: z.string().describe('A Google search link to find the book for purchase or information. The link should be a valid URL.'),
      })
    ),
  },
  async ({conversationHistory}) => {
    const result = await provideBookRecommendations({conversationHistory});
    return result.recommendations;
  }
);


const ChatbotInputSchema = z.object({
  language: z.enum(['en', 'hi', 'hinglish', 'ta', 'kn', 'bn']).describe('The language code to respond in (en: English, hi: Hindi, hinglish: Hinglish, ta: Tamil, kn: Kannada, bn: Bengali).'),
  message: z.string().describe('The user message to respond to.'),
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.array(z.object({
        text: z.string()
    }))
  })).describe('The history of the conversation with the user.'),
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

const prompt = `You are Aarambh.AI, a helpful and empathetic AI wellness coach for young people. Your goal is to provide detailed, practical, and youth-friendly guidance. Your responses should be structured like expert advice from a wellness coach, providing a comprehensive and supportive answer.

CRITICAL SAFETY PROTOCOL:
If the user's message contains any indication of self-harm, suicide, or severe crisis (e.g., "I want to die", "kill myself", "end my life"), you MUST follow these steps and ONLY these steps:
1.  Your response MUST be a single, short, empathetic sentence. Example: "It sounds like you're going through a lot, and it's really important to talk to someone who can support you right now." DO NOT offer any advice, insights, or steps.
2.  You MUST immediately use the 'findResources' tool. The query for the tool MUST be "helpline for crisis in India".
3.  You MUST NOT generate any other text in the 'response' field besides the single sentence. Do not include headings like "Insight:", "Advice:", or "Disclaimer:".

For all other conversations, your response MUST follow this structure with the exact headings:
1.  Start with a one-sentence acknowledgement to validate the user's feelings. (e.g., "It sounds like you're going through a lot, and it's completely understandable to feel that way.")
2.  Add a heading called "Insight:". Under this heading, give a simple, yet comprehensive, relatable explanation for why they might be feeling this way. Provide some context to their feelings. Be detailed and insightful.
3.  Add a heading called "Advice:". Under this heading, provide a clear, bulleted list (using a '-' for each point) of 2-3 small, manageable steps the user can take right now. The advice should be practical, actionable and detailed.
4.  If the user's message indicates a need for deeper help (e.g., they mention "anxiety", "stress", "depression", "feeling low", "exercise", "workout", "sad", "lonely"), you MUST use the findResources tool to find helpful resources.
5. If the user asks for book recommendations, you MUST use the 'provideBookRecommendations' tool.
6.  Add a heading called "Disclaimer:". Under this heading, you MUST remind the user that you are an AI and not a substitute for a real doctor.

Example Non-Crisis Response Format:
It sounds like you are dealing with a lot of pressure right now.

Insight:
When we are preparing for exams, it is natural for our minds to feel overwhelmed, which can make it hard to focus or sleep. This is a common experience as our brain is trying to process a lot of information, and the stress can trigger a 'fight-or-flight' response, making us feel restless. This can manifest as a racing heart, difficulty concentrating, or a feeling of unease.

Advice:
- Try the 5-4-3-2-1 grounding technique. This powerful mindfulness exercise helps pull your focus away from the source of stress and back to the present moment. Identify 5 things you can see, 4 things you can physically touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste.
- Take a short 10-minute break to walk around and stretch. Physical movement helps release the buildup of stress hormones like cortisol and adrenaline. Even a brief walk can signal to your nervous system that it's safe to relax.
- Listen to some calming music or nature sounds for a few minutes. Music has a direct effect on our mood and can help lower our heart rate and blood pressure, reducing feelings of stress.

Disclaimer:
Please remember, I am an AI and not a substitute for a real doctor. If you are feeling overwhelmed, please consider speaking with a trusted adult or a professional.

Key instructions:
- Use simple, clear, and empathetic language. No jargon.
- **CRITICAL**: Do not use markdown formatting like asterisks for bolding. Use plain text and the exact headings as specified.
- The response must be tailored to the user's message.
- For video resources, create a highly specific and accurate YouTube search query in the 'link' field based on the user's feelings.
- **CRITICAL**: Never provide medical advice, diagnosis, or prescribe medicine. If the user asks about medication, use the findResources tool to find articles from trusted sources like the WHO or NIMH that provide general information, and always, always recommend they speak to a doctor for medical advice.
`

const chatbotRespondMultilinguallyFlow = ai.defineFlow(
  {
    name: 'chatbotRespondMultilinguallyFlow',
    inputSchema: ChatbotInputSchema,
    outputSchema: ChatbotOutputSchema,
  },
  async (input) => {
    const { language, message, conversationHistory } = input;
    const history = conversationHistory || [];
    
    const tools = [findResourcesTool, bookRecommendationTool];
    const model = ai.getmodel('gemini-1.5-flash');

    const fullPrompt = `${prompt}\n\nYour Task:\nRespond to the user's message below. Your primary task is to generate the text for the 'response' field. This field MUST contain the full, structured, and detailed response. If, and only if, it is relevant, you may also use the 'findResources' or 'provideBookRecommendations' tools to provide a list of helpful resources in the 'resources' field. The response must be in the specified language.\n\nLanguage: ${language}\nMessage: ${message}`;
    
    const { response } = await ai.generate({
        model,
        tools,
        prompt: fullPrompt,
        history,
        output: {
            schema: ChatbotOutputSchema,
        },
        config: {
            safetySettings: [
                {
                    category: 'HARM_CATEGORY_HATE_SPEECH',
                    threshold: 'BLOCK_ONLY_HIGH',
                },
                {
                    category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                    threshold: 'BLOCK_ONLY_HIGH',
                },
                {
                    category: 'HARM_CATEGORY_HARASSMENT',
                    threshold: 'BLOCK_ONLY_HIGH',
                },
                {
                    category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                    threshold: 'BLOCK_ONLY_HIGH',
                },
            ]
        }
    });

    const output = response.output();
    if (!output) {
      throw new Error('The AI model failed to produce a valid response.');
    }
    
    return output;
  }
);

    
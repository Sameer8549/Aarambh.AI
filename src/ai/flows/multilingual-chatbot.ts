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
2.  Structure your response into distinct sections based on the user's needs. Use clear headings with relevant emojis.
3.  Each section should contain related advice as separate, easy-to-read bullet points. Use the '•' character for bullet points.
4.  Each point should be a short, actionable piece of advice.
5.  Use newline characters to separate sections and points for better readability.
6.  Keep the tone empathetic and professional.

Example of a good response format:

🌬 Quick reset for your body
	•	Take a slow deep breath in for 4 seconds, hold for 2, then exhale for 6. Repeat 4–5 times.
	•	If you can, stretch your shoulders and neck — tension hides there.

🧠 Quick reset for your mind
	•	Write down the top 3 things bothering you. Often stress feels bigger when it’s all tangled in our head.
	•	Tell yourself: “I don’t need to solve everything at once. One step is enough.”

💡 Small grounding trick (if your thoughts are racing)
	•	Look around and name 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste.

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

'use server';

/**
 * @fileOverview A flow to provide relevant book recommendations with summaries and direct links based on the conversation.
 *
 * - provideBookRecommendations - A function that handles the book recommendation process.
 * - BookRecommendationInput - The input type for the provideBookRecommendations function.
 * - BookRecommendationOutput - The return type for the provideBookRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BookRecommendationInputSchema = z.object({
  conversationHistory: z
    .string()
    .describe('The history of the conversation with the user.'),
});
export type BookRecommendationInput = z.infer<typeof BookRecommendationInputSchema>;

const BookRecommendationOutputSchema = z.object({
  recommendations: z.array(
    z.object({
      title: z.string().describe('The title of the book.'),
      author: z.string().describe('The author of the book.'),
      summary: z.string().describe('A brief summary of the book.'),
      link: z.string().describe('A direct link to purchase the book. Do not make up links.'),
    })
  ).describe('A list of book recommendations based on the conversation history.'),
});
export type BookRecommendationOutput = z.infer<typeof BookRecommendationOutputSchema>;

export async function provideBookRecommendations(input: BookRecommendationInput): Promise<BookRecommendationOutput> {
  return provideBookRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'bookRecommendationPrompt',
  input: {schema: BookRecommendationInputSchema},
  output: {schema: BookRecommendationOutputSchema},
  prompt: `Based on the following conversation history, recommend books that might be helpful to the user. Provide a summary of each book and a direct link to purchase it.

Conversation History: {{{conversationHistory}}}

Ensure the recommendations are relevant to the topics discussed and can provide further assistance or insights. **It is critical that you only provide valid, working links. Do not make up links.**
`,
});

const provideBookRecommendationsFlow = ai.defineFlow(
  {
    name: 'provideBookRecommendationsFlow',
    inputSchema: BookRecommendationInputSchema,
    outputSchema: BookRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

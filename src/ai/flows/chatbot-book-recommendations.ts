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
      link: z.string().describe('A Google search link to find the book for purchase or information. The link should be a valid URL.'),
    })
  ).describe('A list of book recommendations by Indian authors based on the conversation history.'),
});
export type BookRecommendationOutput = z.infer<typeof BookRecommendationOutputSchema>;

export async function provideBookRecommendations(input: BookRecommendationInput): Promise<BookRecommendationOutput> {
  return provideBookRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'bookRecommendationPrompt',
  input: {schema: BookRecommendationInputSchema},
  output: {schema: BookRecommendationOutputSchema},
  prompt: `Based on the following conversation history, recommend books by Indian authors that might be helpful to the user. Provide a summary of each book and a Google search link to find it.

Conversation History: {{{conversationHistory}}}

For the 'link' field, you must generate a Google search URL in the format: 'https://www.google.com/search?q=TITLE+AUTHOR'

Ensure the recommendations are relevant to the topics discussed and can provide further assistance or insights.
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

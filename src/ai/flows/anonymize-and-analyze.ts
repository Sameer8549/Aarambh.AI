
'use server';
/**
 * @fileOverview An AI agent that analyzes journal entries to extract anonymized,
 * aggregated insights for the Social Impact Dashboard.
 *
 * - anonymizeAndAnalyze - A function that analyzes text for sentiment and topics.
 * - AnonymizeAndAnalyzeInput - The input type for the function.
 * - AnonymizeAndAnalyzeOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnonymizeAndAnalyzeInputSchema = z.object({
  text: z.string().describe('The journal entry text to be analyzed.'),
});
export type AnonymizeAndAnalyzeInput = z.infer<typeof AnonymizeAndAnalyzeInputSchema>;

const AnonymizeAndAnalyzeOutputSchema = z.object({
  sentiment: z.enum(['Positive', 'Neutral', 'Negative']).describe('The overall sentiment of the text.'),
  topics: z.array(z.string()).describe('A list of general, non-personally-identifiable topics discussed in the text (e.g., "Exams", "Family", "Gratitude", "Loneliness").'),
});
export type AnonymizeAndAnalyzeOutput = z.infer<typeof AnonymizeAndAnalyzeOutputSchema>;

export async function anonymizeAndAnalyze(input: AnonymizeAndAnalyzeInput): Promise<AnonymizeAndAnalyzeOutput> {
  return anonymizeAndAnalyzeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'anonymizeAndAnalyzePrompt',
  input: {schema: AnonymizeAndAnalyzeInputSchema},
  output: {schema: AnonymizeAndAnalyzeOutputSchema},
  prompt: `You are a data analysis AI for a mental wellness app. Your task is to analyze the following journal entry.

  CRITICAL INSTRUCTIONS:
  1.  Determine the overall sentiment of the text. It must be one of: 'Positive', 'Neutral', or 'Negative'.
  2.  Identify a few general topics or themes. Topics MUST be high-level and anonymous.
  3.  DO NOT extract any personally identifiable information (PII) like names, places, or specific events.
  4.  Focus on broad categories relevant to youth wellness, such as: Exams, Family, Relationships, Future, Loneliness, Gratitude, Stress, Confidence, Sleep.
  5.  If no clear topics are identifiable, return an empty array for the topics field.

  Journal Entry:
  {{{text}}}
  `,
});

const anonymizeAndAnalyzeFlow = ai.defineFlow(
  {
    name: 'anonymizeAndAnalyzeFlow',
    inputSchema: AnonymizeAndAnalyzeInputSchema,
    outputSchema: AnonymizeAndAnalyzeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

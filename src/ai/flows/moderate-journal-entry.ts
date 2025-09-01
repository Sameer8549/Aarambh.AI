
'use server';
/**
 * @fileOverview A Genkit flow for moderating journal entries to ensure they are safe and positive.
 *
 * - moderateJournalEntry - A function that handles the moderation process.
 * - ModerationInput - The input type for the moderateJournalEntry function.
 * - ModerationOutput - The return type for the moderateJournalEntry function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Define Zod schemas for input and output
const ModerationInputSchema = z.object({
  entry: z.string().describe('The journal entry to be moderated.'),
});
export type ModerationInput = z.infer<typeof ModerationInputSchema>;

const ModerationOutputSchema = z.object({
  isApproved: z.boolean().describe('Whether the entry is approved and safe to display publicly.'),
  reason: z.string().optional().describe('The reason for rejection if the entry is not approved.'),
});
export type ModerationOutput = z.infer<typeof ModerationOutputSchema>;

export async function moderateJournalEntry(input: ModerationInput): Promise<ModerationOutput> {
  return moderateJournalEntryFlow(input);
}

const moderationPrompt = ai.definePrompt({
  name: 'moderationPrompt',
  input: { schema: ModerationInputSchema },
  output: { schema: ModerationOutputSchema },
  prompt: `You are an AI moderator for a youth wellness app. Your task is to review an anonymous journal entry to ensure it is safe for a public community feed.

  The entry MUST be rejected if it contains any of the following:
  - Personally Identifiable Information (PII) such as names, addresses, phone numbers, or emails.
  - Harmful content, including self-harm, violence, hate speech, or explicit language.
  - Off-topic content that is not related to wellness, gratitude, or positive reflection.
  - Gibberish or spam.

  Review the entry below and decide if it should be approved. If you reject it, provide a brief, general reason.

  Journal Entry: {{{entry}}}
  `,
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

const moderateJournalEntryFlow = ai.defineFlow(
  {
    name: 'moderateJournalEntryFlow',
    inputSchema: ModerationInputSchema,
    outputSchema: ModerationOutputSchema,
  },
  async (input) => {
    // Do not moderate empty entries.
    if (!input.entry.trim()) {
      return { isApproved: false, reason: 'Entry was empty.' };
    }
    const { output } = await moderationPrompt(input);
    return output!;
  }
);

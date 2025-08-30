'use server';
/**
 * @fileOverview An AI agent that provides encouragement after a calming activity.
 *
 * - calmingActivityEncouragement - A function that handles the encouragement process.
 * - CalmingActivityEncouragementInput - The input type for the calmingActivityEncouragement function.
 * - CalmingActivityEncouragementOutput - The return type for the calmingActivityEncouragement function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CalmingActivityEncouragementInputSchema = z.object({
  activityType: z
    .string()
    .describe('The type of calming activity completed (e.g., music, breathing, journaling).'),
  duration: z
    .number()
    .optional()
    .describe('The duration of the activity in minutes, if applicable.'),
});
export type CalmingActivityEncouragementInput = z.infer<typeof CalmingActivityEncouragementInputSchema>;

const CalmingActivityEncouragementOutputSchema = z.object({
  encouragementMessage: z.string().describe('A personalized encouragement message from the AI.'),
});
export type CalmingActivityEncouragementOutput = z.infer<typeof CalmingActivityEncouragementOutputSchema>;

export async function calmingActivityEncouragement(input: CalmingActivityEncouragementInput): Promise<CalmingActivityEncouragementOutput> {
  return calmingActivityEncouragementFlow(input);
}

const prompt = ai.definePrompt({
  name: 'calmingActivityEncouragementPrompt',
  input: {schema: CalmingActivityEncouragementInputSchema},
  output: {schema: CalmingActivityEncouragementOutputSchema},
  prompt: `You are a supportive AI companion designed to encourage users after they complete a calming activity.

  Based on the activity type ({{{activityType}}}) and duration ({{{duration}}} minutes), generate a short, personalized message to acknowledge their effort and motivate them to continue their wellness journey.

  The message should be positive, empathetic, and user-friendly.
  If the duration is not available do not mention it in the encouragement message.
  Keep the message short and to one or two sentences.
  
  Example messages:

  If the user completed 5 minutes of music:
  "That's great that you listened to music for 5 minutes! Keep up the great work and remember to prioritize self care."

  If the user completed breathing exercises:
  "Great job with the breathing exercises! Taking time for yourself is a fantastic way to reduce stress."

  If the user completed gratitude journaling:
  "Wonderful, journaling is a great tool for mental well-being! Acknowledging the positives in your life will make you happier."

  Provide your encouragement message here:
  `,
});

const calmingActivityEncouragementFlow = ai.defineFlow(
  {
    name: 'calmingActivityEncouragementFlow',
    inputSchema: CalmingActivityEncouragementInputSchema,
    outputSchema: CalmingActivityEncouragementOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

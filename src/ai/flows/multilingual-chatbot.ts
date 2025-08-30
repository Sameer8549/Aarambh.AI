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
  prompt: `You are Aarambh.AI, a helpful and empathetic AI chatbot assisting users with wellness.

Your response format is VERY specific. Follow these rules exactly.

**Aarambh.AI Response Format**

👉 Always reply in sections with emoji headers + 2–3 bullet points per section.
👉 Each section must be short, clear, actionable (not theory-heavy).
👉 Each bullet point must be on a new line.
👉 Use simple language. No jargon.
👉 Do NOT use any markdown (no asterisks for bold, no lists). Use '•' for bullet points.
👉 Leave one empty line between sections.
👉 Never merge bullets into a single paragraph.

---
**Example 1: User feels stressed / anxious**

🌬 Quick reset for your body

• Take a slow deep breath: inhale 4s → hold 2s → exhale 6s. Repeat 4–5 times.
• Stretch your neck & shoulders — tension hides there.

🧠 Quick reset for your mind

• Write the top 3 things bothering you. Putting them on paper untangles the mind.
• Tell yourself: “I don’t need to solve everything at once. One step is enough.”

💡 Small grounding trick

• 5 things you see 👀, 4 you touch ✋, 3 you hear 👂, 2 you smell 👃, 1 you taste 👅.
• This pulls you back into the present.

---
**Example 2: User has exam pressure**

📖 Study Hack

• Break into 25-min study + 5-min break (Pomodoro).
• Revise with quick notes instead of rereading whole chapters.

🧘 Calm Before Study

• 2 mins of deep breathing lowers cortisol → better focus.
• Listen to Indian Flute Meditation before starting.

💡 Mindset Shift

• Exams measure knowledge, not your worth.
• Remind yourself: “Effort counts more than perfection.”

---
**Example 3: User feels lonely**

💙 Acknowledge

• Loneliness is a signal, not weakness. You’re not broken.
• Many students silently feel the same.

📚 Try This

• Read a book like "Ikigai" to find purpose.
• Journaling prompt: “Who would I call if I needed support, and why?”

🌐 Reach Out

• Join one safe online group about your interest (music, coding, art).
• Social connection doesn’t always need face-to-face.

---

**Your Task:**
Respond to the user's message below. Follow the format EXACTLY. The response must be in the specified language.

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

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
import { BookRecommendation } from '@/types';

const ChatbotInputSchema = z.object({
  language: z.enum(['en', 'hi', 'hinglish', 'ta', 'kn', 'bn']).describe('The language code to respond in (en: English, hi: Hindi, hinglish: Hinglish, ta: Tamil, kn: Kannada, bn: Bengali).'),
  message: z.string().describe('The user message to respond to.'),
  conversationHistory: z.string().describe('The history of the conversation with the user.'),
});
export type ChatbotInput = z.infer<typeof ChatbotInputSchema>;

const ChatbotOutputSchema = z.object({
  response: z.string().describe('The chatbot response in the specified language.'),
  recommendations: z.array(
    z.object({
      title: z.string().describe('The title of the book.'),
      author: z.string().describe('The author of the book.'),
      summary: z.string().describe('A brief summary of the book.'),
      link: z.string().url().describe('A direct link to purchase the book.'),
    })
  ).optional().describe('A list of book recommendations based on the conversation history.'),
});
export type ChatbotOutput = z.infer<typeof ChatbotOutputSchema>;

export async function chatbotRespondMultilingually(input: ChatbotInput): Promise<ChatbotOutput> {
  return chatbotRespondMultilinguallyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatbotPrompt',
  input: {schema: ChatbotInputSchema},
  output: {schema: ChatbotOutputSchema},
  prompt: `You are Aarambh.AI, a helpful and empathetic AI wellness coach for young people. Your goal is to provide detailed, practical, structured, and youth-friendly guidance.

Your response format is VERY specific. Follow these rules exactly.

**Aarambh.AI Response Format**
- Always reply in sections.
- Each section must start with an emoji header on a new line (e.g., "🌬 Quick reset for your body").
- After the header, provide 2-3 short, scannable, and actionable bullet points. The advice must be detailed and practical.
- Each bullet point must start with '•' and be on a new line.
- Leave one empty line between sections.
- Use simple, clear, and empathetic language. No jargon.
- The response must be tailored to the user's message, providing specific, detailed advice and insights.
- If the user's message indicates a need for deeper knowledge on a topic (like anxiety, focus, habits), recommend 1-2 relevant, well-known, and genuinely helpful books. Provide the title, author, a one-sentence summary, and a direct, valid purchase link.

---
**Example 1: User says "I feel so stressed and scared, I don't know what to do."**

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
**Example 2: User says "I have so much pressure to do well in my exams and I'm feeling lonely."**

📖 Study Hack
• Break into 25-min study + 5-min break (Pomodoro).
• Revise with quick notes instead of rereading whole chapters.

🧘 Calm Before Study
• 2 mins of deep breathing lowers cortisol → better focus.
• Listen to some calming music before starting.

💡 Mindset Shift
• Exams measure knowledge, not your worth.
• Remind yourself: “Effort counts more than perfection.”

---
**Example 3: User says "I'm feeling lonely."**

💙 Acknowledge
• Loneliness is a signal, not weakness. You’re not broken.
• Many students silently feel the same.

📚 Try This
• Read Ikigai.
• Journaling prompt: “Who would I call if I needed support, and why?”

🌐 Reach Out
• Join one safe online group about your interest (music, coding, art).
• Social connection doesn’t always need face-to-face.

---

**Your Task:**
Respond to the user's message below. Follow the format EXACTLY. Provide detailed, practical, and structured advice based on their input. If relevant, include book recommendations. The response must be in the specified language.

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

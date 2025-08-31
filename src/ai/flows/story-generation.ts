
'use server';
/**
 * @fileOverview A Genkit flow for generating personalized audio stories using text generation and TTS.
 *
 * - generateStory - A function that handles the story generation and audio conversion process.
 * - StoryGenerationInput - The input type for the generateStory function.
 * - StoryGenerationOutput - The return type for the generateStory function.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'genkit';
import wav from 'wav';

// Define Zod schemas for input and output
const StoryGenerationInputSchema = z.object({
  prompt: z.string().describe('A user-provided prompt describing the desired story (e.g., feelings, characters, setting).'),
  language: z.enum(['en', 'hi', 'hinglish', 'ta', 'kn', 'bn']).describe('The language for the story.'),
});
export type StoryGenerationInput = z.infer<typeof StoryGenerationInputSchema>;

const StoryGenerationOutputSchema = z.object({
  audioUrl: z.string().describe('The data URI of the generated audio story in WAV format.'),
});
export type StoryGenerationOutput = z.infer<typeof StoryGenerationOutputSchema>;


const StoryScriptSchema = z.object({
    storyScript: z.string().describe("A short, calming story script based on the user's prompt. The story should have two speakers: a 'Narrator' and a 'Character'. Format the script with 'Narrator:' and 'Character:' labels on new lines. The story should be simple, positive, and suitable for a young audience.")
});

// Define the text generation prompt
const storyPrompt = ai.definePrompt({
    name: 'storyGeneratorPrompt',
    input: { schema: StoryGenerationInputSchema },
    output: { schema: StoryScriptSchema },
    prompt: `You are a creative and empathetic storyteller who writes calming, positive, and motivational stories for young people.
    
    Based on the user's prompt below, create a story with two speakers: a 'Narrator' and a 'Character'.
    The story should be directly related to the user's prompt, especially if it touches on themes like mental wellness (e.g., feeling sad, anxious, stressed), motivation, or challenges like exams.
    The story must be written in the specified language.
    The story should be at least 10-12 lines long, with multiple exchanges between the Narrator and the Character to make it engaging and uplifting.

    Format the output as a script, with each line starting with 'Narrator:' or 'Character:'.

    Example (if user is feeling nervous about exams):
    User Prompt: "A story to help me with exam stress."
    Output Script:
    Narrator: In a quiet library, a young student named Alex stared at a tall pile of books.
    Character: "There's so much to learn," Alex sighed, feeling a wave of worry. "How can I possibly remember it all?"
    Narrator: Just then, a friendly whisper seemed to dance from the pages of a book.
    Character: "Take a deep breath," it said softly. "You are more capable than you think. One page at a time is all it takes."
    Narrator: Alex took a breath and looked at the first page. The words seemed a little clearer.
    Character: "You're right," Alex whispered back. "I can do this. One step at a time."
    Narrator: With each page, Alex's confidence grew, turning worry into a quiet strength.
    Character: "I am prepared, and I will do my best."
    
    Language: {{{language}}}
    User Prompt: {{{prompt}}}
    `,
});


// Helper function to convert PCM audio data from Gemini to WAV format
async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', (d) => bufs.push(d));
    writer.on('end', () => resolve(Buffer.concat(bufs).toString('base64')));

    writer.write(pcmData);
    writer.end();
  });
}

const storyGenerationFlow = ai.defineFlow(
    {
      name: 'storyGenerationFlow',
      inputSchema: StoryGenerationInputSchema,
      outputSchema: StoryGenerationOutputSchema,
    },
    async (input) => {

      // 1. Generate the story script
      const scriptResponse = await storyPrompt({
        prompt: input.prompt,
        language: input.language
      });
      const storyScript = scriptResponse.output?.storyScript;

      if (!storyScript) {
        throw new Error('Failed to generate a story script.');
      }
      
      // 2. Convert the script to speech using the TTS model
      const { media } = await ai.generate({
        model: googleAI.model('gemini-2.5-flash-preview-tts'),
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            multiSpeakerVoiceConfig: {
              speakerVoiceConfigs: [
                {
                  speaker: 'Narrator',
                  voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Algenib' } },
                },
                {
                  speaker: 'Character',
                  voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Achernar' } },
                },
              ],
            },
          },
        },
        prompt: storyScript,
      });

      if (!media?.url) {
        throw new Error('TTS model did not return any audio media.');
      }

      // 3. Convert the raw PCM audio to a WAV data URI
      const audioBuffer = Buffer.from(media.url.substring(media.url.indexOf(',') + 1), 'base64');
      const wavBase64 = await toWav(audioBuffer);

      return {
        audioUrl: `data:audio/wav;base64,${wavBase64}`,
      };
    }
  );


// Main exported function that runs the flow
export async function generateStory(input: StoryGenerationInput): Promise<StoryGenerationOutput> {
  return storyGenerationFlow(input);
}

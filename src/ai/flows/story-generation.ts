
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
    prompt: `You are a creative storyteller who writes short, calming, and positive stories for young people.
    
    Based on the user's prompt below, create a simple story with two speakers: a 'Narrator' and a 'Character'.
    Keep the story brief, with only a few lines for each speaker.
    
    Format the output as a script, with each line starting with 'Narrator:' or 'Character:'.

    Example:
    User Prompt: "A story about a small boat on a calm sea."
    Output Script:
    Narrator: Once, there was a little boat floating on a big, calm sea.
    Character: "The water is so peaceful today," the little boat whispered to the gentle waves.
    Narrator: The sun warmed its wooden deck, and a soft breeze guided it along.
    Character: "I feel so safe and calm out here," it sighed happily.

    User Prompt: {{{prompt}}}
    `,
    config: {
        model: 'googleai/gemini-1.5-flash',
    }
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


// Main exported function that runs the flow
export async function generateStory(input: StoryGenerationInput): Promise<StoryGenerationOutput> {

  // Define the main flow
  const storyFlow = ai.defineFlow(
    {
      name: 'storyGenerationFlow',
      inputSchema: StoryGenerationInputSchema,
      outputSchema: StoryGenerationOutputSchema,
    },
    async ({ prompt }) => {

      // 1. Generate the story script
      const scriptResponse = await storyPrompt({ prompt });
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

  return await storyFlow(input);
}


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
import { generateImage } from './image-generation';

// Define Zod schemas for input and output
const StoryGenerationInputSchema = z.object({
  prompt: z.string().describe('A user-provided prompt describing the desired story (e.g., feelings, characters, setting).'),
  language: z.enum(['en', 'hi', 'hinglish', 'ta', 'kn', 'bn']).describe('The language for the story.'),
});
export type StoryGenerationInput = z.infer<typeof StoryGenerationInputSchema>;

const StoryGenerationOutputSchema = z.object({
  audioUrl: z.string().describe('The data URI of the generated audio story in WAV format.'),
  storyScript: z.string().describe('The full script of the generated story, including the introduction.'),
  imageUrl: z.string().describe('A data URI for a generated image related to the story.'),
});
export type StoryGenerationOutput = z.infer<typeof StoryGenerationOutputSchema>;


const StoryScriptSchema = z.object({
    storyScript: z.string().describe("A short, calming story script based on the user's prompt. The story should have two speakers: a 'Narrator' and a 'Character'. Format the script with 'Narrator:' and 'Character:' labels on new lines. The story should be simple, positive, and suitable for a young audience.")
});

// Define the text generation prompt
const storyPrompt = ai.definePrompt({
    name: 'storyGeneratorPrompt',
    input: { schema: z.object({
        prompt: StoryGenerationInputSchema.shape.prompt,
        language: StoryGenerationInputSchema.shape.language,
    }) },
    output: { schema: StoryScriptSchema },
    prompt: `You are a creative and empathetic storyteller who writes calming, positive, and motivational stories for young people.
    
    CRITICAL: The entire story script MUST be written in the specified language ({{{language}}}). This is the most important instruction.

    Based on the user's prompt below, create a story with two speakers: a 'Narrator' and a 'Character'.
    The story should be directly related to the user's prompt, especially if it touches on themes like mental wellness (e.g., feeling sad, anxious, stressed), motivation, or challenges like exams.
    The story should be at least 10-12 lines long, with multiple exchanges between the Narrator and the Character to make it engaging and uplifting.

    Format the output as a script, with each line starting with 'Narrator:' or 'Character:'.

    Example (if user is feeling nervous about exams and language is 'en'):
    User Prompt: "A story to help me with exam stress."
    Language: en
    Output Script (This output must be in the specified 'language'):
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

const getIntroduction = (language: z.infer<typeof StoryGenerationInputSchema>['language']): string => {
  const intros: Record<typeof language, string> = {
    en: "Hello, I am Aarambh.AI. 'Aarambh' means 'a new beginning'. I have listened to you. I will now tell you a story to help you feel more confident and overcome your challenges.",
    hi: "नमस्ते, मैं आरंभ.AI हूँ। 'आरंभ' का मतलब है 'एक नई शुरुआत'। मैंने आपकी बात सुनी है। अब मैं आपको अधिक आत्मविश्वासी महसूस कराने और आपकी चुनौतियों से उबरने में मदद करने के लिए एक कहानी सुनाऊंगा।",
    hinglish: "Hello, main Aarambh.AI hoon. 'Aarambh' ka matlab hai 'ek nayi shuruaat'. Maine aapki baat suni hai. Ab main aapko ek kahani sunaunga jo aapko confident feel karne aur aapki challenges ko paar karne mein madad karegi.",
    ta: "வணக்கம், நான் ஆரம்ப்.AI. 'ஆரம்ப்' என்றால் 'ஒரு புதிய ஆரம்பம்'. நான் உங்கள் பேச்சைக் கேட்டேன்। இப்போது நீங்கள் அதிக நம்பிக்கையுடனும் உங்கள் சவால்களை சமாளிக்கவும் உதவும் ஒரு கதையைச் சொல்லப் போகிறேன்.",
    kn: "ನಮಸ್ಕಾರ, ನಾನು ಆರಂಭ್.AI. 'ಆರಂಭ್' ಎಂದರೆ 'ಒಂದು ಹೊಸ ಆರಂಭ'. ನಾನು ನಿಮ್ಮ ಮಾತನ್ನು ಕೇಳಿದ್ದೇನೆ. ಈಗ ನಾನು ನಿಮಗೆ ಹೆಚ್ಚು ಆತ್ಮವಿಶ್ವಾಸವನ್ನು ನೀಡಲು ಮತ್ತು ನಿಮ್ಮ ಸವಾಲುಗಳನ್ನು ನಿವಾರಿಸಲು ಸಹಾಯ ಮಾಡಲು ಒಂದು ಕಥೆಯನ್ನು ಹೇಳುತ್ತೇನೆ.",
    bn: "নমস্কার, আমি আরম্ভ.AI। 'আরম্ভ' মানে 'একটি নতুন শুরু'। আমি আপনার কথা শুনেছি। এখন আমি আপনাকে আরও আত্মবিশ্বাসী বোধ করতে এবং আপনার চ্যালেঞ্জগুলি কাটিয়ে উঠতে সাহায্য করার জন্য একটি গল্প বলব।",
  };
  return intros[language] || intros['en'];
}

const narratorVoices = ['algenib', 'algieba', 'alnilam', 'callirrhoe', 'erinome', 'fenrir', 'gacrux', 'laomedeia', 'leda', 'puck', 'rasalgethi', 'sadachbia', 'sadaltager', 'schedar', 'sulafat', 'umbriel', 'vindemiatrix', 'zephyr'];
const characterVoices = ['achernar', 'achird', 'aoede', 'autonoe', 'charon', 'despina', 'enceladus', 'iapetus', 'kore', 'orus', 'pulcherrima', 'zubenelgenubi'];


const storyGenerationFlow = ai.defineFlow(
    {
      name: 'storyGenerationFlow',
      inputSchema: StoryGenerationInputSchema,
      outputSchema: StoryGenerationOutputSchema,
    },
    async (input) => {
      // 1. Generate the story script and image in parallel
      const scriptPromise = storyPrompt({
        prompt: input.prompt,
        language: input.language,
      });

      const imagePromise = generateImage({ prompt: input.prompt });

      const [scriptResponse, imageResponse] = await Promise.all([scriptPromise, imagePromise]);
      
      const storyScript = scriptResponse.output?.storyScript;

      if (!storyScript) {
        throw new Error('Failed to generate a story script.');
      }
      
      const introduction = getIntroduction(input.language);
      const fullScript = `Narrator: ${introduction}\n${storyScript}`;

      try {
        const narratorVoice = narratorVoices[Math.floor(Math.random() * narratorVoices.length)];
        const characterVoice = characterVoices[Math.floor(Math.random() * characterVoices.length)];
        
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
                    voiceConfig: { prebuiltVoiceConfig: { voiceName: narratorVoice } },
                  },
                  {
                    speaker: 'Character',
                    voiceConfig: { prebuiltVoiceConfig: { voiceName: characterVoice } },
                  },
                ],
              },
            },
          },
          prompt: fullScript,
        });

        if (!media?.url) {
          throw new Error('TTS model did not return any audio media.');
        }

        // 3. Convert the raw PCM audio to a WAV data URI
        const audioBuffer = Buffer.from(media.url.substring(media.url.indexOf(',') + 1), 'base64');
        const wavBase64 = await toWav(audioBuffer);

        return {
          audioUrl: `data:audio/wav;base64,${wavBase64}`,
          storyScript: fullScript,
          imageUrl: imageResponse.imageUrl,
        };
      } catch (e: any) {
        // Check for a specific quota error from the API
        if (e.message && (e.message.includes('429') || /quota/i.test(e.message))) {
            throw new Error('quotaExceeded');
        }
        // Rethrow other errors
        throw e;
      }
    }
  );


// Main exported function that runs the flow
export async function generateStory(input: StoryGenerationInput): Promise<StoryGenerationOutput> {
  return storyGenerationFlow(input);
}

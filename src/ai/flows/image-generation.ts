
'use server';
/**
 * @fileOverview A Genkit flow for generating images from a text prompt.
 *
 * - generateImage - A function that handles the image generation process.
 * - ImageGenerationInput - The input type for the generateImage function.
 * - ImageGenerationOutput - The return type for the generateImage function.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'genkit';

const ImageGenerationInputSchema = z.object({
  prompt: z.string().describe('A text prompt describing the desired image.'),
});
export type ImageGenerationInput = z.infer<typeof ImageGenerationInputSchema>;

const ImageGenerationOutputSchema = z.object({
  imageUrl: z.string().describe('The data URI of the generated image.'),
});
export type ImageGenerationOutput = z.infer<typeof ImageGenerationOutputSchema>;

export async function generateImage(
  input: ImageGenerationInput
): Promise<ImageGenerationOutput> {
  return generateImageFlow(input);
}

const generateImageFlow = ai.defineFlow(
  {
    name: 'generateImageFlow',
    inputSchema: ImageGenerationInputSchema,
    outputSchema: ImageGenerationOutputSchema,
  },
  async ({ prompt }) => {
    const { media } = await ai.generate({
      model: googleAI.model('imagen-4.0-fast-generate-001'),
      prompt: `cinematic photo, professional color grading, a whimsical and enchanting scene for a children's storybook related to: ${prompt}`,
      config: {
        aspectRatio: '16:9',
      },
    });

    if (!media?.url) {
      throw new Error('Image generation failed to return media.');
    }

    return {
      imageUrl: media.url,
    };
  }
);

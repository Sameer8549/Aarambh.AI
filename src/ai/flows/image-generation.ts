
'use server';
/**
 * @fileOverview A Genkit flow for generating images from a text prompt.
 *
 * - generateImage - A function that handles image generation.
 * - ImageGenerationInput - The input type for the generateImage function.
 * - ImageGenerationOutput - The return type for the generateImage function.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'genkit';

// Define Zod schemas for input and output
const ImageGenerationInputSchema = z.object({
  prompt: z.string().describe('A text prompt to generate an image from.'),
});
export type ImageGenerationInput = z.infer<typeof ImageGenerationInputSchema>;

const ImageGenerationOutputSchema = z.object({
  imageUrl: z.string().describe('The data URI of the generated image.'),
});
export type ImageGenerationOutput = z.infer<typeof ImageGenerationOutputSchema>;


const imageGenerationFlow = ai.defineFlow(
  {
    name: 'imageGenerationFlow',
    inputSchema: ImageGenerationInputSchema,
    outputSchema: ImageGenerationOutputSchema,
  },
  async (input) => {
    
    const { media } = await ai.generate({
        model: googleAI.model('imagen-4.0-fast-generate-001'),
        prompt: `Create a beautiful, symbolic, and gender-neutral visual representation of the following thought: '${input.prompt}'. The style should be artistic and hopeful, focusing on abstract concepts, nature, or objects rather than specific people.`,
        config: {
            aspectRatio: '16:9'
        }
    });
    
    const imageUrl = media.url;
    if (!imageUrl) {
        throw new Error('Failed to generate image.');
    }

    return { imageUrl };
  }
);


// Main exported function that runs the flow
export async function generateImage(input: ImageGenerationInput): Promise<ImageGenerationOutput> {
  return imageGenerationFlow(input);
}

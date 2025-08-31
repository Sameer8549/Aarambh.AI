'use server';
/**
 * @fileOverview A Genkit flow for generating videos from text prompts using Google's Veo model.
 *
 * - generateVideo - A function that handles the video generation process.
 * - VideoGenerationInput - The input type for the generateVideo function.
 * - VideoGenerationOutput - The return type for the generateVideo function.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'genkit';
import * as fs from 'fs';
import { Readable } from 'stream';

const VideoGenerationInputSchema = z.object({
  prompt: z.string().describe('A text description of the video to generate.'),
});
export type VideoGenerationInput = z.infer<typeof VideoGenerationInputSchema>;

const VideoGenerationOutputSchema = z.object({
  videoUrl: z.string().describe('The data URI of the generated video.'),
});
export type VideoGenerationOutput = z.infer<
  typeof VideoGenerationOutputSchema
>;

export async function generateVideo(
  input: VideoGenerationInput
): Promise<VideoGenerationOutput> {
  const videoFlow = ai.defineFlow(
    {
      name: 'videoGenerationFlow',
      inputSchema: VideoGenerationInputSchema,
      outputSchema: VideoGenerationOutputSchema,
    },
    async ({ prompt }) => {
      let { operation } = await ai.generate({
        model: googleAI.model('veo-2.0-generate-001'),
        prompt,
        config: {
          durationSeconds: 5,
          aspectRatio: '16:9',
        },
      });

      if (!operation) {
        throw new Error('Expected the model to return an operation.');
      }

      // Wait for the operation to complete, checking periodically.
      while (!operation.done) {
        await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds
        operation = await ai.checkOperation(operation);
      }

      if (operation.error) {
        console.error('Video generation failed:', operation.error);
        throw new Error(`Failed to generate video: ${operation.error.message}`);
      }

      const video = operation.output?.message?.content.find((p) => !!p.media);
      if (!video || !video.media?.url) {
        throw new Error('Failed to find the generated video in the operation result.');
      }

      // The URL from Veo is temporary and needs an API key to download.
      const fetch = (await import('node-fetch')).default;
      const videoDownloadResponse = await fetch(
        `${video.media.url}&key=${process.env.GEMINI_API_KEY}`
      );
      
      if (!videoDownloadResponse.ok || !videoDownloadResponse.body) {
         throw new Error(`Failed to download video. Status: ${videoDownloadResponse.statusText}`);
      }

      // Convert the video buffer to a base64 data URI to send to the client.
      const videoBuffer = await videoDownloadResponse.arrayBuffer();
      const base64Video = Buffer.from(videoBuffer).toString('base64');
      
      return {
        videoUrl: `data:video/mp4;base64,${base64Video}`,
      };
    }
  );

  return await videoFlow(input);
}

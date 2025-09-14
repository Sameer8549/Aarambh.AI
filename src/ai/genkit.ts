import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI({apiKey: "AIzaSyAoy71Bilgih8-Z_8CKeCw79JlIV1adSpY"})],
  model: 'googleai/gemini-1.5-flash',
});

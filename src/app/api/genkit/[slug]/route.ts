
import {createNextApiHandler} from '@genkit-ai/next';
import {ai} from '@/ai/genkit';

// This is required to make sure the flows are loaded.
import '@/ai/flows/suggest-trades-from-prompt';
import '@/ai/flows/summarize-professional-reviews';


export const {GET, POST} = createNextApiHandler({
  ai,
});

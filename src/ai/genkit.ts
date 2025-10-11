
import { genkit, configureGenkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

configureGenkit({
  plugins: [
    googleAI({
      // Specify the API version.
      apiVersion: 'v1beta',
    }),
  ],
  // Log developer-friendly error messages.
  logLevel: 'debug',
  // Perform OpenTelemetry instrumentation.
  enableTracingAndMetrics: true,
});

export { genkit as ai };

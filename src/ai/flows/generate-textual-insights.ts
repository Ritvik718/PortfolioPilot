'use server';
/**
 * @fileOverview An AI flow for generating textual insights from calculated portfolio data.
 *
 * - generateTextualInsights - Generates insights and a forecast from structured data.
 * - GenerateTextualInsightsInput - The input type for the function.
 * - GenerateTextualInsightsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTextualInsightsInputSchema = z.object({
    calculatedInsights: z.string().describe("A JSON string of calculated portfolio metrics, including total value, gains, losses, best performers, and asset allocation."),
});
export type GenerateTextualInsightsInput = z.infer<typeof GenerateTextualInsightsInputSchema>;

const GenerateTextualInsightsOutputSchema = z.object({
  insights: z.array(z.string()).describe("3-5 concise, data-driven insights about the portfolio's strengths and weaknesses."),
  forecast: z.string().describe("A brief, one-paragraph forecast of the portfolio's potential future performance based on the provided data."),
});
export type GenerateTextualInsightsOutput = z.infer<typeof GenerateTextualInsightsOutputSchema>;

export async function generateTextualInsights(input: GenerateTextualInsightsInput): Promise<GenerateTextualInsightsOutput> {
  return generateTextualInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTextualInsightsPrompt',
  input: {schema: GenerateTextualInsightsInputSchema},
  output: {schema: GenerateTextualInsightsOutputSchema},
  config: {
    temperature: 0.5,
  },
  prompt: `You are a financial analyst AI. Your task is to generate qualitative insights and a forecast based on pre-calculated portfolio metrics.

Calculated Portfolio Data:
{{{calculatedInsights}}}

Instructions:
1.  Analyze the provided JSON data which contains calculated metrics about a user's portfolio.
2.  Generate 3 to 5 bullet-point insights that highlight the portfolio's key characteristics, strengths, or weaknesses. The insights should be easy to understand for a non-expert.
3.  Write a brief, one-paragraph future forecast for the portfolio. This should be a high-level summary, not specific financial advice.
4.  Be objective and base your analysis strictly on the data provided.`,
});

const generateTextualInsightsFlow = ai.defineFlow(
  {
    name: 'generateTextualInsightsFlow',
    inputSchema: GenerateTextualInsightsInputSchema,
    outputSchema: GenerateTextualInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);

    if (!output) {
      throw new Error("AI failed to generate textual insights.");
    }

    return output;
  }
);

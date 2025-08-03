
'use server';
/**
 * @fileOverview AI-powered insight generation for financial portfolio analysis.
 *
 * - generateInsights - A function that generates AI insights for a user's portfolio.
 * - GenerateInsightsInput - The input type for the generateInsights function.
 * - GenerateInsightsOutput - The return type for the generateInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInsightsInputSchema = z.object({
  portfolioData: z
    .string()
    .describe('A string containing the user\'s portfolio data, typically in CSV or JSON format.'),
});
export type GenerateInsightsInput = z.infer<typeof GenerateInsightsInputSchema>;

const GenerateInsightsOutputSchema = z.object({
  insights: z.array(z.string()).describe('A list of AI-generated insights about the portfolio.'),
  forecast: z.string().describe('An AI-powered forecast of future portfolio performance.'),
});
export type GenerateInsightsOutput = z.infer<typeof GenerateInsightsOutputSchema>;

export async function generateInsights(input: GenerateInsightsInput): Promise<GenerateInsightsOutput> {
  return generateInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInsightsPrompt',
  input: {schema: GenerateInsightsInputSchema},
  output: {schema: GenerateInsightsOutputSchema},
  prompt: `You are an AI-powered financial analyst. Your task is to provide insights and forecasts based on a user's uploaded portfolio data. The data is provided as a single string.

Portfolio Data:
{{{portfolioData}}}

Instructions:
1.  Analyze the portfolio data to identify key assets, trends, strengths, and weaknesses.
2.  Generate 3-5 concise and informative insights about the portfolio's composition, performance, and potential risks.
3.  Provide a brief forecast of the portfolio's future performance based on its composition and general market conditions.
4.  Ensure the insights are relevant, actionable, and easy to understand for a non-expert user.
5.  The insights should be in plain text and not include bullet points.

Output:
Insights: A list of AI-generated insights about the portfolio.
Forecast: An AI-powered forecast of future portfolio performance.`,
});

const generateInsightsFlow = ai.defineFlow(
  {
    name: 'generateInsightsFlow',
    inputSchema: GenerateInsightsInputSchema,
    outputSchema: GenerateInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

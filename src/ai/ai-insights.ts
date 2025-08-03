
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
import type { AnalyzedAsset, PerformanceDataPoint } from '@/lib/data';


const GenerateInsightsInputSchema = z.object({
  portfolioData: z
    .string()
    .describe('A string containing the user\'s portfolio data, typically in CSV or JSON format.'),
});
export type GenerateInsightsInput = z.infer<typeof GenerateInsightsInputSchema>;

const GenerateInsightsOutputSchema = z.object({
  insights: z.array(z.string()).describe('A list of AI-generated insights about the portfolio.'),
  forecast: z.string().describe('An AI-powered forecast of future portfolio performance.'),
  totalValue: z.number().describe("The total current market value of the portfolio."),
  change24h: z.number().describe("The total change in the portfolio's value over the last 24 hours."),
  change24hPercentage: z.number().describe("The percentage change in the portfolio's value over the last 24 hours."),
  assets: z.array(z.object({
    name: z.string().describe("The name of the asset."),
    symbol: z.string().describe("The stock or crypto ticker symbol."),
    category: z.enum(['Stock', 'Crypto', 'Real Estate']).describe("The category of the asset."),
    holdings: z.number().describe("The quantity of the asset held."),
    value: z.number().describe("The current total market value of the asset holding."),
    change24h: z.number().describe("The change in the asset's value over the last 24 hours."),
  })).describe("An array of the top 5 assets in the portfolio."),
  performanceHistory: z.object({
      '1D': z.array(z.object({ date: z.string(), value: z.number() })).describe("Performance data for the last day."),
      '7D': z.array(z.object({ date: z.string(), value: z.number() })).describe("Performance data for the last 7 days."),
      '30D': z.array(z.object({ date: z.string(), value: z.number() })).describe("Performance data for the last 30 days."),
      'YTD': z.array(z.object({ date: z.string(), value: z.number() })).describe("Performance data for the year to date."),
      '1Y': z.array(z.object({ date: z.string(), value: z.number() })).describe("Performance data for the last year."),
  }).describe("The historical performance of the portfolio over various timeframes."),
});
export type GenerateInsightsOutput = z.infer<typeof GenerateInsightsOutputSchema>;


export async function generateInsights(input: GenerateInsightsInput): Promise<GenerateInsightsOutput> {
  return generateInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInsightsPrompt',
  input: {schema: GenerateInsightsInputSchema},
  output: {schema: GenerateInsightsOutputSchema},
  prompt: `You are an AI-powered financial analyst. Your task is to provide insights, forecasts, and structured data based on a user's uploaded portfolio data. The data is provided as a single string.

Portfolio Data:
{{{portfolioData}}}

Instructions:
1.  Analyze the portfolio data to identify key assets, trends, strengths, and weaknesses.
2.  Calculate the total portfolio value, 24-hour change (in currency and percentage), and identify the top 5 assets by value.
3.  Generate synthetic but realistic historical performance data for the portfolio over 1D, 7D, 30D, YTD, and 1Y timeframes. The most recent data point should match the calculated total value.
4.  Generate 3-5 concise and informative insights about the portfolio's composition, performance, and potential risks.
5.  Provide a brief forecast of the portfolio's future performance based on its composition and general market conditions.
6.  Ensure all textual insights are easy to understand for a non-expert user and do not include bullet points.
7.  Return all calculated figures and generated text in the specified structured output format.`,
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


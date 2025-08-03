
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
    .describe('A string containing the user\'s portfolio data, typically in CSV or JSON format. This data should include details like asset names, quantities, purchase prices, and current prices to enable calculations.'),
});
export type GenerateInsightsInput = z.infer<typeof GenerateInsightsInputSchema>;

const GenerateInsightsOutputSchema = z.object({
  totalValue: z.string().describe("The total current market value of the portfolio."),
  totalInvestment: z.string().describe("The total amount of capital invested across all assets."),
  overallGainLoss: z.string().describe("The overall gain or loss in dollar terms and as a percentage."),
  bestPerformer: z.string().describe("The asset or asset class with the highest return percentage."),
  biggestWinner: z.string().describe("The asset that has contributed the most to total gains in dollar terms."),
  assetAllocation: z.string().describe("A summary of the percentage allocation of each asset class (e.g., Stocks, Crypto) in the total portfolio."),
  underperformingAssets: z.string().describe("A summary of any assets that are underperforming or have negligible returns."),
  marketDropSimulation: z.string().describe("The simulated portfolio value if market prices were to drop by 10%."),
  insights: z.array(z.string()).describe('A list of 2-3 key, concise insights about the portfolio\'s composition, performance, and potential risks based *only* on the provided data.'),
  forecast: z.string().describe('A brief, AI-powered forecast of future portfolio performance based on its current composition.'),
  assets: z.array(z.object({
    name: z.string().describe("The name of the asset."),
    symbol: z.string().describe("The stock or crypto ticker symbol."),
    category: z.enum(['Stock', 'Crypto', 'Real Estate']).describe("The category of the asset."),
    holdings: z.number().describe("The quantity of the asset held."),
    value: z.number().describe("The current total market value of the asset holding."),
    change24h: z.number().describe("The change in the asset's value over the last 24 hours."),
  })).describe("An array of the top 5 assets in the portfolio by current value."),
});
export type GenerateInsightsOutput = z.infer<typeof GenerateInsightsOutputSchema>;


export async function generateInsights(input: GenerateInsightsInput): Promise<GenerateInsightsOutput> {
  return generateInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInsightsPrompt',
  input: {schema: GenerateInsightsInputSchema},
  output: {schema: GenerateInsightsOutputSchema},
  config: {
    temperature: 0,
  },
  prompt: `You are a financial data analysis AI. Your task is to analyze the user's portfolio data and provide structured answers to a specific set of questions. You must also generate a few key insights and a brief forecast.

Portfolio Data:
{{{portfolioData}}}

Instructions:
1.  Carefully analyze the provided portfolio data. The data may contain information about purchase price (cost basis) and current market price for each asset.
2.  Calculate the answers to the following questions and provide them in the corresponding output fields.
    - What is the total current value of the portfolio? (totalValue)
    - What is the total amount invested across all assets? (totalInvestment)
    - What is the overall gain or loss in dollar terms and percentage? (overallGainLoss)
    - Which asset or asset class has performed the best (highest return %)? (bestPerformer)
    - Which asset has contributed the most to total gains? (biggestWinner)
    - What is the percentage allocation of each asset class in the total portfolio? (assetAllocation)
    - Are any assets underperforming or producing negligible returns? (underperformingAssets)
    - What would happen to the portfolio value if market prices drop by 10%? (marketDropSimulation)
3.  Also, extract the top 5 assets by current market value.
4.  Generate 2-3 concise, key insights based on your analysis.
5.  Provide a brief forecast of the portfolio's future performance.
6.  Return all information in the specified structured JSON output format. Ensure all textual answers are clear and easy to understand.`,
});

const generateInsightsFlow = ai.defineFlow(
  {
    name: 'generateInsightsFlow',
    inputSchema: GenerateInsightsInputSchema,
    outputSchema: GenerateInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    
    if (!output) {
      throw new Error("AI failed to generate insights.");
    }
    
    return output;
  }
);

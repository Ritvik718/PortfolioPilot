
'use server';

import { parsePortfolio, ParsePortfolioInput, ParsePortfolioOutput } from '@/ai/flows/parse-portfolio';
import { portfolioQA, PortfolioQAInput, PortfolioQAOutput } from '@/ai/flows/portfolio-qa';
import { generateTextualInsights, GenerateTextualInsightsInput, GenerateTextualInsightsOutput } from '@/ai/flows/generate-textual-insights';
import { getStockDetails } from '@/ai/flows/get-stock-details';
import type { GetStockDetailsInput, GetStockDetailsOutput } from '@/ai/flows/get-stock-details.types';

export async function getParsedPortfolio(input: ParsePortfolioInput): Promise<ParsePortfolioOutput | { error: string }> {
  try {
    const result = await parsePortfolio(input);
    return result;
  } catch (error) {
    console.error('Error calling AI flow:', error);
    return {
      error: 'Sorry, I encountered an error while processing your request.',
    };
  }
}

export async function getInsights(input: GenerateTextualInsightsInput): Promise<GenerateTextualInsightsOutput | { error: string }> {
    try {
        const result = await generateTextualInsights(input);
        return result;
    } catch (error) {
        console.error('Error calling AI flow for insights:', error);
        return {
            error: 'Sorry, I encountered an error while generating insights.',
        };
    }
}


export async function askPortfolioQuestion(input: PortfolioQAInput): Promise<PortfolioQAOutput | { error: string }> {
    try {
        const result = await portfolioQA(input);
        return result;
    } catch (error) {
        console.error('Error calling AI flow:', error);
        return {
            error: 'Sorry, I encountered an error while processing your request.',
        };
    }
}

export async function getStockDetailsAction(input: GetStockDetailsInput): Promise<GetStockDetailsOutput | { error: string }> {
    try {
        const result = await getStockDetails(input);
        return result;
    } catch (error: any) {
        console.error('Error getting stock details:', error);
        return {
            error: `Sorry, I failed to retrieve details for ${input.symbol}: ${error.message}`,
        }
    }
}

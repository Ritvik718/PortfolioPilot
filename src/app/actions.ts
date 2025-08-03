'use server';

import { portfolioQA } from '@/ai/flows/portfolio-qa';
import { useRouter } from 'next/navigation';

export async function askQuestion(question: string, portfolioData: any) {
  try {
    const stringifiedData = JSON.stringify(portfolioData, null, 2);
    const result = await portfolioQA({
      question,
      portfolioData: stringifiedData,
    });
    return { answer: result.answer };
  } catch (error) {
    console.error('Error calling AI flow:', error);
    return { error: 'Sorry, I encountered an error while processing your request.' };
  }
}

'use server';

import { portfolioQA } from '@/ai/flows/portfolio-qa';

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

export async function login(data: any) {
    console.log('Login attempt:', data);
    // TODO: Implement actual login logic
    return { success: true, message: 'Logged in successfully!' };
}

export async function register(data: any) {
    console.log('Register attempt:', data);
    // TODO: Implement actual registration logic
    return { success: true, message: 'Registered successfully!' };
}


'use server';

import { parsePortfolio, ParsePortfolioInput, ParsePortfolioOutput } from '@/ai/flows/parse-portfolio';
import { portfolioQA, PortfolioQAInput, PortfolioQAOutput } from '@/ai/flows/portfolio-qa';
import { generateTextualInsights, GenerateTextualInsightsInput, GenerateTextualInsightsOutput } from '@/ai/flows/generate-textual-insights';
import { auth, db } from '@/lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { redirect } from 'next/navigation';

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


export async function login(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error: any) {
    return { message: error.message };
  }
  redirect('/dashboard');
}

export async function register(prevState: any, formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, {
            uid: user.uid,
            firstName,
            lastName,
            email,
        });
        return { message: 'Registration successful! You can now log in.' };
    } catch (error: any) {
        return { message: error.message };
    }
}

export async function logout() {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

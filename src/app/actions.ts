'use server';

import { portfolioQA } from '@/ai/flows/portfolio-qa';
import { auth, db } from '@/lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { Transaction } from '@/lib/data';

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
    return {
      error: 'Sorry, I encountered an error while processing your request.',
    };
  }
}

export async function addTransaction(transaction: Omit<Transaction, 'id' | 'date'> & { userId: string }) {
    try {
        const docRef = await addDoc(collection(db, 'transactions'), {
            ...transaction,
            date: serverTimestamp(),
        });

        // Fetch the document to get the server-generated timestamp
        const newDoc = await getDoc(docRef);
        const newTransaction = {
          id: newDoc.id,
          ...newDoc.data(),
           // Convert Firestore Timestamp to JS Date string
          date: newDoc.data()?.date.toDate().toISOString(),
        } as Transaction;

        return { success: true, transaction: newTransaction };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}


export async function login(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    return { message: 'Login successful' };
  } catch (error: any) {
    return { message: error.message };
  }
}

export async function register(prevState: any, formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;

    try {
        await createUserWithEmailAndPassword(auth, email, password);
        // You might want to save the first and last name to Firestore here
        return { message: 'Registration successful' };
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

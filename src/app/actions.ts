'use server';

import { portfolioQA } from '@/ai/flows/portfolio-qa';
import { auth, db } from '@/lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { collection, addDoc, serverTimestamp, doc, getDoc, query, where, getDocs, orderBy } from 'firebase/firestore';
import { Transaction } from '@/lib/data';
import { getCurrentUser } from '@/lib/auth';

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

export async function addTransaction(transaction: Omit<Transaction, 'id' | 'date' | 'userId'>) {
    const user = await getCurrentUser();
    if (!user) {
        return { success: false, message: "Authentication required." };
    }

    try {
        const docRef = await addDoc(collection(db, 'transactions'), {
            ...transaction,
            userId: user.uid,
            date: serverTimestamp(),
        });
        return { success: true, id: docRef.id };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function getTransactions(): Promise<Transaction[]> {
    const user = await getCurrentUser();
    if (!user) {
        return [];
    }

    try {
        const q = query(collection(db, 'transactions'), where('userId', '==', user.uid), orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);
        const transactions = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                date: data.date.toDate().toISOString(),
            } as Transaction;
        });
        return transactions;
    } catch (error) {
        console.error("Error fetching transactions: ", error);
        return [];
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

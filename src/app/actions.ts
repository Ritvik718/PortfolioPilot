
'use server';

import { generateInsights, GenerateInsightsInput } from '@/ai/ai-insights';
import { auth, db } from '@/lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export async function getAIInsights(input: GenerateInsightsInput) {
  try {
    const result = await generateInsights(input);
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
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, {
            uid: user.uid,
            firstName,
            lastName,
            email,
        });

        return { message: 'Registration successful' };
    } catch (error: any) {
        return { message: error.message };
    }
}

export async function handleGoogleSignIn(userData: {uid: string, email: string | null, displayName: string | null}) {
    const { uid, email, displayName } = userData;
    const userRef = doc(db, 'users', uid);

    try {
        const docSnap = await getDoc(userRef);
        if (!docSnap.exists()) {
            const firstName = displayName ? displayName.split(' ')[0] : '';
            const lastName = displayName ? displayName.split(' ').slice(1).join(' ') : '';
            await setDoc(userRef, {
                uid,
                email,
                firstName,
                lastName,
            });
        }
        return { success: true };
    } catch (error: any) {
        console.error("Error handling Google sign-in:", error);
        return { success: false, message: error.message };
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

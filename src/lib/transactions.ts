
'use client';

import { db, auth } from '@/lib/firebase';
import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp
} from 'firebase/firestore';
import type { Transaction } from '@/lib/data';

// Note: addTransaction is no longer used with the portfolio upload flow.
// It is kept here for potential future use or reference.
export async function addTransaction(
  transactionData: Omit<Transaction, 'id' | 'date'> & { userId: string }
): Promise<{ success: boolean; transaction?: Transaction; message?: string }> {
  const user = auth.currentUser;
  if (!user || user.uid !== transactionData.userId) {
    return { success: false, message: 'Authentication required or mismatched user.' };
  }

  try {
    const transactionsRef = collection(db, 'transactions');
    const docRef = await addDoc(transactionsRef, {
        ...transactionData,
        date: serverTimestamp() // Use server timestamp for consistency
    });

    const newTransaction: Transaction = {
      id: docRef.id,
      ...transactionData,
      date: new Date().toISOString(), // Return current date for optimistic update
    };

    return { success: true, transaction: newTransaction };
  } catch (error: any) {
    console.error('Error adding transaction:', error);
    return { success: false, message: error.message };
  }
}

export async function getTransactions(userId: string): Promise<Transaction[]> {
    if (!userId) {
        return [];
    }

    try {
        const transactionsRef = collection(db, 'transactions');
        const q = query(
            transactionsRef,
            where("userId", "==", userId),
            orderBy("date", "desc"),
            limit(50)
        );

        const querySnapshot = await getDocs(q);

        const transactions: Transaction[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            transactions.push({
                id: doc.id,
                ...data,
                // Convert Firestore Timestamp to ISO string if needed
                date: data.date.toDate().toISOString(),
            } as Transaction);
        });
        
        return transactions;
    } catch (error) {
        console.error("Error fetching transactions: ", error);
        throw error; // Re-throw the error to be caught by the caller
    }
}

import { db, auth } from '@/lib/firebase';
import { ref, push, set, get, query, orderByChild } from 'firebase/database';
import type { Transaction } from '@/lib/data';

export async function addTransaction(
  transaction: Omit<Transaction, 'id' | 'userId'>
): Promise<{ success: boolean; transaction?: Transaction; message?: string }> {
  const user = auth.currentUser;
  if (!user) {
    return { success: false, message: 'Authentication required.' };
  }

  try {
    const transactionsRef = ref(db, `transactions/${user.uid}`);
    const newTransactionRef = push(transactionsRef);

    await set(newTransactionRef, transaction);

    const newTransaction: Transaction = {
      id: newTransactionRef.key!,
      userId: user.uid,
      ...transaction,
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
        const transactionsRef = ref(db, `transactions/${userId}`);
        const snapshot = await get(query(transactionsRef, orderByChild('date')));
        
        if (snapshot.exists()) {
            const transactions: Transaction[] = [];
            snapshot.forEach((childSnapshot) => {
                transactions.push({
                    id: childSnapshot.key!,
                    userId: userId,
                    ...childSnapshot.val()
                });
            });
            // RTDB returns in ascending order, so we reverse for descending date order
            return transactions.reverse();
        }
        return [];
    } catch (error) {
        console.error("Error fetching transactions: ", error);
        throw error; // Re-throw the error to be caught by the caller
    }
}
import { db } from '@/lib/firebase';
import { ref, push, set } from 'firebase/database';
import type { Transaction } from '@/lib/data';

export async function addTransaction(
  transaction: Omit<Transaction, 'id'>
): Promise<{ success: boolean; transaction?: Transaction; message?: string }> {
  if (!transaction.userId) {
    return { success: false, message: 'Authentication required.' };
  }

  try {
    const { userId, ...transactionData } = transaction;
    const transactionsRef = ref(db, `transactions/${userId}`);
    const newTransactionRef = push(transactionsRef);

    await set(newTransactionRef, transactionData);

    const newTransaction: Transaction = {
      id: newTransactionRef.key!,
      userId: userId,
      ...transactionData,
    };

    return { success: true, transaction: newTransaction };
  } catch (error: any) {
    console.error('Error adding transaction:', error);
    return { success: false, message: error.message };
  }
}

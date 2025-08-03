'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Transaction } from '@/lib/data';

interface TransactionContextType {
  transactions: Transaction[];
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export function TransactionProvider({ children, initialTransactions = [] }: { children: ReactNode, initialTransactions?: Transaction[] }) {
  const [transactions] = useState<Transaction[]>(initialTransactions);

  return (
    <TransactionContext.Provider value={{ transactions }}>
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransaction() {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransaction must be used within a TransactionProvider');
  }
  return context;
}

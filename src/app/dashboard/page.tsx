'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { PlusCircle } from 'lucide-react';
import { useTransaction } from '@/context/transaction-context';
import { TransactionList } from '@/components/dashboard/transaction-list';

export default function DashboardPage() {
    const { transactions } = useTransaction();

  return (
    <>
      <DashboardHeader />
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
        {transactions.length > 0 ? (
            <TransactionList transactions={transactions} />
        ) : (
            <div className="text-center">
                <h2 className="text-2xl font-bold tracking-tight">
                    Welcome to your Portfolio
                </h2>
                <p className="text-muted-foreground">
                    You have no transactions yet. Add one to get started.
                </p>
                <Button asChild className="mt-4">
                    <Link href="/dashboard/transactions/add">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Transaction
                    </Link>
                </Button>
            </div>
        )}
      </div>
    </>
  );
}

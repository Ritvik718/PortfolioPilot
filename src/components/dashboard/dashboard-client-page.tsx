'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { PlusCircle } from 'lucide-react';
import { OverviewCards } from '@/components/dashboard/overview-cards';
import { PerformanceChart } from '@/components/dashboard/performance-chart';
import { AssetList } from '@/components/dashboard/asset-list';
import { AIChatWidget } from '@/components/dashboard/ai-chat-widget';
import type { PortfolioData, Transaction } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { TransactionList } from '@/components/dashboard/transaction-list';
import { TransactionProvider, useTransaction } from '@/context/transaction-context';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { getTransactions } from '@/lib/transactions';
import { useToast } from '@/hooks/use-toast';

type DashboardClientPageProps = {
    portfolioData: PortfolioData | null;
    initialTransactions: Transaction[];
};

function MainDashboard({ portfolioData }: { portfolioData: PortfolioData | null }) {
    const [user, userLoading] = useAuthState(auth);
    const { transactions, setTransactions, isLoading: transactionsLoading, setIsLoading: setTransactionsLoading } = useTransaction();
    const { toast } = useToast();

    useEffect(() => {
        if (user && !userLoading) {
            setTransactionsLoading(true);
            getTransactions(user.uid)
                .then(setTransactions)
                .catch((error) => {
                    console.error("Failed to fetch transactions:", error)
                    toast({
                        variant: 'destructive',
                        title: 'Error fetching data',
                        description: 'Could not load your transactions. Please check your connection and try again.'
                    })
                })
                .finally(() => setTransactionsLoading(false));
        } else if (!user && !userLoading) {
            // Handle case where user is logged out
            setTransactions([]);
            setTransactionsLoading(false);
        }
    }, [user, userLoading, setTransactions, setTransactionsLoading, toast]);
    
    const isLoading = !portfolioData || userLoading;

    if (isLoading) {
        return (
            <div className="grid gap-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Skeleton className="h-[126px] w-full" />
                    <Skeleton className="h-[126px] w-full" />
                    <Skeleton className="h-[126px] w-full" />
                </div>
                <div className="grid gap-6 grid-cols-1 xl:grid-cols-3">
                    <Skeleton className="h-[418px] xl:col-span-2" />
                    <Skeleton className="h-[418px]" />
                </div>
                <div className="grid gap-6 grid-cols-1 xl:grid-cols-3">
                    <Skeleton className="h-[500px] xl:col-span-2" />
                     <Skeleton className="h-[500px]" />
                </div>
            </div>
        )
    }
    
    const hasTransactions = transactions.length > 0;
    // We check for portfolioData but also consider that real-time data might be empty if API fails.
    // The main indicator for the welcome screen should be the absence of transactions.
    const showWelcomeScreen = !transactionsLoading && !hasTransactions;


    return showWelcomeScreen ? (
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
    ) : (
          portfolioData && (
            <div className="grid gap-6">
              <OverviewCards data={portfolioData} />
              <div className="grid gap-6 grid-cols-1 xl:grid-cols-3">
                <div className="xl:col-span-2">
                   <PerformanceChart data={portfolioData.performanceHistory} />
                </div>
                <div className="flex flex-col gap-6">
                  <AssetList assets={portfolioData.assets} />
                </div>
              </div>
               <div className="grid gap-6 grid-cols-1 xl:grid-cols-3">
                  <div className="xl:col-span-2">
                      <TransactionList transactions={transactions} isLoading={transactionsLoading} />
                  </div>
                  <div className="flex flex-col gap-6">
                      <AIChatWidget portfolioData={portfolioData} />
                  </div>
              </div>
            </div>
          )
        );
}


export function DashboardClientPage(props: DashboardClientPageProps) {
    return (
        <TransactionProvider initialTransactions={props.initialTransactions}>
            <DashboardHeader />
            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
                <MainDashboard {...props} />
            </div>
        </TransactionProvider>
    )
}

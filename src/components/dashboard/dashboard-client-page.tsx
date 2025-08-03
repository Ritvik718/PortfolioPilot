'use client';

import React from 'react';
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
import { TransactionProvider } from '@/context/transaction-context';


type DashboardClientPageProps = {
    portfolioData: PortfolioData | null;
    initialTransactions: Transaction[];
};

export function DashboardClientPage({ portfolioData, initialTransactions }: DashboardClientPageProps) {
    const [isLoading, setIsLoading] = React.useState(!portfolioData);
    
    // This effect could be used for client-side re-fetching if needed in the future
    // For now, we rely on the server-fetched initialData
    React.useEffect(() => {
        if (!portfolioData) {
            setIsLoading(true);
        } else {
            setIsLoading(false);
        }
    }, [portfolioData]);

    const hasTransactions = initialTransactions.length > 0;
    const hasPortfolioData = portfolioData && portfolioData.assets.length > 0;

  return (
    <TransactionProvider initialTransactions={initialTransactions}>
      <DashboardHeader />
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
        {isLoading ? (
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
        ) : hasTransactions || hasPortfolioData ? (
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
                      <TransactionList transactions={initialTransactions} />
                  </div>
                  <div className="flex flex-col gap-6">
                      <AIChatWidget portfolioData={portfolioData} />
                  </div>
              </div>
            </div>
          )
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
    </TransactionProvider>
  );
}

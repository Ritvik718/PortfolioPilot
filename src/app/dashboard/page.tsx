'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { PlusCircle } from 'lucide-react';
import { useTransaction } from '@/context/transaction-context';
import { TransactionList } from '@/components/dashboard/transaction-list';
import { mockPortfolioData } from '@/lib/mock-data';
import { OverviewCards } from '@/components/dashboard/overview-cards';
import { PerformanceChart } from '@/components/dashboard/performance-chart';
import { AssetList } from '@/components/dashboard/asset-list';
import { AIChatWidget } from '@/components/dashboard/ai-chat-widget';

export default function DashboardPage() {
    const { transactions } = useTransaction();
    const portfolioData = mockPortfolioData;

    const hasTransactions = transactions.length > 0;
    const hasPortfolioData = portfolioData.assets.length > 0;

  return (
    <>
      <DashboardHeader />
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
        {hasTransactions || hasPortfolioData ? (
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
                    <TransactionList transactions={transactions} />
                </div>
                <div className="flex flex-col gap-6">
                    <AIChatWidget portfolioData={portfolioData} />
                </div>
            </div>
          </div>
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

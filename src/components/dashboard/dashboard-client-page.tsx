
'use client';

import React from 'react';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { OverviewCards } from '@/components/dashboard/overview-cards';
import { PerformanceChart } from '@/components/dashboard/performance-chart';
import { PortfolioAnalysis } from '@/components/dashboard/portfolio-analysis';
import type { PortfolioData } from '@/lib/data';
import type { StockQuote, MarketNews } from '@/lib/market-data';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { MarketOverview } from './market-overview';
import { MarketNewsFeed } from './market-news';

type DashboardClientPageProps = {
    portfolioData: PortfolioData | null;
    marketData: StockQuote[];
    marketNews: MarketNews[];
};

function MainDashboard({ portfolioData, marketData, marketNews }: { portfolioData: PortfolioData | null, marketData: StockQuote[], marketNews: MarketNews[] }) {
    const [user, userLoading] = useAuthState(auth);
    
    const isLoading = !portfolioData || userLoading;

    if (isLoading) {
        return (
            <div className="grid gap-6">
                <Skeleton className="h-[148px] w-full" />
                <Skeleton className="h-[400px] w-full" />
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
    
    // Welcome screen can now be for analyzing the portfolio
    const showWelcomeScreen = !portfolioData?.totalValue;


    return (
        <div className="grid gap-6">
            <MarketOverview quotes={marketData} />
            <MarketNewsFeed news={marketNews} />
            {showWelcomeScreen ? (
                <div className="text-center py-16">
                    <h2 className="text-2xl font-bold tracking-tight">
                        Welcome to your Portfolio
                    </h2>
                    <p className="text-muted-foreground">
                        Upload your portfolio data to get started with AI analysis.
                    </p>
                    <PortfolioAnalysis />
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
                                <PortfolioAnalysis />
                            </div>
                        </div>
                    </div>
                )
            )}
        </div>
    );
}


export function DashboardClientPage(props: DashboardClientPageProps) {
    return (
        <>
            <DashboardHeader />
            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
                <MainDashboard {...props} />
            </div>
        </>
    )
}

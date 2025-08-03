
'use client';

import React from 'react';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { PerformanceChart } from '@/components/dashboard/performance-chart';
import { PortfolioAnalysis } from '@/components/dashboard/portfolio-analysis';
import type { PortfolioData } from '@/lib/data';
import type { StockQuote, MarketNews } from '@/lib/market-data';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { MarketOverview } from './market-overview';
import { MarketNewsFeed } from './market-news';
import type { ParsePortfolioOutput } from '@/ai/flows/parse-portfolio';
import { Card, CardContent } from '../ui/card';
import { Sparkles } from 'lucide-react';
import { PortfolioChat } from './portfolio-chat';

type DashboardClientPageProps = {
    portfolioData: PortfolioData | null;
    marketData: StockQuote[];
    marketNews: MarketNews[];
};

function MainDashboard({ initialPortfolioData, marketData, marketNews }: { initialPortfolioData: PortfolioData | null, marketData: StockQuote[], marketNews: MarketNews[] }) {
    const [user, userLoading] = useAuthState(auth);
    const [userPortfolioData, setUserPortfolioData] = React.useState<ParsePortfolioOutput | null>(null);

    const handleAnalysisComplete = (data: ParsePortfolioOutput) => {
        setUserPortfolioData(data);
    };

    const portfolioHasData = userPortfolioData && userPortfolioData.assets.length > 0;
    
    const isLoading = userLoading;

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

    return (
        <div className="grid gap-6">
            <MarketOverview quotes={marketData} />
            <MarketNewsFeed news={marketNews} />
            
            <div className="grid gap-6 grid-cols-1 xl:grid-cols-2">
                 <div className="flex flex-col gap-6">
                    {portfolioHasData ? (
                        <Card className="h-full flex flex-col items-center justify-center text-center p-8">
                            <CardContent>
                                <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
                                <h2 className="text-2xl font-bold tracking-tight">
                                    Your Portfolio is Analyzed
                                </h2>
                                <p className="text-muted-foreground">
                                    You can now ask questions about your portfolio in the chat.
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                         <Card className="h-full flex flex-col items-center justify-center text-center p-8">
                            <CardContent>
                                <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
                                <h2 className="text-2xl font-bold tracking-tight">
                                    Analyze Your Portfolio
                                </h2>
                                <p className="text-muted-foreground">
                                    Upload your portfolio data to see your personalized dashboard and get AI insights.
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
                <div className="flex flex-col gap-6">
                     <PortfolioAnalysis onAnalysisComplete={handleAnalysisComplete} />
                     <PortfolioChat portfolioData={userPortfolioData} />
                </div>
            </div>
        </div>
    );
}


export function DashboardClientPage(props: DashboardClientPageProps) {
    return (
        <>
            <DashboardHeader />
            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
                <MainDashboard 
                    initialPortfolioData={props.portfolioData} 
                    marketData={props.marketData}
                    marketNews={props.marketNews}
                />
            </div>
        </>
    )
}

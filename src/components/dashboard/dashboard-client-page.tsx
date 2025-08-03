
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { PerformanceChart } from '@/components/dashboard/performance-chart';
import { PortfolioAnalysis, TextualInsights } from '@/components/dashboard/portfolio-analysis';
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
import { CalculatedInsights } from '@/lib/calculations';
import { exportPortfolioToPdf } from '@/lib/pdf-export';

type DashboardClientPageProps = {
    portfolioData: PortfolioData | null;
    marketData: StockQuote[];
    marketNews: MarketNews[];
};

export type UserPortfolioData = {
    parsed: ParsePortfolioOutput;
    calculated: CalculatedInsights;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
        },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0, scale: 0.98 },
    visible: {
        y: ["0%", "-1.5%", "0%"],
        opacity: 1,
        scale: 1,
        transition: {
            y: {
                duration: 5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1
            },
            opacity: { duration: 0.5 },
            scale: { duration: 0.5 },
        },
    },
};


function MainDashboard({ initialPortfolioData, marketData, marketNews }: { initialPortfolioData: PortfolioData | null, marketData: StockQuote[], marketNews: MarketNews[] }) {
    const [user, userLoading] = useAuthState(auth);
    const [userPortfolioData, setUserPortfolioData] = React.useState<UserPortfolioData | null>(null);
    const [textualInsights, setTextualInsights] = React.useState<TextualInsights | null>(null);


    const handleAnalysisComplete = (data: { portfolio: UserPortfolioData, insights: TextualInsights | null }) => {
        setUserPortfolioData(data.portfolio);
        setTextualInsights(data.insights)
    };

    const handleExport = async () => {
        if (!userPortfolioData || !textualInsights) {
            alert("Please analyze a portfolio first to export data.");
            return;
        }
        await exportPortfolioToPdf(userPortfolioData, textualInsights);
    };

    const portfolioHasData = userPortfolioData && userPortfolioData.parsed.assets.length > 0;
    
    const isLoading = userLoading;

    if (isLoading) {
        return (
             <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
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
            </div>
        )
    }

    return (
        <>
            <DashboardHeader onExport={handleExport} />
            <motion.div 
                className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div variants={itemVariants}>
                    <MarketOverview quotes={marketData} />
                </motion.div>
                
                <motion.div variants={itemVariants}>
                    <MarketNewsFeed news={marketNews} />
                </motion.div>
                    
                <motion.div className="grid gap-6 grid-cols-1 xl:grid-cols-2" variants={itemVariants}>
                        <div className="flex flex-col gap-6">
                            {portfolioHasData ? (
                                <Card className="h-full flex flex-col items-center justify-center text-center p-8">
                                    <CardContent>
                                        <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
                                        <h2 className="text-2xl font-bold tracking-tight">
                                            Your Portfolio is Analyzed
                                        </h2>
                                        <p className="text-muted-foreground">
                                            You can now ask questions about your portfolio in the chat or export the data.
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
                            <PortfolioAnalysis 
                                onAnalysisComplete={handleAnalysisComplete} 
                            />
                            <PortfolioChat portfolioData={userPortfolioData} />
                        </div>
                </motion.div>
            </motion.div>
        </>
    );
}


export function DashboardClientPage(props: DashboardClientPageProps) {
    return (
        <MainDashboard 
            initialPortfolioData={props.portfolioData} 
            marketData={props.marketData}
            marketNews={props.marketNews}
        />
    )
}

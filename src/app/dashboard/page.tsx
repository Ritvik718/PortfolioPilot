
import { DashboardClientPage } from '@/components/dashboard/dashboard-client-page';
import { getPortfolioData } from '@/lib/portfolio-data';
import { getMagSevenData, getMarketNews } from '@/lib/market-data';

export default async function DashboardPage() {
    const portfolioData = await getPortfolioData();
    const magSevenData = await getMagSevenData();
    const marketNews = await getMarketNews();

    return (
        <DashboardClientPage 
            portfolioData={portfolioData} 
            marketData={magSevenData}
            marketNews={marketNews}
        />
    );
}

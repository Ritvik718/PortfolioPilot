
import { DashboardClientPage } from '@/components/dashboard/dashboard-client-page';
import { getPortfolioData } from '@/lib/portfolio-data';
import { getMagSevenData } from '@/lib/market-data';

export default async function DashboardPage() {
    const portfolioData = await getPortfolioData();
    const magSevenData = await getMagSevenData();
    // Transactions are now fetched on the client-side in DashboardClientPage
    // to ensure we have an authenticated user.
    const initialTransactions = []; 

    return (
        <DashboardClientPage 
            portfolioData={portfolioData} 
            initialTransactions={initialTransactions}
            marketData={magSevenData}
        />
    );
}

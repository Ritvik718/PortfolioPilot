
import { DashboardClientPage } from '@/components/dashboard/dashboard-client-page';
import { getPortfolioData } from '@/lib/portfolio-data';

export default async function DashboardPage() {
    const portfolioData = await getPortfolioData();
    // Transactions are now fetched on the client-side in DashboardClientPage
    // to ensure we have an authenticated user.
    const initialTransactions = []; 

    return (
        <DashboardClientPage portfolioData={portfolioData} initialTransactions={initialTransactions} />
    );
}

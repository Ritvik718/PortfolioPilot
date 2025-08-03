import { getPortfolioData } from '@/lib/portfolio-data';
import { DashboardClientPage } from '@/components/dashboard/dashboard-client-page';
import { getTransactions } from '@/app/actions';

export default async function DashboardPage() {
    const portfolioData = await getPortfolioData();
    const transactions = await getTransactions();

    return (
        <DashboardClientPage portfolioData={portfolioData} initialTransactions={transactions} />
    );
}

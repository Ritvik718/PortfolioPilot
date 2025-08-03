import { getPortfolioData } from '@/lib/portfolio-data';
import { DashboardClientPage } from '@/components/dashboard/dashboard-client-page';
import { getTransactions } from '@/app/actions';
import { auth } from '@/lib/firebase';
import { getCurrentUser } from '@/lib/auth';


export default async function DashboardPage() {
    const portfolioData = await getPortfolioData();
    // We can't get the user here directly in a server component with client-side auth
    // Transactions will be fetched on the client side after auth state is confirmed.
    const transactions = [];

    return (
        <DashboardClientPage portfolioData={portfolioData} initialTransactions={transactions} />
    );
}

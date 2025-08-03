import { getPortfolioData } from '@/lib/portfolio-data';
import { DashboardClientPage } from '@/components/dashboard/dashboard-client-page';

export default async function DashboardPage() {
    const portfolioData = await getPortfolioData();

    return (
        <DashboardClientPage portfolioData={portfolioData} />
    );
}

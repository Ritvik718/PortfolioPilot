import { getPortfolioData } from '@/lib/data';
import { OverviewCards } from '@/components/dashboard/overview-cards';
import { PerformanceChart } from '@/components/dashboard/performance-chart';
import { AssetList } from '@/components/dashboard/asset-list';
import { AIChatWidget } from '@/components/dashboard/ai-chat-widget';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';

export default function DashboardPage() {
  const portfolioData = getPortfolioData();

  return (
    <>
      <DashboardHeader />
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
          <OverviewCards data={portfolioData} />
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <PerformanceChart data={portfolioData.performanceHistory} />
              </div>
              <div className="flex flex-col gap-6">
                <AssetList assets={portfolioData.assets} />
                <AIChatWidget portfolioData={portfolioData} />
              </div>
          </div>
      </div>
    </>
  );
}

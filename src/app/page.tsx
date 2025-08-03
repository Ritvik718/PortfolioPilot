import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Wallet,
  Settings,
  BarChart2,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Logo } from '@/components/logo';
import { getPortfolioData } from '@/lib/data';
import { OverviewCards } from '@/components/dashboard/overview-cards';
import { PerformanceChart } from '@/components/dashboard/performance-chart';
import { AssetList } from '@/components/dashboard/asset-list';
import { AIChatWidget } from '@/components/dashboard/ai-chat-widget';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';

export default function DashboardPage() {
  const portfolioData = getPortfolioData();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton href="#" isActive>
                <LayoutDashboard />
                Dashboard
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="#">
                <Wallet />
                Assets
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="#">
                <BarChart2 />
                Reports
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="#">
                <Settings />
                Settings
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center gap-3 p-2 rounded-md transition-colors hover:bg-sidebar-accent">
            <Avatar className="h-10 w-10">
              <AvatarImage src="https://placehold.co/100x100" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden">
              <span className="font-semibold text-sm truncate">Jane Doe</span>
              <span className="text-xs text-muted-foreground truncate">
                jane.doe@example.com
              </span>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col h-full">
          <DashboardHeader />
          <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-background/50">
            <div className="grid gap-6 grid-cols-1 xl:grid-cols-3">
              <div className="xl:col-span-3">
                <OverviewCards data={portfolioData} />
              </div>
              <div className="xl:col-span-2">
                <PerformanceChart data={portfolioData.performanceHistory} />
              </div>
              <div className="flex flex-col gap-6">
                <AssetList assets={portfolioData.assets} />
                <AIChatWidget portfolioData={portfolioData} />
              </div>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

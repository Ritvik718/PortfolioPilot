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
  LogOut,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Logo } from '@/components/logo';
import { LogoutButton } from '@/components/dashboard/logout-button';


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
    <Sidebar>
        <SidebarHeader>
        <Logo />
        </SidebarHeader>
        <SidebarContent>
        <SidebarMenu>
            <SidebarMenuItem>
            <SidebarMenuButton href="/dashboard" isActive tooltip="Dashboard">
                <LayoutDashboard />
                <span>Dashboard</span>
            </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
            <SidebarMenuButton href="/dashboard/assets" tooltip="Assets">
                <Wallet />
                <span>Assets</span>
            </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
            <SidebarMenuButton href="/dashboard/reports" tooltip="Reports">
                <BarChart2 />
                <span>Reports</span>
            </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
            <SidebarMenuButton href="/dashboard/settings" tooltip="Settings">
                <Settings />
                <span>Settings</span>
            </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
        <SidebarMenu>
            <SidebarMenuItem>
                <LogoutButton />
            </SidebarMenuItem>
        </SidebarMenu>
        <div className="flex items-center gap-3 p-2 rounded-md transition-colors">
            <Avatar className="h-10 w-10">
            <AvatarImage src="https://placehold.co/100x100" data-ai-hint="avatar" />
            <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden group-data-[collapsible=icon]:hidden">
            <span className="font-semibold text-sm truncate">Jane Doe</span>
            <span className="text-xs text-muted-foreground truncate">
                jane.doe@example.com
            </span>
            </div>
        </div>
        </SidebarFooter>
    </Sidebar>
    <SidebarInset>
        {children}
    </SidebarInset>
    </SidebarProvider>
  );
}

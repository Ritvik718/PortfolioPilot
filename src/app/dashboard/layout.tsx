
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
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
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Logo } from '@/components/logo';
import { LogoutButton } from '@/components/dashboard/logout-button';
import { Skeleton } from '@/components/ui/skeleton';

function AuthWrapper({ children }: { children: React.ReactNode }) {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [userData, setUserData] = React.useState<{
    displayName: string | null;
    email: string | null;
  } | null>(null);

  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (user) {
       // A simple way to get user info, can be expanded to fetch from firestore
        const name = user.displayName || user.email?.split('@')[0] || 'User';
        const email = user.email;
        setUserData({ displayName: name, email: email });
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <Logo />
            <Skeleton className="h-8 w-48" />
        </div>
      </div>
    );
  }

  if (!user) {
    // This will be caught by the useEffect above, but as a fallback,
    // we can show a loader while redirecting.
    return (
         <div className="flex h-screen w-screen items-center justify-center">
             <div className="flex flex-col items-center gap-4">
                <Logo />
                <p>Redirecting to login...</p>
             </div>
        </div>
    )
  }

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
              <AvatarFallback>{userData?.displayName?.charAt(0).toUpperCase() ?? 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden group-data-[collapsible=icon]:hidden">
              <span className="font-semibold text-sm truncate">{userData?.displayName}</span>
              <span className="text-xs text-muted-foreground truncate">
                {userData?.email}
              </span>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthWrapper>
      {children}
    </AuthWrapper>
  );
}

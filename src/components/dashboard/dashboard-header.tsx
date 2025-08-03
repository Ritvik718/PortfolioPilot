
'use client';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  LayoutDashboard,
  Wallet,
  Settings,
  BarChart2,
  PanelLeft,
  FileDown,
} from 'lucide-react';
import { Logo } from '../logo';
import Link from 'next/link';

export function DashboardHeader() {
  const handleExport = () => {
    // This is a placeholder for a client-side function
    console.log('Exporting data...');
  };

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-4 md:px-6 sticky top-0 z-30">
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                    <PanelLeft className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
                <nav className="grid gap-2 text-lg font-medium">
                    <Link href="#" className="flex items-center gap-2 text-lg font-semibold mb-4">
                        <Logo />
                    </Link>
                    <Link href="/dashboard" className="mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground">
                        <LayoutDashboard className="h-5 w-5" />
                        Dashboard
                    </Link>
                    <Link href="/dashboard/assets" className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground">
                        <Wallet className="h-5 w-5" />
                        Assets
                    </Link>
                    <Link href="/dashboard/reports" className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground">
                        <BarChart2 className="h-5 w-5" />
                        Reports
                    </Link>
                    <Link href="/dashboard/settings" className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground">
                        <Settings className="h-5 w-5" />
                        Settings
                    </Link>
                </nav>
            </SheetContent>
        </Sheet>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
            <h1 className="text-2xl font-headline font-semibold hidden md:block">Dashboard</h1>
            <div className="ml-auto flex-1 sm:flex-initial">
              {/* Future search bar can go here */}
            </div>
            <Button variant="default" size="sm" onClick={handleExport}>
                <FileDown className="mr-2 h-4 w-4" />
                Export
            </Button>
        </div>
    </header>
  );
}

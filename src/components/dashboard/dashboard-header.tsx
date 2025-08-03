
'use client';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  LayoutDashboard,
  PanelLeft,
  FileDown,
} from 'lucide-react';
import { Logo } from '../logo';
import Link from 'next/link';
import { StockSearch } from './stock-search';

type DashboardHeaderProps = {
  onExport: () => void;
};

export function DashboardHeader({ onExport }: DashboardHeaderProps) {
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
                </nav>
            </SheetContent>
        </Sheet>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
            <h1 className="text-2xl font-headline font-semibold hidden md:block">Dashboard</h1>
            <div className="ml-auto flex-1 sm:flex-initial">
              <StockSearch />
            </div>
            <Button variant="default" size="sm" onClick={onExport}>
                <FileDown className="mr-2 h-4 w-4" />
                Export
            </Button>
        </div>
    </header>
  );
}

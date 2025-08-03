'use client';

import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { FileDown, PlusCircle } from 'lucide-react';

export function DashboardHeader() {
  const handleExport = () => {
    // This is a placeholder for a client-side function
    console.log('Exporting data...');
  };

  return (
    <header className="flex items-center justify-between p-4 border-b bg-card/50">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
        <h1 className="text-2xl font-headline font-semibold">Dashboard</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Transaction
        </Button>
        <Button variant="default" size="sm" onClick={handleExport}>
          <FileDown className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>
    </header>
  );
}

import { Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';

type LogoProps = {
  className?: string;
};

export function Logo({ className }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="bg-primary text-primary-foreground p-2 rounded-md">
        <Rocket className="h-6 w-6" />
      </div>
      <span className="text-2xl font-bold font-headline text-primary-dark">
        PortfolioPilot
      </span>
    </div>
  );
}

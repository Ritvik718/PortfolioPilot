'use client';

import { Rocket } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type LogoProps = {
  className?: string;
};

export function Logo({ className }: LogoProps) {
  return (
    <motion.div
      className={cn('flex items-center gap-2', className)}
      whileHover={{
        rotate: [0, -5, 5, -5, 0],
        transition: { duration: 0.4 },
      }}
    >
      <div className="bg-primary text-primary-foreground p-2 rounded-md">
        <Rocket className="h-6 w-6" />
      </div>
      <span className="text-xl font-bold font-headline">
        PortfolioPilot
      </span>
    </motion.div>
  );
}

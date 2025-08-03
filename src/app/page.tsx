
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { AreaChart } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

const floatingItemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: ["0%", "-1.5%", "0%"],
        opacity: 1,
        transition: {
            y: {
                duration: 5,
                repeat: Infinity,
                ease: 'easeInOut'
            },
            opacity: {
                duration: 0.6,
                ease: 'easeOut'
            }
        }
    }
}


export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link href="#" className="flex items-center justify-center">
          <Logo />
          <span className="sr-only">PortfolioPilot</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            href="/login"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Register
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="relative w-full py-24 md:py-32 lg:py-40 xl:py-48 overflow-hidden">
           <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] -z-10" />

          <div className="container px-4 md:px-6">
            <motion.div 
              className="flex flex-col items-center space-y-6 text-center"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="space-y-4">
                 <motion.h1 
                  className="text-4xl font-bold font-headline tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none"
                  variants={floatingItemVariants}
                >
                  AI-Powered Portfolio Tracking
                </motion.h1>
                <motion.p 
                  className="mx-auto max-w-[700px] text-muted-foreground md:text-xl"
                  variants={floatingItemVariants}
                >
                  Unlock deep insights, analyze your assets, and chat with an AI that understands your financial data.
                </motion.p>
              </div>
              <motion.div className="space-x-4" variants={itemVariants}>
                <Link href="/dashboard">
                  <Button size="lg">Get Started</Button>
                </Link>
              </motion.div>
            </motion.div>
             <motion.div
                className="relative mt-20"
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ 
                    opacity: 1, 
                    y: ["0%", "-2%", "0%"], 
                    scale: 1 
                }}
                transition={{ 
                    opacity: { duration: 0.8, delay: 0.6, ease: "anticipate" },
                    y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                    scale: { duration: 0.8, delay: 0.6, ease: "anticipate" }
                }}
            >
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[150%] h-2/3 bg-primary/20 blur-3xl" />
                <div className="max-w-3xl mx-auto p-1 rounded-2xl bg-white/10 backdrop-blur-md shadow-2xl shadow-primary/10 border border-white/10">
                     <div className="p-8 rounded-lg bg-background/80">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Portfolio Value</p>
                                <p className="text-2xl font-bold">$1,234,567.89</p>
                            </div>
                            <AreaChart className="h-8 w-8 text-primary" />
                        </div>
                        <div className="mt-6 h-24 w-full rounded-md bg-muted/50 flex items-end p-2">
                             <motion.div
                                className="w-full h-full flex items-end gap-1"
                                initial="hidden"
                                animate="visible"
                                transition={{ staggerChildren: 0.1, delayChildren: 0.8 }}
                            >
                                {[40, 60, 50, 75, 65, 85, 90].map((h, i) => (
                                    <motion.div
                                        key={i}
                                        className="w-full bg-primary/50 rounded-t-sm"
                                        variants={{
                                            hidden: { y: 20, opacity: 0 },
                                            visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
                                        }}
                                        style={{ height: `${h}%` }}
                                    />
                                ))}
                            </motion.div>
                        </div>
                     </div>
                </div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}

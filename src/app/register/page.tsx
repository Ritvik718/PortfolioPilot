
'use client';

import Link from 'next/link';
import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { register } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const initialState = {
  message: '',
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className="w-full" aria-disabled={pending}>
            {pending ? 'Creating account...' : 'Create an account'}
        </Button>
    );
}

export default function RegisterPage() {
  const [state, formAction] = useActionState(register, initialState);
  const { toast } = useToast();
  const router = useRouter();
  
  useEffect(() => {
    if (state?.message) {
        if (state.message.includes('successful')) {
             toast({
                title: 'Registration Successful',
                description: "You can now log in with your credentials.",
            });
            router.push('/login');
        } else {
            toast({
                variant: 'destructive',
                title: 'Registration Failed',
                description: state.message,
            });
        }
    }
  }, [state, toast, router]);


  return (
    <div className="flex items-center justify-center min-h-screen py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ 
            opacity: 1, 
            scale: 1, 
            y: ["0%", "-1.5%", "0%"]
        }}
        transition={{ 
             opacity: { duration: 0.5 },
             scale: { duration: 0.5 },
             y: {
                duration: 5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.5
            }
        }}
      >
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-xl">Sign Up</CardTitle>
            <CardDescription>
              Enter your information to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input id="firstName" name="firstName" placeholder="Max" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input id="lastName" name="lastName" placeholder="Robinson" required />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required />
              </div>
              <SubmitButton />
            </form>
            <div className="mt-4 text-center text-sm">
              Already have an account?{' '}
              <Link href="/login" className="underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
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
import { login } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const initialState = {
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" aria-disabled={pending}>
      {pending ? 'Logging in...' : 'Login'}
    </Button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useActionState(login, initialState);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (state.message === 'Login successful') {
      toast({
        title: 'Login Successful',
        description: 'Welcome back!',
      });
      router.push('/dashboard');
    } else if (state.message) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: state.message,
      });
    }
  }, [state.message, toast, router]);


  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="grid gap-4">
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
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="#"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input id="password" name="password" type="password" required />
            </div>
            <SubmitButton />
             {state.message && state.message !== 'Login successful' && (
              <p className="text-sm font-medium text-destructive">{state.message}</p>
            )}
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

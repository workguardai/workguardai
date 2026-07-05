'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { useToast } from '@/providers/ToastProvider';
import { Button } from '@/components/ui/Button';
import { Field, inputClass } from '@/components/ui/Field';
import { AuthShell } from '@/components/app/AuthShell';
import { GoogleAuthButton } from '@/components/app/GoogleAuthButton';
import { AuthDivider } from '@/components/app/AuthDivider';

export function LoginScreen() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  // Google OAuth failures redirect back here with an ?error flag.
  useEffect(() => {
    if (searchParams.get('error')) {
      toast({
        type: 'error',
        title: 'Google sign-in failed',
        description: 'We could not complete Google sign-in. Please try again or use your email.',
      });
    }
  }, [searchParams, toast]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        toast({
          type: 'error',
          title: 'Could not sign you in',
          description: json?.error?.message ?? 'Check your email and password and try again.',
        });
        return;
      }
      const redirect = searchParams.get('redirect');
      const safe = redirect && redirect.startsWith('/') && !redirect.startsWith('//') ? redirect : '/dashboard';
      router.push(safe);
    } catch {
      toast({ type: 'error', title: 'Something went wrong', description: 'Please try again in a moment.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Log in to WorkGuard AI"
      subtitle="Access your construction monitoring dashboard."
      footer={
        <>
          Need access?{' '}
          <Link href="/contact" className="font-medium text-accent hover:underline">
            Request a pilot
          </Link>
        </>
      }
    >
      <GoogleAuthButton />
      <AuthDivider />
      <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
        <Field label="Email" htmlFor="email">
          <input
            id="email"
            type="email"
            autoComplete="email"
            className={inputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
          />
        </Field>
        <Field label="Password" htmlFor="password">
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            className={inputClass}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
          />
        </Field>
        <Button type="submit" size="lg" isLoading={loading} className="w-full">
          Log in
        </Button>
      </form>
    </AuthShell>
  );
}

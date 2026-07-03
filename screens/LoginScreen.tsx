'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useToast } from '@/providers/ToastProvider';
import { Button } from '@/components/ui/Button';
import { Field, inputClass } from '@/components/ui/Field';
import { AuthShell } from '@/components/app/AuthShell';

export function LoginScreen() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

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
      router.push('/dashboard');
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

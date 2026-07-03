'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useToast } from '@/providers/ToastProvider';
import { Button } from '@/components/ui/Button';
import { Field, inputClass } from '@/components/ui/Field';
import { AuthShell } from '@/components/app/AuthShell';

export function SignupScreen() {
  const router = useRouter();
  const { toast } = useToast();
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (form.password.length < 8) {
      toast({ type: 'error', title: 'Password too short', description: 'Use at least 8 characters.' });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        toast({
          type: 'error',
          title: 'Could not create your account',
          description: json?.error?.message ?? 'Please check your details and try again.',
        });
        return;
      }
      if (json.data?.emailConfirmationRequired) {
        toast({ type: 'success', title: 'Check your inbox', description: 'Confirm your email to finish setting up.' });
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
      title="Create your account"
      subtitle="Start monitoring your sites with WorkGuard AI."
      footer={
        <>
          Already have access?{' '}
          <Link href="/login" className="font-medium text-accent hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
        <Field label="Full name" htmlFor="fullName">
          <input
            id="fullName"
            autoComplete="name"
            className={inputClass}
            value={form.fullName}
            onChange={(e) => set('fullName', e.target.value)}
            placeholder="Jaana Virtanen"
          />
        </Field>
        <Field label="Work email" htmlFor="email">
          <input
            id="email"
            type="email"
            autoComplete="email"
            className={inputClass}
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            placeholder="name@company.com"
          />
        </Field>
        <Field label="Password" htmlFor="password">
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            className={inputClass}
            value={form.password}
            onChange={(e) => set('password', e.target.value)}
            placeholder="At least 8 characters"
          />
        </Field>
        <Button type="submit" size="lg" isLoading={loading} className="w-full">
          Create account
        </Button>
      </form>
    </AuthShell>
  );
}

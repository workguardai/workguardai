'use client';

/** Footer newsletter capture. Label above input; inline validation via toast. */
import { useState, type FormEvent } from 'react';

import { useToast } from '@/providers/ToastProvider';
import { Button } from '@/components/ui/Button';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function NewsletterForm() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) {
      toast({
        type: 'error',
        title: 'That email does not look right',
        description: 'Please enter a valid address like name@company.com.',
      });
      return;
    }
    toast({ type: 'success', title: 'You are on the list', description: 'We will be in touch with updates.' });
    setEmail('');
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2" noValidate>
      <label htmlFor="newsletter-email" className="text-small font-medium text-ink">
        Get product updates
      </label>
      <div className="flex gap-2">
        <input
          id="newsletter-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@company.com"
          className="h-11 w-full rounded-full border border-line bg-raised px-4 text-small text-ink outline-none transition-colors placeholder:text-ink-muted focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/40"
        />
        <Button type="submit" size="md">
          Subscribe
        </Button>
      </div>
    </form>
  );
}

'use client';

/** Early-access / contact form. Labels above inputs; inline validation via toast. */
import { useState, type FormEvent } from 'react';

import { useToast } from '@/providers/ToastProvider';
import { Button } from '@/components/ui/Button';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INDUSTRIES = [
  'Construction',
  'Infrastructure / Civil engineering',
  'Utilities / Energy',
  'Logistics / Fleet',
  'Medical / Healthcare',
  'Other',
];

const inputClass =
  'h-11 w-full rounded-lg border border-line bg-raised px-3.5 text-body text-ink outline-none ' +
  'transition-colors placeholder:text-ink-muted focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/40';

export function ContactForm() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', company: '', industry: '', message: '' });

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (form.name.trim().length < 2) {
      toast({ type: 'error', title: 'Please add your name', description: 'We like to know who we are talking to.' });
      return;
    }
    if (!EMAIL_RE.test(form.email)) {
      toast({ type: 'error', title: 'That email does not look right', description: 'Use a valid work email like name@company.com.' });
      return;
    }
    toast({
      type: 'success',
      title: 'Request received',
      description: 'The team will be in touch within one business day.',
    });
    setForm({ name: '', email: '', company: '', industry: '', message: '' });
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" htmlFor="name">
          <input id="name" className={inputClass} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Jaana Virtanen" />
        </Field>
        <Field label="Work email" htmlFor="email">
          <input id="email" type="email" className={inputClass} value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="name@company.com" />
        </Field>
        <Field label="Company" htmlFor="company">
          <input id="company" className={inputClass} value={form.company} onChange={(e) => set('company', e.target.value)} placeholder="ANK Construction" />
        </Field>
        <Field label="Industry" htmlFor="industry">
          <select id="industry" className={inputClass} value={form.industry} onChange={(e) => set('industry', e.target.value)}>
            <option value="">Select your sector</option>
            {INDUSTRIES.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Tell us about your project" htmlFor="message">
        <textarea
          id="message"
          rows={4}
          className={inputClass.replace('h-11', 'min-h-28 py-3')}
          value={form.message}
          onChange={(e) => set('message', e.target.value)}
          placeholder="How many sites do you manage, and what slows your reporting down today?"
        />
      </Field>
      <div>
        <Button type="submit" size="lg">
          Send request
        </Button>
      </div>
    </form>
  );
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="text-small font-medium text-ink">
        {label}
      </label>
      {children}
    </div>
  );
}

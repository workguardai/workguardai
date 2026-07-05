'use client';

/** Shared loading / empty / error states for data-backed app screens. */
import type { ComponentType, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/Button';

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-md bg-sunken', className)} />;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-dashed border-line-strong bg-raised px-8 py-16 text-center">
      <span className="mx-auto grid size-12 place-items-center rounded-xl bg-accent-soft text-accent">
        <Icon className="size-6" />
      </span>
      <h2 className="mt-5 text-h4 font-semibold text-ink">{title}</h2>
      <p className="mx-auto mt-2 max-w-sm text-body text-ink-soft">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div
      role="alert"
      className="mx-auto max-w-lg rounded-2xl border border-danger/30 bg-danger-soft/40 px-8 py-12 text-center"
    >
      <span className="mx-auto grid size-12 place-items-center rounded-xl bg-danger-soft text-danger">
        <AlertCircle className="size-6" aria-hidden />
      </span>
      <h2 className="mt-5 text-h4 font-semibold text-ink">Could not load this</h2>
      <p className="mx-auto mt-2 max-w-sm text-body text-ink-soft">{message}</p>
      {onRetry ? (
        <Button variant="secondary" size="md" className="mt-6" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  );
}

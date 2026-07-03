/**
 * Pure button class composition (no 'use client'), so both server and client
 * components can style a <button>, <Link>, or <a> as a button.
 */
import { cn } from '@/lib/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap ' +
  'transition-all duration-200 outline-none select-none ' +
  'focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas ' +
  'disabled:opacity-55 disabled:pointer-events-none';

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-accent text-accent-ink shadow-subtle hover:bg-accent-hover hover:shadow-raised active:scale-[0.98]',
  secondary:
    'bg-raised text-ink border border-line hover:border-line-strong hover:bg-sunken active:scale-[0.98]',
  ghost: 'bg-transparent text-ink hover:bg-sunken active:scale-[0.98]',
  danger: 'bg-danger text-white hover:brightness-95 active:scale-[0.98]',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-small',
  md: 'h-11 px-6 text-body',
  lg: 'h-14 px-8 text-body-lg',
};

/** Withdrawn/inactive action — overrides variant visuals and blocks interaction. */
const cancelledClasses =
  'border border-dashed border-line-strong bg-sunken text-ink-muted line-through ' +
  'shadow-none pointer-events-none hover:bg-sunken';

export function buttonClasses(opts?: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  cancelled?: boolean;
  className?: string;
}): string {
  const { variant = 'primary', size = 'md', cancelled = false, className } = opts ?? {};
  return cn(base, variants[variant], sizes[size], cancelled && cancelledClasses, className);
}

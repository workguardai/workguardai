import type { ReactNode } from 'react';
import Link from 'next/link';

/** Centered layout for auth screens (login, signup). */
export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <main className="grid min-h-[100dvh] place-items-center px-6 py-16">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight text-ink">
          <span
            className="grid size-7 place-items-center rounded-md bg-accent text-caption font-bold text-accent-ink"
            aria-hidden
          >
            W
          </span>
          WorkGuard&nbsp;AI
        </Link>
        <h1 className="mt-8 text-h2 font-bold text-ink">{title}</h1>
        <p className="mt-2 text-body text-ink-soft">{subtitle}</p>
        <div className="mt-8">{children}</div>
        <div className="mt-6 text-small text-ink-soft">{footer}</div>
      </div>
    </main>
  );
}

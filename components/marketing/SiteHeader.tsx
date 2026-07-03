'use client';

/**
 * Marketing site header. Single-line desktop nav (<= 72px tall), sticky with a
 * translucent backdrop; collapses to a hamburger sheet under lg. One accent,
 * one CTA intent ("Request access").
 */
import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, X } from 'lucide-react';

import { buttonClasses } from '@/components/ui/buttonClasses';

const NAV_LINKS = [
  { label: 'How it works', href: '/how-it-works' },
  { label: 'Features', href: '/features' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-canvas/80 backdrop-blur-md">
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-6 px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight text-ink">
          <span
            className="grid size-7 place-items-center rounded-md bg-accent text-caption font-bold text-accent-ink"
            aria-hidden
          >
            W
          </span>
          WorkGuard&nbsp;AI
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-small font-medium text-ink-soft transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link href="/login" className={buttonClasses({ variant: 'ghost', size: 'sm' })}>
            Log in
          </Link>
          <Link href="/contact" className={buttonClasses({ size: 'sm' })}>
            Request access
          </Link>
        </div>

        <button
          type="button"
          className="grid size-10 place-items-center rounded-md text-ink lg:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden border-t border-line bg-canvas lg:hidden"
          >
            <nav className="flex flex-col gap-1 px-6 py-4" aria-label="Mobile">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-2 py-3 text-body font-medium text-ink-soft transition-colors hover:bg-sunken hover:text-ink"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-3 flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className={buttonClasses({ variant: 'secondary', size: 'md' })}
                >
                  Log in
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className={buttonClasses({ size: 'md' })}
                >
                  Request access
                </Link>
              </div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

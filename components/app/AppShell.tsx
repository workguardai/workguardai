'use client';

/** Authenticated app frame: sidebar nav + top bar. Drawer sidebar on mobile. */
import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Building2, Bell, Settings, Menu, X, LogOut } from 'lucide-react';

import { cn } from '@/lib/cn';
import { useConfirm } from '@/providers/ConfirmProvider';
import { NotificationsBell } from './NotificationsBell';

const NAV = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Sites', href: '/sites', icon: Building2 },
  { label: 'Alerts', href: '/alerts', icon: Bell },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export function AppShell({ title, children }: { title: string; children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const confirm = useConfirm();
  const [open, setOpen] = useState(false);

  async function logout() {
    const ok = await confirm({
      title: 'Log out of WorkGuard AI?',
      description: 'You will need to sign in again to get back to your dashboard.',
      confirmLabel: 'Log out',
      cancelLabel: 'Stay signed in',
    });
    if (!ok) return;
    setOpen(false);
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    router.push('/login');
  }

  const nav = (
    <nav className="flex flex-col gap-1" aria-label="Workspace">
      {NAV.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-small font-medium transition-colors',
              active ? 'bg-accent-soft text-accent' : 'text-ink-soft hover:bg-sunken hover:text-ink',
            )}
          >
            <item.icon className="size-4" aria-hidden />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-[100dvh] lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="hidden border-r border-line bg-raised p-4 lg:flex lg:flex-col">
        <Link href="/" className="flex items-center gap-2 px-2 py-2 font-semibold tracking-tight text-ink">
          <span className="grid size-7 place-items-center rounded-md bg-accent text-caption font-bold text-accent-ink" aria-hidden>
            W
          </span>
          WorkGuard&nbsp;AI
        </Link>
        <div className="mt-6 flex-1">{nav}</div>
        <button
          type="button"
          onClick={logout}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-small font-medium text-ink-soft transition-colors hover:bg-sunken hover:text-ink"
        >
          <LogOut className="size-4" aria-hidden />
          Log out
        </button>
      </aside>

      <div className="flex flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-canvas/85 px-6 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="grid size-9 place-items-center rounded-md text-ink lg:hidden"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
            >
              <Menu className="size-5" />
            </button>
            <h1 className="text-body-lg font-semibold text-ink">{title}</h1>
          </div>
          <NotificationsBell />
        </header>

        <div className="flex-1 px-6 py-8">{children}</div>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-overlay/50" onClick={() => setOpen(false)} aria-hidden />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col border-r border-line bg-raised p-4">
            <div className="flex items-center justify-between px-2 py-2">
              <span className="font-semibold text-ink">WorkGuard AI</span>
              <button type="button" aria-label="Close menu" onClick={() => setOpen(false)}>
                <X className="size-5 text-ink" />
              </button>
            </div>
            <div className="mt-4 flex-1">{nav}</div>
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-small font-medium text-ink-soft hover:bg-sunken hover:text-ink"
            >
              <LogOut className="size-4" aria-hidden />
              Log out
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

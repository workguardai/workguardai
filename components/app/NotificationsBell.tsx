'use client';

/** Topbar notifications bell: unread count badge + a dropdown of recent items. */
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Bell } from 'lucide-react';

import { cn } from '@/lib/cn';
import { useGetNotificationsQuery } from '@/store/api';

export function NotificationsBell() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { data, isLoading } = useGetNotificationsQuery();

  const items = data ?? [];
  const unread = items.filter((n) => n.status === 'UNREAD').length;

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}
        aria-expanded={open}
        className="relative grid size-9 place-items-center rounded-md text-ink-soft transition-colors hover:bg-sunken hover:text-ink"
      >
        <Bell className="size-5" aria-hidden />
        {unread > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 grid min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-ink">
            {unread > 9 ? '9+' : unread}
          </span>
        ) : null}
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-11 z-40 w-80 overflow-hidden rounded-xl border border-line bg-raised shadow-overlay"
          >
            <div className="border-b border-line px-4 py-3">
              <p className="text-small font-semibold text-ink">Notifications</p>
            </div>
            {isLoading ? (
              <p className="px-4 py-6 text-center text-small text-ink-muted">Loading...</p>
            ) : items.length === 0 ? (
              <p className="px-4 py-8 text-center text-small text-ink-muted">You are all caught up.</p>
            ) : (
              <ul className="max-h-96 divide-y divide-line overflow-y-auto">
                {items.map((n) => (
                  <li key={n.id} className={cn('px-4 py-3', n.status === 'UNREAD' && 'bg-accent-soft/40')}>
                    <div className="flex items-start gap-2">
                      {n.status === 'UNREAD' ? (
                        <span className="mt-1.5 size-2 shrink-0 rounded-full bg-accent" aria-hidden />
                      ) : (
                        <span className="mt-1.5 size-2 shrink-0" aria-hidden />
                      )}
                      <div className="min-w-0">
                        <p className="text-small font-medium text-ink">{n.title}</p>
                        <p className="mt-0.5 text-caption text-ink-soft">{n.body}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

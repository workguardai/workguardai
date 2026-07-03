/**
 * Toast notification system (Rules_UI #1).
 *
 * One consistent channel for transient feedback: typed (success/error/warning/
 * info) with icons, auto-dismiss (errors persist until dismissed), manual close,
 * clean stacking, fixed bottom-right, ARIA live regions, and pause-on-hover.
 *
 * Usage: const { toast } = useToast(); toast({ type: 'success', title: 'Saved' });
 */
'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

import { cn } from '@/lib/cn';

type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastOptions {
  type?: ToastType;
  title: string;
  description?: string;
  /** ms before auto-dismiss. Omit for type default; use `Infinity` to persist. */
  duration?: number;
}

interface ToastRecord extends Required<Omit<ToastOptions, 'duration'>> {
  id: string;
  duration: number;
}

interface ToastContextValue {
  toast: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const DEFAULT_DURATION: Record<ToastType, number> = {
  success: 4000,
  info: 4000,
  warning: 6000,
  error: Infinity, // persist until dismissed
};

const ICONS: Record<ToastType, typeof Info> = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const ACCENT: Record<ToastType, string> = {
  success: 'text-success',
  error: 'text-danger',
  warning: 'text-warning',
  info: 'text-info',
};

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
  const [paused, setPaused] = useState(false);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((options: ToastOptions) => {
    const type = options.type ?? 'info';
    const id = crypto.randomUUID();
    setToasts((prev) => [
      ...prev,
      {
        id,
        type,
        title: options.title,
        description: options.description ?? '',
        duration: options.duration ?? DEFAULT_DURATION[type],
      },
    ]);
    return id;
  }, []);

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-label="Notifications"
        className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-[min(92vw,380px)] flex-col gap-3"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <AnimatePresence initial={false}>
          {toasts.map((t) => (
            <ToastItem key={t.id} toast={t} paused={paused} onDismiss={dismiss} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({
  toast,
  paused,
  onDismiss,
}: {
  toast: ToastRecord;
  paused: boolean;
  onDismiss: (id: string) => void;
}) {
  const Icon = ICONS[toast.type];
  const remaining = useRef(toast.duration);
  const startedAt = useRef(0);

  useEffect(() => {
    if (!Number.isFinite(remaining.current)) return;
    if (paused) return;

    startedAt.current = Date.now();
    const timer = setTimeout(() => onDismiss(toast.id), remaining.current);
    return () => {
      clearTimeout(timer);
      remaining.current -= Date.now() - startedAt.current;
    };
  }, [paused, toast.id, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 24, scale: 0.96 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      role={toast.type === 'error' || toast.type === 'warning' ? 'alert' : 'status'}
      aria-live={toast.type === 'error' || toast.type === 'warning' ? 'assertive' : 'polite'}
      className="pointer-events-auto flex items-start gap-3 rounded-lg border border-line bg-raised p-4 shadow-overlay"
    >
      <Icon className={cn('mt-0.5 size-5 shrink-0', ACCENT[toast.type])} aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="text-small font-semibold text-ink">{toast.title}</p>
        {toast.description ? (
          <p className="mt-0.5 text-small text-ink-soft">{toast.description}</p>
        ) : null}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        className="-m-1 shrink-0 rounded-md p-1 text-ink-muted transition-colors hover:bg-sunken hover:text-ink"
      >
        <X className="size-4" aria-hidden />
      </button>
    </motion.div>
  );
}

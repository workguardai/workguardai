import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

/** Standard page gutter + max width for marketing sections. */
export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('mx-auto max-w-7xl px-6', className)}>{children}</div>;
}

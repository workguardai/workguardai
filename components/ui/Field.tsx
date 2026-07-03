import type { ReactNode } from 'react';

/** Shared input styling + labelled field wrapper (label above input, per Rules_UI). */
export const inputClass =
  'h-11 w-full rounded-lg border border-line bg-raised px-3.5 text-body text-ink outline-none ' +
  'transition-colors placeholder:text-ink-muted focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/40';

export function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="text-small font-medium text-ink">
        {label}
      </label>
      {children}
    </div>
  );
}

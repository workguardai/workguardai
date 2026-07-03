/**
 * Class-name merge helper.
 *
 * `cn()` composes conditional class names (clsx) and resolves Tailwind conflicts
 * (tailwind-merge) so the last utility wins. Use everywhere class names are built.
 */
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

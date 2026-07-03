/**
 * Button — the core interactive primitive.
 *
 * Implements all five required states: enabled, hover, focus (visible ring),
 * disabled, and `cancelled` (a withdrawn/inactive action — muted, dashed,
 * struck-through). `isLoading` shows a spinner and blocks interaction.
 *
 * Class composition lives in ./buttonClasses (a pure module) so server
 * components can style links as buttons too.
 */
'use client';

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

import { buttonClasses, type ButtonVariant, type ButtonSize } from './buttonClasses';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  cancelled?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    isLoading = false,
    cancelled = false,
    iconLeft,
    iconRight,
    disabled,
    className,
    children,
    ...props
  },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      data-cancelled={cancelled || undefined}
      aria-disabled={disabled || isLoading || cancelled || undefined}
      className={buttonClasses({ variant, size, cancelled, className })}
      {...props}
    >
      {isLoading ? <Loader2 className="size-4 animate-spin" aria-hidden /> : iconLeft}
      {children}
      {!isLoading && iconRight}
    </button>
  );
});

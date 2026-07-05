import { buttonClasses } from '@/components/ui/buttonClasses';

/**
 * "Continue with Google" — a plain link to the OAuth start endpoint (a browser
 * redirect flow, not a fetch). The endpoint bounces to Google and back through
 * /api/auth/callback, which sets the session cookies.
 */
export function GoogleAuthButton({ label = 'Continue with Google' }: { label?: string }) {
  return (
    <a href="/api/auth/google" className={buttonClasses({ variant: 'secondary', size: 'lg', className: 'w-full' })}>
      <GoogleMark />
      {label}
    </a>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden focusable="false">
      <path
        fill="#4285F4"
        d="M23.06 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h6.19a5.3 5.3 0 0 1-2.3 3.48v2.89h3.72c2.18-2 3.45-4.96 3.45-8.38Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.12 0 5.74-1.03 7.65-2.8l-3.72-2.89c-1.03.69-2.36 1.1-3.93 1.1-3.02 0-5.58-2.04-6.5-4.79H1.65v3A11.99 11.99 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.5 14.62a7.2 7.2 0 0 1 0-4.6V7H1.65a12 12 0 0 0 0 10.62l3.85-3Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.7 0 3.22.58 4.42 1.72l3.3-3.3C17.73 1.2 15.12 0 12 0 7.34 0 3.24 2.67 1.65 6.62l3.85 3C6.42 6.8 8.98 4.75 12 4.75Z"
      />
    </svg>
  );
}

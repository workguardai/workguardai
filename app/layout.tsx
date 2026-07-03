import type { Metadata } from 'next';
import './globals.css';
import { fontSans, fontSerif, fontMono } from './fonts';
import { cn } from '@/lib/cn';
import { Providers } from '@/providers/Providers';

/**
 * Root layout. Applies self-hosted font variables, sets the document language,
 * and defines the site-wide title template so every route gets a unique,
 * descriptive `<title>` (pattern: "Page — WorkGuard AI").
 */
export const metadata: Metadata = {
  metadataBase: new URL('https://workguardai.com'),
  title: {
    default: 'WorkGuard AI - construction site monitoring and progress tracking',
    template: '%s - WorkGuard AI',
  },
  description:
    'WorkGuard AI turns your construction drawings into a live site model, then tracks real progress against plan automatically, catching delays before they cost you.',
  applicationName: 'WorkGuard AI',
  openGraph: {
    type: 'website',
    siteName: 'WorkGuard AI',
    locale: 'en',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={cn(fontSans.variable, fontSerif.variable, fontMono.variable)}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

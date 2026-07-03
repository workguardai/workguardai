/**
 * Typography — self-hosted via next/font (no external requests at runtime).
 *
 *  - Sans  (Space Grotesk): geometric display + UI + body.
 *  - Serif (Fraunces): high-contrast editorial accents for storytelling lines.
 *  - Mono  (JetBrains Mono): code / technical labels (DWG, tokens).
 *
 * Exposed as CSS variables (--font-sans/-serif/-mono) consumed by the Tailwind
 * theme in globals.css. Swapping a family later is a change here only.
 */
import { Space_Grotesk, Fraunces, JetBrains_Mono } from 'next/font/google';

export const fontSans = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const fontSerif = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-serif',
  axes: ['opsz'],
});

export const fontMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

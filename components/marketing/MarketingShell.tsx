import type { ReactNode } from 'react';

import { SiteHeader } from './SiteHeader';
import { SiteFooter } from './SiteFooter';

/** Header + footer wrapper for every marketing page. */
export function MarketingShell({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </>
  );
}

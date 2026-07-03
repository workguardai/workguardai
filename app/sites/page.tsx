import type { Metadata } from 'next';

import { SitesScreen } from '@/screens/SitesScreen';

export const metadata: Metadata = {
  title: 'Sites',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <SitesScreen />;
}

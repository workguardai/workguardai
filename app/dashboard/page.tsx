import type { Metadata } from 'next';

import { DashboardScreen } from '@/screens/DashboardScreen';

export const metadata: Metadata = {
  title: 'Dashboard',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <DashboardScreen />;
}

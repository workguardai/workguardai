import type { Metadata } from 'next';

import { AlertsScreen } from '@/screens/AlertsScreen';

export const metadata: Metadata = {
  title: 'Alerts',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <AlertsScreen />;
}

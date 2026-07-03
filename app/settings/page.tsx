import type { Metadata } from 'next';

import { SettingsScreen } from '@/screens/SettingsScreen';

export const metadata: Metadata = {
  title: 'Settings',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <SettingsScreen />;
}

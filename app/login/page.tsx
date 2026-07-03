import type { Metadata } from 'next';

import { LoginScreen } from '@/screens/LoginScreen';

export const metadata: Metadata = {
  title: 'Log in',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <LoginScreen />;
}

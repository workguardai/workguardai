import type { Metadata } from 'next';

import { SignupScreen } from '@/screens/SignupScreen';

export const metadata: Metadata = {
  title: 'Create account',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <SignupScreen />;
}

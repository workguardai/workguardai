import type { Metadata } from 'next';

import { AboutScreen } from '@/screens/AboutScreen';

export const metadata: Metadata = {
  title: 'About',
  description:
    'WorkGuard AI is an AI construction monitoring platform founded in Finland, on a mission to give infrastructure teams real-time visibility over every site.',
};

export default function Page() {
  return <AboutScreen />;
}

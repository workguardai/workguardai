/**
 * Client provider composition mounted once in the root layout.
 * (Redux store provider will be added here in the app-UI phase.)
 */
'use client';

import type { ReactNode } from 'react';

import { ReduxProvider } from './ReduxProvider';
import { ToastProvider } from './ToastProvider';
import { ConfirmProvider } from './ConfirmProvider';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ReduxProvider>
      <ToastProvider>
        <ConfirmProvider>{children}</ConfirmProvider>
      </ToastProvider>
    </ReduxProvider>
  );
}

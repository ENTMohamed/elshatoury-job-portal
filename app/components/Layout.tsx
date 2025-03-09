'use client';

import React from 'react';
import ErrorBoundary from './ErrorBoundary';
import Notification from './Notification';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <ErrorBoundary>
      <Notification />
      <main className="min-h-screen bg-gray-50">{children}</main>
    </ErrorBoundary>
  );
} 
'use client';

import { Toaster } from 'react-hot-toast';

export default function Notification() {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        // Default options for all toasts
        className: '',
        duration: 5000,
        style: {
          background: '#363636',
          color: '#fff',
        },
        // Default options for specific types
        success: {
          duration: 3000,
          theme: {
            primary: '#059669',
            secondary: '#DCFCE7',
          },
          style: {
            background: '#DCFCE7',
            color: '#065F46',
            border: '1px solid #059669',
          },
        },
        error: {
          duration: 4000,
          theme: {
            primary: '#DC2626',
            secondary: '#FEE2E2',
          },
          style: {
            background: '#FEE2E2',
            color: '#991B1B',
            border: '1px solid #DC2626',
          },
        },
        loading: {
          duration: Infinity,
          theme: {
            primary: '#2563EB',
            secondary: '#DBEAFE',
          },
          style: {
            background: '#DBEAFE',
            color: '#1E40AF',
            border: '1px solid #2563EB',
          },
        },
      }}
    />
  );
} 
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
        className: '',
        duration: 5000,
        style: {
          background: '#fff',
          color: '#363636',
        },
        success: {
          duration: 3000,
          style: {
            background: '#DCFCE7',
            color: '#059669',
            border: '1px solid #059669',
          },
          iconTheme: {
            primary: '#059669',
            secondary: '#DCFCE7',
          },
        },
        error: {
          duration: 3000,
          style: {
            background: '#FEE2E2',
            color: '#DC2626',
            border: '1px solid #DC2626',
          },
          iconTheme: {
            primary: '#DC2626',
            secondary: '#FEE2E2',
          },
        },
      }}
    />
  );
} 
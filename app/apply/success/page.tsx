'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home page after 5 seconds
    const timeout = setTimeout(() => {
      router.push('/');
    }, 5000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mt-10 bg-white shadow-sm rounded-lg p-8 text-center">
          <div className="flex justify-center">
            <CheckCircleIcon className="h-16 w-16 text-emerald-500" />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-emerald-900">تم إرسال طلبك بنجاح</h2>
          <p className="mt-4 text-gray-600">
            شكراً لتقديم طلبك للانضمام إلى فريق صيدليات الشاطوري. سنقوم بمراجعة طلبك والتواصل معك قريباً.
          </p>
          <div className="mt-8">
            <button
              onClick={() => router.push('/')}
              className="btn-primary"
            >
              العودة للصفحة الرئيسية
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 
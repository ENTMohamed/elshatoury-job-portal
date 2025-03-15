'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Navigation() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('personalInfo');
    localStorage.removeItem('experiences');
    localStorage.removeItem('selectedJob');
    setIsLoggedIn(false);
    router.push('/');
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link
              href="/"
              className="flex items-center px-2 py-2 text-emerald-900 hover:text-emerald-700"
            >
              <span className="text-xl font-bold">صيدليات الشاطوري</span>
            </Link>
          </div>

          <div className="flex items-center">
            {isLoggedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === '/dashboard'
                      ? 'text-emerald-900 bg-emerald-50'
                      : 'text-gray-600 hover:text-emerald-900 hover:bg-emerald-50'
                  }`}
                >
                  طلباتي
                </Link>
                <button
                  onClick={handleLogout}
                  className="mr-4 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-emerald-900 hover:bg-emerald-50"
                >
                  تسجيل الخروج
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === '/login'
                      ? 'text-emerald-900 bg-emerald-50'
                      : 'text-gray-600 hover:text-emerald-900 hover:bg-emerald-50'
                  }`}
                >
                  تسجيل الدخول
                </Link>
                <Link
                  href="/"
                  className="mr-4 btn-primary-sm"
                >
                  تقدم للوظيفة
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 
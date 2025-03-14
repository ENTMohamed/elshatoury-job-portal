import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'El Shatoury Job Portal',
  description: 'Apply for jobs at El Shatoury',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-gray-50">
        <div className="flex min-h-screen flex-col">
          <header className="bg-white shadow-sm">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 justify-between items-center">
                <div className="flex items-center">
                  <img
                    src="/logo.png"
                    alt="El Shatoury Logo"
                    className="h-8 w-auto"
                  />
                  <span className="ml-2 text-xl font-semibold text-gray-900">
                    El Shatoury
                  </span>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1">
            <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>

          <footer className="bg-white border-t">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
              <p className="text-center text-sm text-gray-500">
                © {new Date().getFullYear()} El Shatoury. All rights reserved.
              </p>
            </div>
          </footer>
        </div>
        <Toaster position="top-right" />
      </body>
    </html>
  )
} 
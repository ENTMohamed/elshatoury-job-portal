import './globals.css'
import { Toaster } from 'react-hot-toast'
import Navigation from './components/Navigation'
import { Cairo } from 'next/font/google'

const cairo = Cairo({ 
  subsets: ['arabic'],
  display: 'swap',
})

export const metadata = {
  title: 'صيدليات الشاطوري - التوظيف',
  description: 'تقدم للعمل في صيدليات الشاطوري',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" className={cairo.className}>
      <body>
        <Navigation />
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  )
} 
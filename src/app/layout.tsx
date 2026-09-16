import '../assets/css/globals.css' // CSS is now included here
import { Toaster } from 'react-hot-toast'
import { ReactNode } from 'react'
import { Metadata } from 'next'
import { Inter, Fraunces } from 'next/font/google'
import Providers from '@/store/Providers'
import { AppHeader } from '@/components/layout/AppHeader'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'ToPrep — Less searching. More prepping.',
    template: '%s | ToPrep',
  },
  description:
    'ToPrep turns your topics into an organized learning and preparation workspace — find YouTube videos, track progress, and get scoped AI help per topic.',
}

type RootLayoutProps = {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <Providers>
      <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
        <body className="antialiased">
          <Toaster
            position="bottom-right"
            reverseOrder={false}
            gutter={8}
            toastOptions={{
              style: {
                background: 'rgb(var(--surface))',
                color: 'rgb(var(--foreground))',
                border: '1px solid rgb(var(--border))',
                boxShadow: 'var(--shadow-md)',
                borderRadius: '0.75rem',
                fontSize: '0.875rem',
              },
              success: {
                iconTheme: {
                  primary: 'rgb(var(--success))',
                  secondary: 'rgb(var(--success-bg))',
                },
              },
              error: {
                iconTheme: {
                  primary: 'rgb(var(--danger))',
                  secondary: 'rgb(var(--danger-bg))',
                },
              },
            }}
          />
          <AppHeader />
          {children}
        </body>
      </html>
    </Providers>
  )
}

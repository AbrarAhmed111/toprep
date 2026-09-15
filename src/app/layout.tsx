import '../assets/css/globals.css' // CSS is now included here
import { Toaster } from 'react-hot-toast'
import { ReactNode } from 'react'
import { Metadata } from 'next'
import Providers from '@/store/Providers'

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
      <html lang="en">
        <head></head>
        <body suppressHydrationWarning className="antialiased">
          <Toaster position="top-center" reverseOrder={false} />
          {children}
        </body>
      </html>
    </Providers>
  )
}

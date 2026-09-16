import { Metadata } from 'next'
import * as React from 'react'
import { AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { NotFoundBackButton } from '@/components/NotFoundBackButton'

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for does not exist.',
}

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4">
      <div className="text-center">
        <span className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-warning-bg text-warning">
          <AlertTriangle size={32} />
        </span>

        <h1 className="mb-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          404 — Page Not Found
        </h1>

        <p className="mx-auto mb-8 max-w-md text-base text-muted">
          Sorry, the page you are looking for doesn&apos;t exist or has been
          moved.
        </p>

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/">
            <Button className="w-full">Go Home</Button>
          </Link>
          <NotFoundBackButton />
        </div>

        <p className="mt-12 text-sm text-muted">
          If you believe this is an error, please contact support.
        </p>
      </div>
    </main>
  )
}

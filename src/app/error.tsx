'use client'

import * as React from 'react'
import { AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  React.useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4">
      <div className="text-center">
        <span className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-danger-bg text-danger">
          <AlertTriangle size={32} />
        </span>

        <h1 className="mb-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Something went wrong
        </h1>

        <p className="mx-auto mb-8 max-w-md text-base text-muted">
          We hit an unexpected error. Try again, or head back to the homepage.
        </p>

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button onClick={() => reset()}>Try Again</Button>
          <Link href="/">
            <Button variant="secondary" className="w-full">
              Go Home
            </Button>
          </Link>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <details className="mx-auto mt-8 max-w-2xl text-left">
            <summary className="cursor-pointer text-sm text-muted hover:text-foreground">
              Error Details (Development)
            </summary>
            <pre className="mt-2 overflow-auto rounded-xl border border-border bg-surface-hover p-4 text-xs text-danger">
              {error.message}
            </pre>
          </details>
        )}
      </div>
    </main>
  )
}

'use client'

import { Button } from '@/components/ui/Button'

export function NotFoundBackButton() {
  return (
    <Button variant="secondary" onClick={() => window.history.back()}>
      Go Back
    </Button>
  )
}

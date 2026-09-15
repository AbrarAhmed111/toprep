import Link from 'next/link'
import { BookOpenCheck } from 'lucide-react'
import { ThemeToggle } from '@/components/theme/ThemeToggle'

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand text-brand-foreground shadow-sm">
            <BookOpenCheck size={17} />
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-foreground">
            ToPrep
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/preparations"
            className="hidden text-sm font-medium text-muted transition-colors hover:text-foreground sm:inline-block"
          >
            Your Preparations
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

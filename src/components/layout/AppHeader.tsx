import Link from 'next/link'
import Image from 'next/image'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import logo from '@/assets/img/logo.png'

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-brand p-0.5 shadow-sm">
            <Image
              src={logo}
              alt="ToPrep"
              width={40}
              height={40}
              className="h-full w-full object-contain"
            />
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

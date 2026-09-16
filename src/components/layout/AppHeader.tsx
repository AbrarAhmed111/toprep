import Link from 'next/link'
import Image from 'next/image'
import logo from '@/assets/img/logo.png'

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-primary p-0.5 shadow-sm">
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

        <Link
          href="/preparations"
          className="text-sm font-medium text-muted transition-colors hover:text-foreground"
        >
          Your Preparations
        </Link>
      </div>
    </header>
  )
}

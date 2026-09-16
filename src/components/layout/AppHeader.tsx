import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import logo from '@/assets/img/logo.png'

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center ">
          <Image
            src={logo}
            alt="ToPrep"
            width={50}
            height={50}
            className="h-full w-full object-contain"
          />
          <span className="text-[15px] font-semibold tracking-tight text-foreground">
            ToPrep
          </span>
        </Link>

        <Link href="/preparations">
          <Button size="sm">Prepare</Button>
        </Link>
      </div>
    </header>
  )
}

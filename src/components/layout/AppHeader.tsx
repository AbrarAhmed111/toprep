import Link from 'next/link'
import Image from 'next/image'
import { Zap } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import logo from '@/assets/img/logo.png'

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={logo}
            alt="ToPrep"
            width={36}
            height={36}
            className="h-9 w-9 object-contain"
          />
          <span className="text-xl font-bold tracking-tight text-foreground">
            ToPrep
          </span>
        </Link>

        <Link href="/preparations">
          <Button size="sm">
            <Zap size={15} />
            Prepare
          </Button>
        </Link>
      </div>
    </header>
  )
}

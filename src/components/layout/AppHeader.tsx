import Link from 'next/link'
import { BookOpenCheck } from 'lucide-react'
import { ThemeToggle } from '@/components/theme/ThemeToggle'

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-700/50 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 backdrop-blur-xl shadow-lg">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
            <BookOpenCheck size={18} />
          </span>
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-[16px] font-bold tracking-tight text-transparent">
            ToPrep
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/preparations"
            className="hidden text-sm font-medium text-slate-300 transition-colors hover:text-white sm:inline-block"
          >
            Your Preparations
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

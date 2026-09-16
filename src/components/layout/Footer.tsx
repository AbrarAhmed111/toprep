import Image from 'next/image'
import devAbbyLogo from '@/assets/img/devabby-logo.png'

export function Footer() {
  return (
    <footer className="border-t border-border py-6 text-center text-xs text-muted">
      <p>
        <span className="font-medium text-foreground">ToPrep</span> — Less
        searching. More prepping.
      </p>
      <p className="mt-1">© {new Date().getFullYear()} ToPrep</p>
      <a
        href="https://www.abrarahmed.pro"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-10 inline-flex items-center gap-1.5 text-muted transition-opacity hover:opacity-70"
      >
        <span className="text-[10px]  font-semibold uppercase tracking-wider">
          Built by
        </span>
        <Image
          src={devAbbyLogo}
          alt="DevAbby"
          height={36}
          className="h-14 w-auto"
        />
      </a>
    </footer>
  )
}

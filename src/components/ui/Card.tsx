import { HTMLAttributes } from 'react'
import clsx from 'clsx'

type CardProps = HTMLAttributes<HTMLDivElement>

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl shadow-sm transition-all duration-300 hover:border-white/20 hover:bg-gradient-to-br hover:from-white/10 hover:to-white/5',
        className,
      )}
      {...props}
    />
  )
}

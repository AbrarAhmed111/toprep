import { HTMLAttributes } from 'react'
import clsx from 'clsx'

type CardProps = HTMLAttributes<HTMLDivElement>

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-xl border border-border bg-surface shadow-sm',
        className,
      )}
      {...props}
    />
  )
}

import { HTMLAttributes } from 'react'
import clsx from 'clsx'

export type BadgeTone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone
}

const toneClasses: Record<BadgeTone, string> = {
  neutral: 'bg-surface text-muted border-border',
  brand: 'bg-indigo-50 text-brand border-indigo-100',
  success: 'bg-green-50 text-success border-green-100',
  warning: 'bg-amber-50 text-warning border-amber-100',
  danger: 'bg-red-50 text-danger border-red-100',
}

export function Badge({ tone = 'neutral', className, ...props }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  )
}

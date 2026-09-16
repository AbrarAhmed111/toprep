import { HTMLAttributes } from 'react'
import clsx from 'clsx'

export type BadgeTone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone
}

const toneClasses: Record<BadgeTone, string> = {
  neutral: 'bg-surface-hover text-muted',
  primary: 'bg-surface-hover text-primary',
  success: 'bg-success-bg text-success',
  warning: 'bg-warning-bg text-warning',
  danger: 'bg-danger-bg text-danger',
}

export function Badge({ tone = 'neutral', className, ...props }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium',
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  )
}

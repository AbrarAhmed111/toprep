import { HTMLAttributes } from 'react'
import clsx from 'clsx'

export type BadgeTone =
  | 'neutral'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'interview'
  | 'exam'
  | 'certification'
  | 'custom'

const toneClasses: Record<BadgeTone, string> = {
  neutral: 'bg-surface-hover text-muted',
  primary: 'bg-surface-hover text-primary',
  success: 'bg-success-bg text-success',
  warning: 'bg-warning-bg text-warning',
  danger: 'bg-danger-bg text-danger',
  interview: 'bg-type-interview/10 text-type-interview',
  exam: 'bg-type-exam/10 text-type-exam',
  certification: 'bg-type-certification/10 text-type-certification',
  custom: 'bg-type-custom/10 text-type-custom',
}

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone
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

import { ReactNode } from 'react'
import clsx from 'clsx'

interface ProgressBarProps {
  value: number
  max?: number
  label?: ReactNode
  className?: string
  trackClassName?: string
}

export function ProgressBar({
  value,
  max = 100,
  label,
  className,
  trackClassName,
}: ProgressBarProps) {
  const percent =
    max > 0 ? Math.min(100, Math.max(0, Math.round((value / max) * 100))) : 0

  return (
    <div className={clsx('flex items-center gap-3', className)}>
      <div
        className={clsx(
          'h-1.5 flex-1 overflow-hidden rounded-full bg-surface-hover',
          trackClassName,
        )}
      >
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
      {label && (
        <span className="shrink-0 text-xs font-medium text-muted">{label}</span>
      )}
    </div>
  )
}

import { ReactNode } from 'react'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-surface-hover px-6 py-14 text-center">
      {icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface text-primary shadow-sm">
          {icon}
        </div>
      )}
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="max-w-sm text-sm text-muted">{description}</p>
      )}
      {action}
    </div>
  )
}

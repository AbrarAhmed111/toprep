import { Check } from 'lucide-react'
import clsx from 'clsx'
import { TopicStatus, TOPIC_STATUS_LABELS } from '@/types/preparation'

interface StatusBadgeProps {
  status: TopicStatus
  className?: string
}

// "Need to study" gets the same blue as primary actions — it's the state
// that needs attention. "Understood" is deliberately unstyled/neutral: a
// middle state, not a call to action. "Completed" is the only status that
// earns a checkmark. "Skipping" reads as intentionally de-emphasized.
const STATUS_CLASSES: Record<TopicStatus, string> = {
  need_to_study: 'border-primary/20 bg-primary/10 text-primary',
  understood: 'border-border bg-surface text-foreground',
  completed: 'border-success/20 bg-success-bg text-success',
  skipping: 'border-dashed border-border text-status-skip',
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium',
        STATUS_CLASSES[status],
        className,
      )}
    >
      {status === 'completed' && <Check size={11} strokeWidth={2.5} />}
      {TOPIC_STATUS_LABELS[status]}
    </span>
  )
}

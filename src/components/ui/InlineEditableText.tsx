'use client'

import { KeyboardEvent, MouseEvent, useState } from 'react'
import { Check, Pencil, X } from 'lucide-react'
import clsx from 'clsx'

interface InlineEditableTextProps {
  value: string
  onCommit: (newValue: string) => void
  as?: 'heading' | 'label'
  className?: string
  ariaLabel?: string
}

const roleClasses: Record<'heading' | 'label', string> = {
  heading: 'text-xs font-semibold uppercase tracking-wider text-muted',
  label: 'text-[15px] font-medium text-foreground',
}

// Click-to-rename text. Only the pencil affordance enters edit mode — the
// text itself stays a plain (non-interactive) span so a parent row can
// attach its own click handler (e.g. expand/collapse) without it fighting
// the rename interaction.
export function InlineEditableText({
  value,
  onCommit,
  as = 'label',
  className,
  ariaLabel,
}: InlineEditableTextProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(value)

  const commit = () => {
    const trimmed = draft.trim()
    if (trimmed && trimmed !== value) onCommit(trimmed)
    else setDraft(value)
    setIsEditing(false)
  }

  const cancel = () => {
    setDraft(value)
    setIsEditing(false)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') commit()
    if (event.key === 'Escape') cancel()
  }

  const stop = (event: MouseEvent) => event.stopPropagation()

  if (isEditing) {
    return (
      <div className="flex min-w-0 flex-1 items-center gap-1" onClick={stop}>
        <input
          autoFocus
          value={draft}
          onChange={event => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          aria-label={ariaLabel ?? `Rename ${value}`}
          className={clsx(
            'w-full max-w-xs rounded-lg border border-primary bg-surface px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary/50',
            roleClasses[as],
          )}
        />
        <button
          type="button"
          onClick={commit}
          aria-label="Save"
          className="shrink-0 rounded-md p-1 text-success hover:bg-success-bg"
        >
          <Check size={16} />
        </button>
        <button
          type="button"
          onClick={cancel}
          aria-label="Cancel"
          className="shrink-0 rounded-md p-1 text-muted hover:bg-surface-hover"
        >
          <X size={16} />
        </button>
      </div>
    )
  }

  return (
    <span className="group/edit inline-flex min-w-0 items-center gap-1.5">
      <span className={clsx(roleClasses[as], 'min-w-0 truncate', className)}>
        {value}
      </span>
      <button
        type="button"
        onClick={event => {
          stop(event)
          setIsEditing(true)
        }}
        aria-label={ariaLabel ?? `Rename ${value}`}
        className="shrink-0 rounded p-0.5 text-muted/50 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <Pencil size={13} />
      </button>
    </span>
  )
}

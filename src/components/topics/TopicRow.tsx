'use client'

import { KeyboardEvent, useState } from 'react'
import { Check, Pencil, Trash2, X } from 'lucide-react'
import {
  PRIORITIES,
  PRIORITY_LABELS,
  Priority,
  TOPIC_STATUSES,
  TOPIC_STATUS_LABELS,
  Topic,
  TopicStatus,
} from '@/types/preparation'

interface TopicRowProps {
  topic: Topic
  onRename: (name: string) => void
  onStatusChange: (status: TopicStatus) => void
  onPriorityChange: (priority: Priority) => void
  onDelete: () => void
}

export function TopicRow({
  topic,
  onRename,
  onStatusChange,
  onPriorityChange,
  onDelete,
}: TopicRowProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [draftName, setDraftName] = useState(topic.name)

  const commitRename = () => {
    const trimmed = draftName.trim()
    if (trimmed && trimmed !== topic.name) onRename(trimmed)
    else setDraftName(topic.name)
    setIsEditing(false)
  }

  const cancelRename = () => {
    setDraftName(topic.name)
    setIsEditing(false)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') commitRename()
    if (event.key === 'Escape') cancelRename()
  }

  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-border px-4 py-3 last:border-b-0">
      <div className="min-w-[180px] flex-1">
        {isEditing ? (
          <div className="flex items-center gap-1">
            <input
              autoFocus
              value={draftName}
              onChange={event => setDraftName(event.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full rounded-md border border-border px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
            />
            <button
              type="button"
              onClick={commitRename}
              aria-label="Save name"
              className="rounded-md p-1 text-success hover:bg-green-50"
            >
              <Check size={16} />
            </button>
            <button
              type="button"
              onClick={cancelRename}
              aria-label="Cancel"
              className="rounded-md p-1 text-muted hover:bg-surface"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="group flex items-center gap-2 text-left text-sm font-medium text-foreground"
          >
            {topic.name}
            <Pencil
              size={13}
              className="text-muted opacity-0 group-hover:opacity-100"
            />
          </button>
        )}
      </div>

      <select
        aria-label="Status"
        value={topic.status}
        onChange={event => onStatusChange(event.target.value as TopicStatus)}
        className="rounded-lg border border-border bg-white px-2 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand/40"
      >
        {TOPIC_STATUSES.map(status => (
          <option key={status} value={status}>
            {TOPIC_STATUS_LABELS[status]}
          </option>
        ))}
      </select>

      <select
        aria-label="Priority"
        value={topic.priority}
        onChange={event => onPriorityChange(event.target.value as Priority)}
        className="rounded-lg border border-border bg-white px-2 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand/40"
      >
        {PRIORITIES.map(priority => (
          <option key={priority} value={priority}>
            {PRIORITY_LABELS[priority]}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={onDelete}
        aria-label="Delete topic"
        className="rounded-md p-2 text-muted hover:bg-red-50 hover:text-danger"
      >
        <Trash2 size={16} />
      </button>
    </div>
  )
}

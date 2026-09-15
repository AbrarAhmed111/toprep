'use client'

import { KeyboardEvent, useState } from 'react'
import { Check, Pencil, Trash2, X } from 'lucide-react'
import { Select } from '@/components/ui/Select'
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

const STATUS_DOT: Record<TopicStatus, string> = {
  need_to_study: 'bg-muted',
  understood: 'bg-teal',
  completed: 'bg-success',
  skipping: 'bg-border',
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
    <div className="group flex flex-wrap items-center gap-3 border-b border-border px-4 py-3 transition-colors last:border-b-0 hover:bg-surface-2">
      <span
        className={`h-2 w-2 shrink-0 rounded-full ${STATUS_DOT[topic.status]}`}
        aria-hidden="true"
      />

      <div className="min-w-[180px] flex-1">
        {isEditing ? (
          <div className="flex items-center gap-1">
            <input
              autoFocus
              value={draftName}
              onChange={event => setDraftName(event.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full rounded-lg border border-border bg-surface px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand"
            />
            <button
              type="button"
              onClick={commitRename}
              aria-label="Save name"
              className="rounded-md p-1 text-success hover:bg-success-bg"
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
            className="flex items-center gap-2 text-left text-sm font-medium text-foreground"
          >
            {topic.name}
            <Pencil
              size={13}
              className="text-muted opacity-0 transition-opacity group-hover:opacity-100"
            />
          </button>
        )}
      </div>

      <div className="w-36">
        <Select
          aria-label="Status"
          value={topic.status}
          onChange={event => onStatusChange(event.target.value as TopicStatus)}
        >
          {TOPIC_STATUSES.map(status => (
            <option key={status} value={status}>
              {TOPIC_STATUS_LABELS[status]}
            </option>
          ))}
        </Select>
      </div>

      <div className="w-28">
        <Select
          aria-label="Priority"
          value={topic.priority}
          onChange={event => onPriorityChange(event.target.value as Priority)}
        >
          {PRIORITIES.map(priority => (
            <option key={priority} value={priority}>
              {PRIORITY_LABELS[priority]}
            </option>
          ))}
        </Select>
      </div>

      <button
        type="button"
        onClick={onDelete}
        aria-label="Delete topic"
        className="rounded-lg p-2 text-muted transition-colors hover:bg-danger-bg hover:text-danger"
      >
        <Trash2 size={16} />
      </button>
    </div>
  )
}

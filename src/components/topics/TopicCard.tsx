'use client'

import { useState } from 'react'
import { ChevronDown, Trash2, Pencil, Check, X } from 'lucide-react'
import { Topic, TopicStatus, TOPIC_STATUSES, TOPIC_STATUS_LABELS } from '@/types/preparation'
import { TopicYouTubeSearch } from '@/components/youtube/TopicYouTubeSearch'
import { Select } from '@/components/ui/Select'

interface TopicCardProps {
  topic: Topic
  isSelected: boolean
  onToggleSelect: () => void
  onRename: (name: string) => void
  onStatusChange: (status: TopicStatus) => void
  onDelete: () => void
}

export function TopicCard({
  topic,
  isSelected,
  onToggleSelect,
  onRename,
  onStatusChange,
  onDelete,
}: TopicCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [draftName, setDraftName] = useState(topic.name)

  const commitRename = () => {
    const trimmed = draftName.trim()
    if (trimmed && trimmed !== topic.name) {
      onRename(trimmed)
    } else {
      setDraftName(topic.name)
    }
    setIsEditing(false)
  }

  return (
    <div className="space-y-2">
      {/* Topic Header Card */}
      <div className="rounded-lg border border-border bg-surface p-4 transition-colors hover:bg-surface-2">
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggleSelect}
            className="mt-1 h-4 w-4 shrink-0 rounded border-border accent-brand focus:ring-2 focus:ring-brand"
            aria-label={`Select ${topic.name}`}
          />

          {/* Topic Content */}
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="flex gap-1">
                <input
                  autoFocus
                  value={draftName}
                  onChange={e => setDraftName(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') commitRename()
                    if (e.key === 'Escape') {
                      setDraftName(topic.name)
                      setIsEditing(false)
                    }
                  }}
                  className="flex-1 rounded-lg border border-border bg-surface px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand"
                />
                <button
                  onClick={commitRename}
                  className="rounded p-1 text-success hover:bg-success-bg"
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={() => {
                    setDraftName(topic.name)
                    setIsEditing(false)
                  }}
                  className="rounded p-1 text-muted hover:bg-surface"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 text-left text-sm font-medium text-foreground hover:opacity-70"
              >
                {topic.name}
                <Pencil size={13} className="opacity-0 group-hover:opacity-100" />
              </button>
            )}

            {/* Status */}
            <div className="mt-2 flex items-center gap-2">
              <Select
                value={topic.status}
                onChange={e => onStatusChange(e.target.value as TopicStatus)}
                className="w-40 text-xs"
              >
                {TOPIC_STATUSES.map(status => (
                  <option key={status} value={status}>
                    {TOPIC_STATUS_LABELS[status]}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {/* Expand Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="rounded-lg p-2 text-muted hover:bg-surface-2 transition-colors"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            <ChevronDown
              size={18}
              className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Delete Button */}
          <button
            onClick={onDelete}
            className="rounded-lg p-2 text-muted hover:bg-danger-bg hover:text-danger transition-colors"
            aria-label="Delete topic"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="ml-7 rounded-lg border border-border bg-surface-2 p-4">
          {/* YouTube Search Section */}
          <TopicYouTubeSearch
            topicName={topic.name}
            topicId={topic.id}
          />
        </div>
      )}
    </div>
  )
}

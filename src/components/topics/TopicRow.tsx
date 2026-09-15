'use client'

import { KeyboardEvent, useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Check, GripVertical, Pencil, Trash2, X, Play } from 'lucide-react'
import { Select } from '@/components/ui/Select'
import {
  TOPIC_STATUSES,
  TOPIC_STATUS_LABELS,
  Section,
  Topic,
  TopicStatus,
} from '@/types/preparation'

const UNSECTIONED_VALUE = '__unsectioned__'

interface TopicRowProps {
  topic: Topic
  sections: Section[]
  selected: boolean
  onToggleSelect: () => void
  onRename: (name: string) => void
  onStatusChange: (status: TopicStatus) => void
  onMoveToSection: (sectionId: string | null) => void
  onDelete: () => void
  onSearchYouTube: () => void
}

const STATUS_DOT: Record<TopicStatus, string> = {
  need_to_study: 'bg-muted',
  understood: 'bg-teal',
  completed: 'bg-success',
  skipping: 'bg-border',
}

export function TopicRow({
  topic,
  sections,
  selected,
  onToggleSelect,
  onRename,
  onStatusChange,
  onMoveToSection,
  onDelete,
  onSearchYouTube,
}: TopicRowProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [draftName, setDraftName] = useState(topic.name)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: topic.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

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
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex flex-wrap items-center gap-2 border-b border-border bg-surface px-2 py-3 transition-colors last:border-b-0 hover:bg-surface-2 ${
        isDragging ? 'relative z-10 shadow-lg' : ''
      }`}
    >
      <input
        type="checkbox"
        aria-label={`Select ${topic.name}`}
        checked={selected}
        onChange={onToggleSelect}
        className="h-4 w-4 shrink-0 rounded border-border accent-brand focus:ring-2 focus:ring-brand"
      />

      <button
        type="button"
        aria-label="Drag to reorder"
        className="cursor-grab touch-none rounded-md p-1.5 text-muted opacity-0 transition-opacity hover:bg-surface-2 hover:text-foreground focus-visible:opacity-100 group-hover:opacity-100 active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={15} />
      </button>

      <span
        className={`h-2 w-2 shrink-0 rounded-full ${STATUS_DOT[topic.status]}`}
        aria-hidden="true"
      />

      <div className="min-w-[160px] flex-1">
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

      <div className="w-40">
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

      {sections.length > 0 && (
        <div className="w-40">
          <Select
            aria-label="Section"
            value={topic.sectionId ?? UNSECTIONED_VALUE}
            onChange={event =>
              onMoveToSection(
                event.target.value === UNSECTIONED_VALUE
                  ? null
                  : event.target.value,
              )
            }
          >
            <option value={UNSECTIONED_VALUE}>Unsectioned</option>
            {sections.map(section => (
              <option key={section.id} value={section.id}>
                {section.name}
              </option>
            ))}
          </Select>
        </div>
      )}

      <button
        type="button"
        onClick={onSearchYouTube}
        aria-label="Search YouTube for this topic"
        className="rounded-lg p-2 text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
        title="Search YouTube"
      >
        <Play size={16} />
      </button>

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

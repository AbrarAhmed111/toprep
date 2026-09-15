'use client'

import { KeyboardEvent, useEffect, useRef, useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Check, GripVertical, Pencil, Trash2, X } from 'lucide-react'
import { Section } from '@/types/preparation'

interface SectionHeaderProps {
  section: Section
  topicCount: number
  allSelected: boolean
  someSelected: boolean
  onToggleSelectAll: () => void
  onRename: (name: string) => void
  onDelete: () => void
}

export function SectionHeader({
  section,
  topicCount,
  allSelected,
  someSelected,
  onToggleSelectAll,
  onRename,
  onDelete,
}: SectionHeaderProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [draftName, setDraftName] = useState(section.name)
  const checkboxRef = useRef<HTMLInputElement>(null)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  useEffect(() => {
    if (checkboxRef.current)
      checkboxRef.current.indeterminate = someSelected && !allSelected
  }, [someSelected, allSelected])

  const commitRename = () => {
    const trimmed = draftName.trim()
    if (trimmed && trimmed !== section.name) onRename(trimmed)
    else setDraftName(section.name)
    setIsEditing(false)
  }

  const cancelRename = () => {
    setDraftName(section.name)
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
      className={`group flex items-center gap-2 rounded-t-2xl border-b border-border bg-surface-2 px-3 py-2.5 ${
        isDragging ? 'relative z-10 shadow-lg' : ''
      }`}
    >
      <button
        type="button"
        aria-label="Drag to reorder section"
        className="cursor-grab touch-none rounded-md p-1.5 text-muted opacity-0 transition-opacity hover:bg-surface hover:text-foreground focus-visible:opacity-100 group-hover:opacity-100 active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={15} />
      </button>

      <input
        ref={checkboxRef}
        type="checkbox"
        aria-label={`Select all topics in ${section.name}`}
        checked={allSelected}
        onChange={onToggleSelectAll}
        disabled={topicCount === 0}
        className="h-4 w-4 shrink-0 rounded border-border accent-brand focus:ring-2 focus:ring-brand disabled:opacity-40"
      />

      {isEditing ? (
        <div className="flex flex-1 items-center gap-1">
          <input
            autoFocus
            value={draftName}
            onChange={event => setDraftName(event.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full max-w-xs rounded-lg border border-border bg-surface px-2 py-1 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-brand"
          />
          <button
            type="button"
            onClick={commitRename}
            aria-label="Save section name"
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
          className="flex flex-1 items-center gap-2 text-left text-sm font-semibold text-foreground"
        >
          {section.name}
          <Pencil
            size={13}
            className="text-muted opacity-0 transition-opacity group-hover:opacity-100"
          />
        </button>
      )}

      <span className="shrink-0 text-xs text-muted">
        {topicCount} {topicCount === 1 ? 'topic' : 'topics'}
      </span>

      <button
        type="button"
        onClick={onDelete}
        aria-label={`Delete ${section.name}`}
        className="rounded-lg p-2 text-muted transition-colors hover:bg-danger-bg hover:text-danger"
      >
        <Trash2 size={16} />
      </button>
    </div>
  )
}

'use client'

import { useEffect, useRef } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Trash2 } from 'lucide-react'
import { Section } from '@/types/preparation'
import { InlineEditableText } from '@/components/ui/InlineEditableText'

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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex flex-1 items-center gap-2 py-2.5 ${
        isDragging ? 'relative z-10 rounded-lg bg-surface shadow-md' : ''
      }`}
    >
      <button
        type="button"
        aria-label="Drag to reorder section"
        className="cursor-grab touch-none rounded-md p-1.5 text-muted opacity-0 transition-opacity hover:bg-surface-hover hover:text-foreground focus-visible:opacity-100 group-hover:opacity-100 active:cursor-grabbing"
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
        className="h-4 w-4 shrink-0 rounded border-border accent-primary focus:ring-2 focus:ring-primary disabled:opacity-40"
      />

      <div className="min-w-0 flex-1">
        <InlineEditableText
          value={section.name}
          onCommit={onRename}
          as="heading"
          ariaLabel={`Rename ${section.name}`}
        />
      </div>

      <span className="shrink-0 text-xs font-medium text-muted">
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

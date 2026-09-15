'use client'

import Link from 'next/link'
import { Archive, ArchiveRestore, Copy, Pencil, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge, BadgeTone } from '@/components/ui/Badge'
import { Preparation, PRIORITY_LABELS } from '@/types/preparation'

const PRIORITY_TONE: Record<Preparation['priority'], BadgeTone> = {
  low: 'neutral',
  medium: 'brand',
  high: 'warning',
}

interface PreparationCardProps {
  preparation: Preparation
  topicCount: number
  completedCount: number
  onEdit: () => void
  onDuplicate: () => void
  onToggleArchive: () => void
  onDelete: () => void
}

export function PreparationCard({
  preparation,
  topicCount,
  completedCount,
  onEdit,
  onDuplicate,
  onToggleArchive,
  onDelete,
}: PreparationCardProps) {
  const isArchived = preparation.status === 'archived'

  return (
    <Card
      className={`flex flex-col gap-3 p-5 ${isArchived ? 'opacity-70' : ''}`}
    >
      <div className="flex items-start justify-between gap-2">
        <Link
          href={`/preparations/${preparation.id}`}
          className="text-base font-semibold text-foreground hover:text-brand"
        >
          {preparation.title}
        </Link>
        <Badge tone={isArchived ? 'neutral' : 'success'}>
          {isArchived ? 'Archived' : 'Active'}
        </Badge>
      </div>

      {preparation.description && (
        <p className="line-clamp-2 text-sm text-muted">
          {preparation.description}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="brand">{preparation.type}</Badge>
        <Badge tone={PRIORITY_TONE[preparation.priority]}>
          {PRIORITY_LABELS[preparation.priority]} priority
        </Badge>
        {preparation.targetDate && (
          <Badge tone="neutral">
            Target: {new Date(preparation.targetDate).toLocaleDateString()}
          </Badge>
        )}
      </div>

      <p className="text-sm text-muted">
        {topicCount} {topicCount === 1 ? 'topic' : 'topics'} · {completedCount}{' '}
        completed
      </p>

      <div className="mt-1 flex items-center gap-1 border-t border-border pt-3">
        <button
          type="button"
          onClick={onEdit}
          aria-label="Edit preparation"
          className="rounded-md p-2 text-muted hover:bg-surface hover:text-foreground"
        >
          <Pencil size={16} />
        </button>
        <button
          type="button"
          onClick={onDuplicate}
          aria-label="Duplicate preparation"
          className="rounded-md p-2 text-muted hover:bg-surface hover:text-foreground"
        >
          <Copy size={16} />
        </button>
        <button
          type="button"
          onClick={onToggleArchive}
          aria-label={
            isArchived ? 'Unarchive preparation' : 'Archive preparation'
          }
          className="rounded-md p-2 text-muted hover:bg-surface hover:text-foreground"
        >
          {isArchived ? <ArchiveRestore size={16} /> : <Archive size={16} />}
        </button>
        <button
          type="button"
          onClick={onDelete}
          aria-label="Delete preparation"
          className="ml-auto rounded-md p-2 text-muted hover:bg-red-50 hover:text-danger"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </Card>
  )
}

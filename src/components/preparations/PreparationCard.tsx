'use client'

import Link from 'next/link'
import {
  Archive,
  ArchiveRestore,
  Award,
  Copy,
  GraduationCap,
  Layers,
  Pencil,
  Trash2,
  Users,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge, BadgeTone } from '@/components/ui/Badge'
import {
  Preparation,
  PreparationType,
  PRIORITY_LABELS,
} from '@/types/preparation'

const PRIORITY_TONE: Record<Preparation['priority'], BadgeTone> = {
  low: 'neutral',
  medium: 'brand',
  high: 'warning',
}

const TYPE_ICON: Record<PreparationType, typeof Users> = {
  Interview: Users,
  Exam: GraduationCap,
  Certification: Award,
  Custom: Layers,
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
  const TypeIcon = TYPE_ICON[preparation.type]
  const progress =
    topicCount > 0 ? Math.round((completedCount / topicCount) * 100) : 0

  return (
    <Card
      className={`group flex flex-col gap-3 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
        isArchived ? 'opacity-70' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface-2 text-brand">
            <TypeIcon size={17} />
          </span>
          <Link
            href={`/preparations/${preparation.id}`}
            className="pt-1 text-base font-semibold leading-snug text-foreground transition-colors hover:text-brand"
          >
            {preparation.title}
          </Link>
        </div>
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

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-sm text-muted">
          <span>
            {topicCount} {topicCount === 1 ? 'topic' : 'topics'}
          </span>
          <span>{completedCount} completed</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full rounded-full bg-brand transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-1 flex items-center gap-1 border-t border-border pt-3">
        <button
          type="button"
          onClick={onEdit}
          aria-label="Edit preparation"
          className="rounded-lg p-2 text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
        >
          <Pencil size={16} />
        </button>
        <button
          type="button"
          onClick={onDuplicate}
          aria-label="Duplicate preparation"
          className="rounded-lg p-2 text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
        >
          <Copy size={16} />
        </button>
        <button
          type="button"
          onClick={onToggleArchive}
          aria-label={
            isArchived ? 'Unarchive preparation' : 'Archive preparation'
          }
          className="rounded-lg p-2 text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
        >
          {isArchived ? <ArchiveRestore size={16} /> : <Archive size={16} />}
        </button>
        <button
          type="button"
          onClick={onDelete}
          aria-label="Delete preparation"
          className="ml-auto rounded-lg p-2 text-muted transition-colors hover:bg-danger-bg hover:text-danger"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </Card>
  )
}

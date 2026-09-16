'use client'

import Link from 'next/link'
import {
  Award,
  ChevronRight,
  Copy,
  GraduationCap,
  Layers,
  Pencil,
  Trash2,
  Users,
} from 'lucide-react'
import clsx from 'clsx'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import {
  Preparation,
  PreparationType,
  PREPARATION_TYPE_STYLES,
} from '@/types/preparation'
import { formatRelativeDate } from '@/lib/formatRelativeDate'

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
  onDelete: () => void
}

export function PreparationCard({
  preparation,
  topicCount,
  completedCount,
  onEdit,
  onDuplicate,
  onDelete,
}: PreparationCardProps) {
  const TypeIcon = TYPE_ICON[preparation.type]
  const typeStyles = PREPARATION_TYPE_STYLES[preparation.type]

  return (
    <Card className="group relative flex cursor-pointer flex-col gap-3 p-5 pl-6 transition-shadow duration-200 hover:shadow-md focus-within:shadow-md focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-background">
      <span
        className={clsx(
          'pointer-events-none absolute inset-y-0 left-0 w-1 rounded-l-xl',
          typeStyles.accent,
        )}
        aria-hidden="true"
      />
      <div className="flex items-start gap-3">
        <span
          className={clsx(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl',
            typeStyles.icon,
          )}
        >
          <TypeIcon size={17} />
        </span>
        <h3 className="flex items-center gap-1 pt-1 text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
          <Link
            href={`/preparations/${preparation.id}`}
            className="focus-visible:outline-none"
          >
            <span className="absolute inset-0 rounded-xl" aria-hidden="true" />
            {preparation.title}
          </Link>
          <ChevronRight
            size={15}
            className="shrink-0 -translate-x-1 text-primary opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
            aria-hidden="true"
          />
        </h3>
      </div>

      {preparation.description && (
        <p className="line-clamp-2 text-sm text-muted">
          {preparation.description}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <Badge tone={typeStyles.badge}>{preparation.type}</Badge>
        {preparation.targetDate && (
          <Badge tone="neutral">
            Target: {new Date(preparation.targetDate).toLocaleDateString()}
          </Badge>
        )}
      </div>

      {topicCount > 0 ? (
        <div className="flex flex-col gap-1.5">
          <ProgressBar
            value={completedCount}
            max={topicCount}
            barClassName={typeStyles.accent}
          />
          <span className="text-sm text-muted">
            {completedCount} of {topicCount} completed
          </span>
        </div>
      ) : (
        <p className="text-sm text-muted">
          No topics yet — add topics to start preparing
        </p>
      )}

      <span className="text-xs text-muted">
        {formatRelativeDate(preparation.updatedAt)}
      </span>

      <div className="relative z-10 mt-1 flex items-center gap-1 border-t border-border pt-3">
        <button
          type="button"
          onClick={onEdit}
          aria-label="Edit preparation"
          className="rounded-lg p-2 text-muted transition-colors hover:bg-surface-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Pencil size={16} />
        </button>
        <button
          type="button"
          onClick={onDuplicate}
          aria-label="Duplicate preparation"
          className="rounded-lg p-2 text-muted transition-colors hover:bg-surface-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Copy size={16} />
        </button>
        <button
          type="button"
          onClick={onDelete}
          aria-label="Delete preparation"
          className="ml-auto rounded-lg p-2 text-muted transition-colors hover:bg-danger-bg hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </Card>
  )
}

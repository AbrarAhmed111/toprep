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
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Preparation, PreparationType } from '@/types/preparation'

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

  return (
    <Card className="group relative flex cursor-pointer flex-col gap-3 p-5 transition-shadow duration-200 hover:shadow-md focus-within:shadow-md focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-background">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
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
        <Badge tone="primary">{preparation.type}</Badge>
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
        <ProgressBar value={completedCount} max={topicCount} />
      </div>

      <div className="relative z-10 mt-1 flex items-center gap-1 border-t border-border pt-3">
        <button
          type="button"
          onClick={onEdit}
          aria-label="Edit preparation"
          className="rounded-lg p-2 text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
        >
          <Pencil size={16} />
        </button>
        <button
          type="button"
          onClick={onDuplicate}
          aria-label="Duplicate preparation"
          className="rounded-lg p-2 text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
        >
          <Copy size={16} />
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

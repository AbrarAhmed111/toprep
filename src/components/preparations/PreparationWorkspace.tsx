'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { ArrowLeft, Pencil } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { preparationUpdated } from '@/store/preparations/preparationsSlice'
import {
  topicAdded,
  topicRemoved,
  topicUpdated,
  topicsAddedMany,
  topicsReordered,
} from '@/store/topics/topicsSlice'
import { generateId } from '@/lib/id'
import { parseBulkTopics } from '@/lib/topics/parseBulkTopics'
import {
  PRIORITY_LABELS,
  Priority,
  Topic,
  TopicStatus,
} from '@/types/preparation'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { AddTopicPanel } from '@/components/topics/AddTopicPanel'
import { TopicList } from '@/components/topics/TopicList'
import {
  PreparationFormModal,
  PreparationFormValues,
} from './PreparationFormModal'

interface PreparationWorkspaceProps {
  preparationId: string
}

export function PreparationWorkspace({
  preparationId,
}: PreparationWorkspaceProps) {
  const dispatch = useAppDispatch()
  const preparation = useAppSelector(state =>
    state.preparations.items.find(p => p.id === preparationId),
  )
  const preparationsHydrated = useAppSelector(
    state => state.preparations.hydrated,
  )
  const allTopics = useAppSelector(state => state.topics.items)
  const [editOpen, setEditOpen] = useState(false)

  const topics = useMemo(
    () =>
      allTopics
        .filter(t => t.preparationId === preparationId)
        .sort((a, b) => a.position - b.position),
    [allTopics, preparationId],
  )

  const nextPosition = useMemo(
    () => topics.reduce((max, t) => Math.max(max, t.position), -1) + 1,
    [topics],
  )

  const existingNames = useMemo(
    () => new Set(topics.map(t => t.name.toLowerCase())),
    [topics],
  )

  const completedCount = useMemo(
    () => topics.filter(t => t.status === 'completed').length,
    [topics],
  )

  const addSingleTopic = (name: string) => {
    if (existingNames.has(name.toLowerCase())) {
      toast.error('That topic already exists in this preparation')
      return
    }
    const now = new Date().toISOString()
    dispatch(
      topicAdded({
        id: generateId(),
        preparationId,
        sectionId: null,
        name,
        status: 'need_to_study',
        priority: 'medium',
        notes: '',
        position: nextPosition,
        aiExplanation: null,
        aiExpectedQuestions: [],
        selectedVideoIds: [],
        createdAt: now,
        updatedAt: now,
      }),
    )
    toast.success(`Added "${name}"`)
  }

  const addBulkTopics = (raw: string) => {
    const { names, duplicateCount, truncated } = parseBulkTopics(raw)
    const now = new Date().toISOString()
    const fresh = names.filter(name => !existingNames.has(name.toLowerCase()))
    const skippedExisting = names.length - fresh.length

    if (fresh.length === 0) {
      toast.error('No new topics to add — all of those already exist')
      return
    }

    dispatch(
      topicsAddedMany(
        fresh.map((name, index) => ({
          id: generateId(),
          preparationId,
          sectionId: null,
          name,
          status: 'need_to_study' as TopicStatus,
          priority: 'medium' as Priority,
          notes: '',
          position: nextPosition + index,
          aiExplanation: null,
          aiExpectedQuestions: [],
          selectedVideoIds: [],
          createdAt: now,
          updatedAt: now,
        })),
      ),
    )

    const notes = [
      `Added ${fresh.length} topic${fresh.length === 1 ? '' : 's'}`,
    ]
    if (duplicateCount)
      notes.push(`${duplicateCount} duplicate line(s) skipped`)
    if (skippedExisting) notes.push(`${skippedExisting} already existed`)
    if (truncated) notes.push(`capped at 100 per paste`)
    toast.success(notes.join(' · '))
  }

  const updateTopic = (id: string, patch: Partial<Topic>) => {
    const topic = topics.find(t => t.id === id)
    if (!topic) return
    dispatch(
      topicUpdated({ ...topic, ...patch, updatedAt: new Date().toISOString() }),
    )
  }

  const deleteTopic = (id: string) => {
    dispatch(topicRemoved(id))
  }

  const reorderTopics = (orderedIds: string[]) => {
    dispatch(topicsReordered({ preparationId, orderedIds }))
  }

  const handleEditSubmit = (values: PreparationFormValues) => {
    if (!preparation) return
    dispatch(
      preparationUpdated({
        ...preparation,
        ...values,
        targetDate: values.targetDate || null,
        updatedAt: new Date().toISOString(),
      }),
    )
    setEditOpen(false)
    toast.success('Preparation updated')
  }

  if (!preparationsHydrated) return null

  if (!preparation) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <EmptyState
          title="Preparation not found"
          description="It may have been deleted, or the link is incorrect."
          action={
            <Link
              href="/preparations"
              className="text-sm font-medium text-brand hover:underline"
            >
              Back to your preparations
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-10">
      <Link
        href="/preparations"
        className="inline-flex w-fit items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft size={15} />
        Back to Preparations
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            {preparation.title}
          </h1>
          {preparation.description && (
            <p className="mt-1 max-w-xl text-sm text-muted">
              {preparation.description}
            </p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge tone="brand">{preparation.type}</Badge>
            <Badge tone="warning">
              {PRIORITY_LABELS[preparation.priority]} priority
            </Badge>
            {preparation.targetDate && (
              <Badge tone="neutral">
                Target: {new Date(preparation.targetDate).toLocaleDateString()}
              </Badge>
            )}
            {preparation.status === 'archived' && (
              <Badge tone="neutral">Archived</Badge>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={() => setEditOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-2"
        >
          <Pencil size={15} />
          Edit
        </button>
      </div>

      {topics.length > 0 && (
        <div className="flex items-center gap-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full rounded-full bg-brand transition-all duration-300"
              style={{
                width: `${Math.round((completedCount / topics.length) * 100)}%`,
              }}
            />
          </div>
          <span className="shrink-0 text-xs font-medium text-muted">
            {completedCount} of {topics.length} completed
          </span>
        </div>
      )}

      <AddTopicPanel onAddSingle={addSingleTopic} onAddBulk={addBulkTopics} />

      {topics.length > 1 && (
        <p className="-mb-2 text-xs text-muted">
          Drag the handle on the left of a topic to reorder it.
        </p>
      )}

      <TopicList
        topics={topics}
        onRename={(id, name) => updateTopic(id, { name })}
        onStatusChange={(id, status) => updateTopic(id, { status })}
        onPriorityChange={(id, priority) => updateTopic(id, { priority })}
        onDelete={deleteTopic}
        onReorder={reorderTopics}
      />

      <PreparationFormModal
        open={editOpen}
        preparation={preparation}
        onClose={() => setEditOpen(false)}
        onSubmit={handleEditSubmit}
      />
    </div>
  )
}

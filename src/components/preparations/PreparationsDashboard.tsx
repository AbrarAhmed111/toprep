'use client'

import { useMemo, useState } from 'react'
import { Plus, Search as SearchIcon, FolderKanban } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  preparationAdded,
  preparationRemoved,
  preparationUpdated,
} from '@/store/preparations/preparationsSlice'
import {
  topicsAddedMany,
  topicsRemovedByPreparation,
} from '@/store/topics/topicsSlice'
import { generateId } from '@/lib/id'
import { Preparation } from '@/types/preparation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { PreparationCard } from './PreparationCard'
import {
  PreparationFormModal,
  PreparationFormValues,
} from './PreparationFormModal'

export function PreparationsDashboard() {
  const dispatch = useAppDispatch()
  const preparations = useAppSelector(state => state.preparations.items)
  const hydrated = useAppSelector(state => state.preparations.hydrated)
  const topics = useAppSelector(state => state.topics.items)

  const [query, setQuery] = useState('')
  const [showArchived, setShowArchived] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Preparation | null>(null)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return preparations
      .filter(p => (showArchived ? true : p.status === 'active'))
      .filter(p => (q ? p.title.toLowerCase().includes(q) : true))
  }, [preparations, query, showArchived])

  const topicStats = useMemo(() => {
    const stats = new Map<string, { total: number; completed: number }>()
    for (const topic of topics) {
      const entry = stats.get(topic.preparationId) ?? { total: 0, completed: 0 }
      entry.total += 1
      if (topic.status === 'completed') entry.completed += 1
      stats.set(topic.preparationId, entry)
    }
    return stats
  }, [topics])

  const openCreateForm = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const openEditForm = (preparation: Preparation) => {
    setEditing(preparation)
    setFormOpen(true)
  }

  const handleSubmit = (values: PreparationFormValues) => {
    const now = new Date().toISOString()
    if (editing) {
      dispatch(
        preparationUpdated({
          ...editing,
          ...values,
          targetDate: values.targetDate || null,
          updatedAt: now,
        }),
      )
      toast.success('Preparation updated')
    } else {
      dispatch(
        preparationAdded({
          id: generateId(),
          ...values,
          targetDate: values.targetDate || null,
          status: 'active',
          createdAt: now,
          updatedAt: now,
        }),
      )
      toast.success('Preparation created')
    }
    setFormOpen(false)
  }

  const handleDuplicate = (preparation: Preparation) => {
    const now = new Date().toISOString()
    const newId = generateId()
    dispatch(
      preparationAdded({
        ...preparation,
        id: newId,
        title: `${preparation.title} (Copy)`,
        status: 'active',
        createdAt: now,
        updatedAt: now,
      }),
    )
    const relatedTopics = topics.filter(t => t.preparationId === preparation.id)
    if (relatedTopics.length) {
      dispatch(
        topicsAddedMany(
          relatedTopics.map(topic => ({
            ...topic,
            id: generateId(),
            preparationId: newId,
            createdAt: now,
            updatedAt: now,
          })),
        ),
      )
    }
    toast.success('Preparation duplicated')
  }

  const handleToggleArchive = (preparation: Preparation) => {
    dispatch(
      preparationUpdated({
        ...preparation,
        status: preparation.status === 'archived' ? 'active' : 'archived',
        updatedAt: new Date().toISOString(),
      }),
    )
  }

  const confirmDelete = () => {
    if (!pendingDeleteId) return
    dispatch(preparationRemoved(pendingDeleteId))
    dispatch(topicsRemovedByPreparation(pendingDeleteId))
    setPendingDeleteId(null)
    toast.success('Preparation deleted')
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Your Preparations
          </h1>
          <p className="text-sm text-muted">Less searching. More prepping.</p>
        </div>
        <Button onClick={openCreateForm}>
          <Plus size={16} />
          New Preparation
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <SearchIcon
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <Input
            aria-label="Search preparations"
            placeholder="Search preparations..."
            value={query}
            onChange={event => setQuery(event.target.value)}
            className="pl-9"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-muted">
          <input
            type="checkbox"
            checked={showArchived}
            onChange={event => setShowArchived(event.target.checked)}
            className="h-4 w-4 rounded border-border text-brand focus:ring-brand/40"
          />
          Show archived
        </label>
      </div>

      {!hydrated ? null : filtered.length === 0 ? (
        <EmptyState
          icon={<FolderKanban size={32} />}
          title={
            preparations.length === 0
              ? 'No preparations yet'
              : 'No matches found'
          }
          description={
            preparations.length === 0
              ? 'Create a preparation for an interview, exam, or certification to get started.'
              : 'Try a different search or show archived preparations.'
          }
          action={
            preparations.length === 0 ? (
              <Button onClick={openCreateForm} size="sm">
                <Plus size={16} />
                New Preparation
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(preparation => {
            const stats = topicStats.get(preparation.id) ?? {
              total: 0,
              completed: 0,
            }
            return (
              <PreparationCard
                key={preparation.id}
                preparation={preparation}
                topicCount={stats.total}
                completedCount={stats.completed}
                onEdit={() => openEditForm(preparation)}
                onDuplicate={() => handleDuplicate(preparation)}
                onToggleArchive={() => handleToggleArchive(preparation)}
                onDelete={() => setPendingDeleteId(preparation.id)}
              />
            )
          })}
        </div>
      )}

      <PreparationFormModal
        open={formOpen}
        preparation={editing}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={pendingDeleteId !== null}
        title="Delete preparation"
        description="This will permanently delete the preparation and all of its topics. This can't be undone."
        confirmLabel="Delete"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setPendingDeleteId(null)}
      />
    </div>
  )
}

'use client'

import { useEffect, useMemo, useState } from 'react'
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
import {
  sectionAdded,
  sectionUpdated,
  sectionRemoved,
  sectionsReordered,
} from '@/store/sections/sectionsSlice'
import {
  topicSelectionToggled,
  topicSelectionSet,
  topicSelectionCleared,
} from '@/store/selection/selectionSlice'
import { generateId } from '@/lib/id'
import { parseBulkTopics } from '@/lib/topics/parseBulkTopics'
import { TopicOrganizeResult } from '@/lib/api/topicOrganizer'
import { Topic, TopicStatus } from '@/types/preparation'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { AddTopicPanel } from '@/components/topics/AddTopicPanel'
import { AiOrganizeButton } from '@/components/topics/AiOrganizeButton'
import { SectionBoard } from '@/components/sections/SectionBoard'
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
  const allSections = useAppSelector(state => state.sections.items)
  const selectedTopicIds = useAppSelector(
    state => state.selection.selectedTopicIds,
  )
  const [editOpen, setEditOpen] = useState(false)

  const topics = useMemo(
    () =>
      allTopics
        .filter(t => t.preparationId === preparationId)
        .sort((a, b) => a.position - b.position),
    [allTopics, preparationId],
  )

  const sections = useMemo(
    () =>
      allSections
        .filter(s => s.preparationId === preparationId)
        .sort((a, b) => a.position - b.position),
    [allSections, preparationId],
  )

  // Selection is ephemeral, shared Redux state — clear it whenever the
  // workspace unmounts or the preparation changes so it never leaks
  // between preparations.
  useEffect(() => {
    return () => {
      dispatch(topicSelectionCleared())
    }
  }, [dispatch, preparationId])

  const nextTopicPosition = useMemo(
    () => topics.reduce((max, t) => Math.max(max, t.position), -1) + 1,
    [topics],
  )

  const nextSectionPosition = useMemo(
    () => sections.reduce((max, s) => Math.max(max, s.position), -1) + 1,
    [sections],
  )

  const existingNames = useMemo(
    () => new Set(topics.map(t => t.name.toLowerCase())),
    [topics],
  )

  const existingSectionNames = useMemo(
    () => new Set(sections.map(s => s.name.toLowerCase())),
    [sections],
  )

  const completedCount = useMemo(
    () => topics.filter(t => t.status === 'completed').length,
    [topics],
  )

  const validSelectedTopicIds = useMemo(
    () => selectedTopicIds.filter(id => topics.some(t => t.id === id)),
    [selectedTopicIds, topics],
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
        notes: '',
        position: nextTopicPosition,
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
          notes: '',
          position: nextTopicPosition + index,
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
    dispatch(topicSelectionSet(validSelectedTopicIds.filter(sid => sid !== id)))
  }

  const reorderTopics = (orderedIds: string[]) => {
    dispatch(topicsReordered({ preparationId, orderedIds }))
  }

  // Applies an AI organize result: creates any new sections the AI
  // introduced, reassigns each topic to its suggested section (reusing an
  // existing section when the name matches, case-insensitively), and sets
  // the new order — all in one synchronous pass so React batches it into a
  // single re-render and the whole board reflows in one animation.
  const applyAiOrganization = (result: TopicOrganizeResult) => {
    const now = new Date().toISOString()
    const sectionIdByName = new Map(
      sections.map(s => [s.name.toLowerCase(), s.id]),
    )

    const newSectionNames: string[] = []
    for (const assignment of result.section_assignments) {
      const name = assignment.section_name?.trim()
      if (!name) continue
      const key = name.toLowerCase()
      if (
        !sectionIdByName.has(key) &&
        !newSectionNames.some(n => n.toLowerCase() === key)
      ) {
        newSectionNames.push(name)
      }
    }

    let position = nextSectionPosition
    for (const name of newSectionNames) {
      const id = generateId()
      dispatch(
        sectionAdded({
          id,
          preparationId,
          name,
          position: position++,
          createdAt: now,
          updatedAt: now,
        }),
      )
      sectionIdByName.set(name.toLowerCase(), id)
    }

    const sectionIdByTopicId = new Map<string, string | null>()
    for (const assignment of result.section_assignments) {
      const name = assignment.section_name?.trim()
      sectionIdByTopicId.set(
        assignment.topic_id,
        name ? (sectionIdByName.get(name.toLowerCase()) ?? null) : null,
      )
    }

    result.ordered_topic_ids.forEach((topicId, index) => {
      const topic = topics.find(t => t.id === topicId)
      if (!topic) return
      const nextSectionId = sectionIdByTopicId.has(topicId)
        ? (sectionIdByTopicId.get(topicId) ?? null)
        : topic.sectionId
      dispatch(
        topicUpdated({
          ...topic,
          position: index,
          sectionId: nextSectionId,
          updatedAt: now,
        }),
      )
    })
  }

  const moveTopicToSection = (id: string, sectionId: string | null) => {
    updateTopic(id, { sectionId })
  }

  const toggleSelectTopic = (id: string) => {
    dispatch(topicSelectionToggled(id))
  }

  const selectManyTopics = (ids: string[], select: boolean) => {
    const set = new Set(validSelectedTopicIds)
    ids.forEach(id => (select ? set.add(id) : set.delete(id)))
    dispatch(topicSelectionSet(Array.from(set)))
  }

  const selectAllInPreparation = () => {
    dispatch(topicSelectionSet(topics.map(t => t.id)))
  }

  const clearSelection = () => {
    dispatch(topicSelectionCleared())
  }

  const addSection = (name: string) => {
    if (existingSectionNames.has(name.toLowerCase())) {
      toast.error('A section with that name already exists')
      return
    }
    const now = new Date().toISOString()
    dispatch(
      sectionAdded({
        id: generateId(),
        preparationId,
        name,
        position: nextSectionPosition,
        createdAt: now,
        updatedAt: now,
      }),
    )
    toast.success(`Added section "${name}"`)
  }

  const renameSection = (id: string, name: string) => {
    const section = sections.find(s => s.id === id)
    if (!section) return
    dispatch(
      sectionUpdated({ ...section, name, updatedAt: new Date().toISOString() }),
    )
  }

  const reorderSections = (orderedIds: string[]) => {
    dispatch(sectionsReordered({ preparationId, orderedIds }))
  }

  const deleteSection = (id: string, deleteTopics: boolean) => {
    const sectionTopics = topics.filter(t => t.sectionId === id)
    for (const topic of sectionTopics) {
      if (deleteTopics) dispatch(topicRemoved(topic.id))
      else
        dispatch(
          topicUpdated({
            ...topic,
            sectionId: null,
            updatedAt: new Date().toISOString(),
          }),
        )
    }
    dispatch(sectionRemoved(id))
    toast.success('Section deleted')
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
              className="text-sm font-medium text-primary hover:underline"
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
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
            {preparation.title}
          </h1>
          {preparation.description && (
            <p className="mt-1 max-w-xl text-sm text-muted">
              {preparation.description}
            </p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge tone="primary">{preparation.type}</Badge>
            {preparation.targetDate && (
              <Badge tone="neutral">
                Target: {new Date(preparation.targetDate).toLocaleDateString()}
              </Badge>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={() => setEditOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-hover"
        >
          <Pencil size={15} />
          Edit
        </button>
      </div>

      {topics.length > 0 && (
        <ProgressBar
          value={completedCount}
          max={topics.length}
          label={`${completedCount} of ${topics.length} completed`}
        />
      )}

      <AddTopicPanel onAddSingle={addSingleTopic} onAddBulk={addBulkTopics} />

      {validSelectedTopicIds.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-surface-hover px-3 py-2 text-sm">
          <span className="font-medium text-foreground">
            {validSelectedTopicIds.length} selected
          </span>
          {validSelectedTopicIds.length < topics.length && (
            <button
              type="button"
              onClick={selectAllInPreparation}
              className="font-medium text-primary hover:underline"
            >
              Select all ({topics.length})
            </button>
          )}
          <button
            type="button"
            onClick={clearSelection}
            className="font-medium text-muted hover:text-foreground hover:underline"
          >
            Clear
          </button>
        </div>
      )}

      {topics.length > 1 && (
        <div className="-mb-2 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-muted">
            Drag the handle on the left of a topic to reorder it.
          </p>
          <AiOrganizeButton
            preparation={preparation}
            topics={topics}
            sections={sections}
            onApply={applyAiOrganization}
          />
        </div>
      )}

      <SectionBoard
        sections={sections}
        topics={topics}
        selectedTopicIds={validSelectedTopicIds}
        preparation={preparation}
        onToggleSelectTopic={toggleSelectTopic}
        onSelectManyTopics={selectManyTopics}
        onRenameTopic={(id, name) => updateTopic(id, { name })}
        onStatusChangeTopic={(id, status) => updateTopic(id, { status })}
        onMoveTopicToSection={moveTopicToSection}
        onDeleteTopic={deleteTopic}
        onUpdateTopic={(id, updates) => updateTopic(id, updates)}
        onReorderTopicsInGroup={reorderTopics}
        onAddSection={addSection}
        onRenameSection={renameSection}
        onDeleteSection={deleteSection}
        onReorderSections={reorderSections}
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

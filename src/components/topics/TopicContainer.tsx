'use client'

import { KeyboardEvent, useEffect, useRef, useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  CheckCircle2,
  ChevronRight,
  GripVertical,
  Trash2,
  Zap,
} from 'lucide-react'
import clsx from 'clsx'
import toast from 'react-hot-toast'
import {
  Preparation,
  Section,
  Topic,
  TopicStatus,
  TOPIC_STATUS_LABELS,
} from '@/types/preparation'
import { InlineEditableText } from '@/components/ui/InlineEditableText'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Textarea } from '@/components/ui/Textarea'
import { FormattedText } from '@/components/ui/FormattedText'
import { TopicYouTubeSearchRedesigned } from '@/components/youtube/TopicYouTubeSearchRedesigned'
import {
  generateTopicExplanation,
  generateExpectedQuestions,
} from '@/lib/api/aiService'

// Three staggered pulsing dots — the one loading affordance shared across
// every topic-level lookup (Explain, Questions, and the YouTube search).
function AnimatedLoader() {
  return (
    <div className="flex gap-1">
      <div
        className="h-2 w-2 animate-pulse rounded-full bg-current opacity-40"
        style={{ animationDelay: '0ms' }}
      />
      <div
        className="h-2 w-2 animate-pulse rounded-full bg-current opacity-60"
        style={{ animationDelay: '150ms' }}
      />
      <div
        className="h-2 w-2 animate-pulse rounded-full bg-current opacity-100"
        style={{ animationDelay: '300ms' }}
      />
    </div>
  )
}

interface TopicContainerProps {
  topic: Topic
  sections: Section[]
  isSelected: boolean
  onToggleSelect: () => void
  onRename: (name: string) => void
  onStatusChange: (status: TopicStatus) => void
  onMoveToSection: (sectionId: string | null) => void
  onDelete: () => void
  preparation?: Preparation
  onUpdateTopic?: (updates: Partial<Topic>) => void
}

// "Need to study" gets the attention-drawing blue; "understood" is a
// deliberately neutral middle state; "completed" is green; "skipping" fades
// into the background — mirrors the StatusBadge chip shown on the row above.
const STATUS_SELECT_CLASSES: Record<TopicStatus, string> = {
  need_to_study: 'bg-primary/10 text-primary',
  understood: 'bg-surface-hover text-foreground',
  completed: 'bg-success/10 text-success',
  skipping: 'bg-border/40 text-status-skip',
}

export function TopicContainer({
  topic,
  sections,
  isSelected,
  onToggleSelect,
  onRename,
  onStatusChange,
  onMoveToSection,
  onDelete,
  preparation,
  onUpdateTopic,
}: TopicContainerProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isGeneratingExplanation, setIsGeneratingExplanation] = useState(false)
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false)
  const [noteDraft, setNoteDraft] = useState(topic.notes)
  const [notesSaved, setNotesSaved] = useState(false)
  const noteSaveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const notesSavedFlash = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (noteSaveTimeout.current) clearTimeout(noteSaveTimeout.current)
      if (notesSavedFlash.current) clearTimeout(notesSavedFlash.current)
    }
  }, [])

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

  const toggleExpanded = () => setIsExpanded(value => !value)

  const handleRowKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      toggleExpanded()
    }
  }

  const handleGenerateExplanation = async () => {
    if (!preparation) return
    setIsGeneratingExplanation(true)
    try {
      const result = await generateTopicExplanation(topic, preparation)
      onUpdateTopic?.({ aiExplanation: result.explanation })
      toast.success('Explanation generated!')
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to generate explanation',
      )
    } finally {
      setIsGeneratingExplanation(false)
    }
  }

  const handleGenerateQuestions = async () => {
    if (!preparation) return
    setIsGeneratingQuestions(true)
    try {
      const result = await generateExpectedQuestions(topic, preparation)
      onUpdateTopic?.({ aiExpectedQuestions: result.questions })
      toast.success('Questions generated!')
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to generate questions',
      )
    } finally {
      setIsGeneratingQuestions(false)
    }
  }

  const commitNotes = (value: string) => {
    onUpdateTopic?.({ notes: value })
    setNotesSaved(true)
    if (notesSavedFlash.current) clearTimeout(notesSavedFlash.current)
    notesSavedFlash.current = setTimeout(() => setNotesSaved(false), 1500)
  }

  const handleNotesChange = (value: string) => {
    setNoteDraft(value)
    if (noteSaveTimeout.current) clearTimeout(noteSaveTimeout.current)
    noteSaveTimeout.current = setTimeout(() => commitNotes(value), 600)
  }

  const handleNotesBlur = () => {
    if (noteSaveTimeout.current) {
      clearTimeout(noteSaveTimeout.current)
      noteSaveTimeout.current = null
    }
    commitNotes(noteDraft)
  }

  const hasQuestions =
    topic.aiExpectedQuestions && topic.aiExpectedQuestions.length > 0

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={clsx('flex flex-col', isDragging && 'relative z-10')}
    >
      <div
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        onClick={toggleExpanded}
        onKeyDown={handleRowKeyDown}
        className={clsx(
          'group flex cursor-pointer items-start gap-2 rounded-lg py-2.5 pl-1 pr-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
          isDragging ? 'bg-surface shadow-md' : 'hover:bg-surface-hover',
        )}
      >
        <button
          type="button"
          aria-label="Drag to reorder topic"
          onClick={event => event.stopPropagation()}
          className="mt-0.5 shrink-0 cursor-grab touch-none rounded-md p-1 text-muted/50 transition-colors hover:bg-surface-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical size={14} />
        </button>

        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggleSelect}
          onClick={event => event.stopPropagation()}
          className="mt-1.5 h-4 w-4 shrink-0 cursor-pointer rounded border-border accent-primary focus:ring-2 focus:ring-primary"
          aria-label={`Select ${topic.name}`}
        />

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <InlineEditableText
            value={topic.name}
            onCommit={onRename}
            as="label"
            ariaLabel={`Rename ${topic.name}`}
          />
          <StatusBadge status={topic.status} className="w-fit" />
        </div>

        <ChevronRight
          size={16}
          aria-hidden="true"
          className={clsx(
            'mt-1.5 shrink-0 text-muted transition-transform duration-200',
            isExpanded && 'rotate-90',
          )}
        />
      </div>

      {isExpanded && (
        <div className="ml-8 mt-1 flex flex-col gap-3 border-l-2 border-border py-2 pl-4 sm:ml-9">
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={topic.status}
              onChange={e => onStatusChange(e.target.value as TopicStatus)}
              className={clsx(
                'cursor-pointer rounded-md border-0 px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50',
                STATUS_SELECT_CLASSES[topic.status],
              )}
            >
              {Object.entries(TOPIC_STATUS_LABELS).map(([status, label]) => (
                <option key={status} value={status}>
                  {label}
                </option>
              ))}
            </select>

            <select
              value={topic.sectionId ?? ''}
              onChange={e => onMoveToSection(e.target.value || null)}
              aria-label="Move to section"
              className="cursor-pointer rounded-md border border-border bg-surface px-3 py-1 text-xs font-medium text-foreground transition-colors hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">Unsectioned</option>
              {sections.map(section => (
                <option key={section.id} value={section.id}>
                  {section.name}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={onDelete}
              className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-muted transition-colors hover:bg-danger-bg hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>

          {preparation && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleGenerateExplanation}
                disabled={isGeneratingExplanation}
                className={clsx(
                  'inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50',
                  topic.aiExplanation
                    ? 'border-success/30 bg-success/5 text-success hover:bg-success/10'
                    : 'border-border bg-surface text-foreground hover:bg-surface-hover',
                )}
                title={
                  topic.aiExplanation
                    ? 'Explanation generated'
                    : 'Generate explanation'
                }
              >
                {isGeneratingExplanation ? (
                  <>
                    <AnimatedLoader />
                    <span>Explaining...</span>
                  </>
                ) : topic.aiExplanation ? (
                  <>
                    <CheckCircle2 size={14} />
                    <span>Explained</span>
                  </>
                ) : (
                  <>
                    <Zap size={14} />
                    <span>Explain</span>
                  </>
                )}
              </button>

              <button
                onClick={handleGenerateQuestions}
                disabled={isGeneratingQuestions}
                className={clsx(
                  'inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50',
                  hasQuestions
                    ? 'border-success/30 bg-success/5 text-success hover:bg-success/10'
                    : 'border-border bg-surface text-foreground hover:bg-surface-hover',
                )}
                title={
                  hasQuestions ? 'Questions generated' : 'Generate questions'
                }
              >
                {isGeneratingQuestions ? (
                  <>
                    <AnimatedLoader />
                    <span>Asking...</span>
                  </>
                ) : hasQuestions ? (
                  <>
                    <CheckCircle2 size={14} />
                    <span>Questioned</span>
                  </>
                ) : (
                  <>
                    <Zap size={14} />
                    <span>Questions</span>
                  </>
                )}
              </button>
            </div>
          )}

          <TopicYouTubeSearchRedesigned
            topicName={topic.name}
            topicId={topic.id}
          />

          {topic.aiExplanation && (
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
              <p className="text-sm leading-relaxed text-foreground">
                <FormattedText text={topic.aiExplanation} />
              </p>
            </div>
          )}

          {isGeneratingExplanation && (
            <div className="space-y-2 rounded-lg border border-border bg-surface-hover p-3">
              <div className="h-3 w-3/4 rounded bg-border" />
              <div className="h-3 w-1/2 rounded bg-border" />
            </div>
          )}

          {hasQuestions && (
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
              <ul className="space-y-2 text-sm text-foreground">
                {topic.aiExpectedQuestions.map((question, idx) => (
                  <li key={idx} className="flex gap-2.5">
                    <span className="shrink-0 font-medium text-primary">
                      {idx + 1}.
                    </span>
                    <span>
                      <FormattedText text={question} />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {isGeneratingQuestions && (
            <div className="space-y-2 rounded-lg border border-border bg-surface-hover p-3">
              <div className="h-3 w-full rounded bg-border" />
              <div className="h-3 w-5/6 rounded bg-border" />
              <div className="h-3 w-4/5 rounded bg-border" />
            </div>
          )}

          <div className="flex flex-col gap-1.5 border-t border-border pt-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                Notes
              </span>
              <span
                className={clsx(
                  'text-xs text-success transition-opacity duration-300',
                  notesSaved ? 'opacity-100' : 'opacity-0',
                )}
              >
                Saved
              </span>
            </div>
            <Textarea
              value={noteDraft}
              onChange={e => handleNotesChange(e.target.value)}
              onBlur={handleNotesBlur}
              placeholder="Personal notes for this topic…"
              rows={2}
              aria-label={`Notes for ${topic.name}`}
            />
          </div>
        </div>
      )}
    </div>
  )
}

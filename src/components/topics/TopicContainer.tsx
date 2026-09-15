'use client'

import { useState } from 'react'
import { Trash2, Pencil, Check, X, Zap } from 'lucide-react'
import toast from 'react-hot-toast'
import { Topic, TopicStatus, TOPIC_STATUS_LABELS } from '@/types/preparation'
import { TopicYouTubeSearchRedesigned } from '@/components/youtube/TopicYouTubeSearchRedesigned'
import { generateTopicExplanation, generateExpectedQuestions } from '@/lib/api/aiService'

interface TopicContainerProps {
  topic: Topic
  isSelected: boolean
  onToggleSelect: () => void
  onRename: (name: string) => void
  onStatusChange: (status: TopicStatus) => void
  onDelete: () => void
  onOpen?: () => void
  preparation?: { type: string; description: string }
  onUpdateTopic?: (updates: Partial<Topic>) => void
}

const STATUS_COLORS: Record<TopicStatus, { bg: string; text: string; badge: string }> = {
  need_to_study: { bg: 'bg-muted/5', text: 'text-muted', badge: 'bg-muted/10 text-muted' },
  understood: { bg: 'bg-teal/5', text: 'text-teal', badge: 'bg-teal/10 text-teal' },
  completed: { bg: 'bg-success/5', text: 'text-success', badge: 'bg-success/10 text-success' },
  skipping: { bg: 'bg-border/10', text: 'text-muted', badge: 'bg-border/20 text-muted' },
}

export function TopicContainer({
  topic,
  isSelected,
  onToggleSelect,
  onRename,
  onStatusChange,
  onDelete,
  onOpen,
  preparation,
  onUpdateTopic,
}: TopicContainerProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [draftName, setDraftName] = useState(topic.name)
  const [isGeneratingExplanation, setIsGeneratingExplanation] = useState(false)
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false)
  const colors = STATUS_COLORS[topic.status]

  const handleGenerateExplanation = async () => {
    if (!preparation) return
    setIsGeneratingExplanation(true)
    try {
      const result = await generateTopicExplanation(topic, preparation as any)
      onUpdateTopic?.({ aiExplanation: result.explanation })
      toast.success('Explanation generated!')
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to generate explanation',
      )
    } finally {
      setIsGeneratingExplanation(false)
    }
  }

  const handleGenerateQuestions = async () => {
    if (!preparation) return
    setIsGeneratingQuestions(true)
    try {
      const result = await generateExpectedQuestions(topic, preparation as any)
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

  const commitRename = () => {
    const trimmed = draftName.trim()
    if (trimmed && trimmed !== topic.name) {
      onRename(trimmed)
    } else {
      setDraftName(topic.name)
    }
    setIsEditing(false)
  }

  return (
    <div className={`group rounded-2xl border transition-all ${colors.bg} border-border hover:border-border/60 hover:shadow-sm`}>
      {/* Topic Header - Clean and Spacious */}
      <div className="px-6 py-5 sm:px-8 sm:py-6">
        {/* Top Row - Selection & Title */}
        <div className="flex items-start gap-4">
          {/* Checkbox */}
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggleSelect}
            className="mt-1.5 h-5 w-5 shrink-0 rounded border-border accent-brand focus:ring-2 focus:ring-brand cursor-pointer"
            aria-label={`Select ${topic.name}`}
          />

          {/* Title & Editing */}
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="flex gap-2 items-center">
                <input
                  autoFocus
                  value={draftName}
                  onChange={e => setDraftName(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') commitRename()
                    if (e.key === 'Escape') {
                      setDraftName(topic.name)
                      setIsEditing(false)
                    }
                  }}
                  className="flex-1 rounded-lg border border-brand bg-surface px-3 py-2 text-lg font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-brand/50"
                />
                <button
                  onClick={commitRename}
                  className="rounded-lg p-2 text-success hover:bg-success/10 transition-colors"
                  title="Save"
                >
                  <Check size={18} />
                </button>
                <button
                  onClick={() => {
                    setDraftName(topic.name)
                    setIsEditing(false)
                  }}
                  className="rounded-lg p-2 text-muted hover:bg-surface-2 transition-colors"
                  title="Cancel"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="group/edit flex items-center gap-2 text-left"
              >
                <h3 className="text-lg font-semibold text-foreground leading-tight">
                  {topic.name}
                </h3>
                <Pencil
                  size={16}
                  className="text-muted opacity-0 group-hover/edit:opacity-100 transition-opacity"
                />
              </button>
            )}

            {/* Status Badge & Actions */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {/* Status Badge */}
              <select
                value={topic.status}
                onChange={e => onStatusChange(e.target.value as TopicStatus)}
                className={`text-xs font-medium rounded-full px-3 py-1 cursor-pointer transition-colors border-0 focus:outline-none focus:ring-2 focus:ring-brand/50 ${colors.badge}`}
              >
                {Object.entries(TOPIC_STATUS_LABELS).map(([status, label]) => (
                  <option key={status} value={status}>
                    {label}
                  </option>
                ))}
              </select>

              {/* AI Buttons */}
              {preparation && (
                <>
                  <button
                    onClick={handleGenerateExplanation}
                    disabled={isGeneratingExplanation}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-surface-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Generate explanation"
                  >
                    <Zap size={14} />
                    {isGeneratingExplanation ? 'Explaining...' : 'Explain'}
                  </button>
                  <button
                    onClick={handleGenerateQuestions}
                    disabled={isGeneratingQuestions}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-surface-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Generate questions"
                  >
                    <Zap size={14} />
                    {isGeneratingQuestions ? 'Asking...' : 'Questions'}
                  </button>
                </>
              )}

              {/* Delete Button */}
              <button
                onClick={onDelete}
                className="ml-auto rounded-lg p-2 text-muted hover:bg-danger/10 hover:text-danger transition-colors"
                title="Delete topic"
              >
                <Trash2 size={16} />
              </button>
            </div>

            {/* Generated Content Display */}
            {topic.aiExplanation && (
              <div className="mt-3 rounded-lg border border-border/40 bg-surface/50 p-3">
                <p className="text-sm text-foreground leading-relaxed">
                  {topic.aiExplanation}
                </p>
              </div>
            )}

            {topic.aiExpectedQuestions && topic.aiExpectedQuestions.length > 0 && (
              <div className="mt-3 rounded-lg border border-border/40 bg-surface/50 p-3">
                <ul className="space-y-1.5 text-sm text-foreground">
                  {topic.aiExpectedQuestions.map((question, idx) => (
                    <li key={idx} className="flex gap-2.5">
                      <span className="shrink-0 font-medium text-muted">{idx + 1}.</span>
                      <span>{question}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-border/40" />

      {/* YouTube Learning Section - Native Integration */}
      <div className="px-6 py-5 sm:px-8 sm:py-6">
        <TopicYouTubeSearchRedesigned
          topicName={topic.name}
          topicId={topic.id}
        />
      </div>
    </div>
  )
}

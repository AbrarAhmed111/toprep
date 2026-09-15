'use client'

import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/Button'
import { organizeTopics } from '@/lib/api/topicOrganizer'
import { BackendApiError } from '@/lib/api/backendClient'
import { Preparation, Topic } from '@/types/preparation'

interface AiOrganizeButtonProps {
  preparation: Preparation
  topics: Topic[]
  onApply: (orderedIds: string[]) => void
}

export function AiOrganizeButton({
  preparation,
  topics,
  onApply,
}: AiOrganizeButtonProps) {
  const [loading, setLoading] = useState(false)

  const run = async () => {
    if (loading) return
    setLoading(true)
    const previousOrder = topics.map(t => t.id)

    try {
      const data = await organizeTopics({
        preparationTitle: preparation.title,
        preparationType: preparation.type,
        topics: topics.map(t => ({ id: t.id, name: t.name })),
      })

      // Apply immediately — the reorder animates into place, so the
      // reflow itself is the feedback. No approve/reject step.
      onApply(data.ordered_topic_ids)

      toast.success(
        toastInstance => (
          <span className="flex items-center gap-3">
            <span>
              {data.reasoning
                ? `Reordered — ${data.reasoning}`
                : 'Topics reordered by AI'}
            </span>
            <button
              type="button"
              onClick={() => {
                onApply(previousOrder)
                toast.dismiss(toastInstance.id)
              }}
              className="shrink-0 font-semibold text-brand underline underline-offset-2"
            >
              Undo
            </button>
          </span>
        ),
        { duration: 6000 },
      )
    } catch (err) {
      const message =
        err instanceof BackendApiError
          ? err.message
          : 'Something went wrong reaching the AI service.'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  if (topics.length < 2) return null

  return (
    <Button variant="secondary" size="sm" onClick={run} disabled={loading}>
      <Sparkles size={15} className={loading ? 'animate-pulse' : ''} />
      {loading ? 'Organizing…' : 'Organize with AI'}
    </Button>
  )
}

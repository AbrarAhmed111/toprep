'use client'

import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/Button'
import { organizeTopics, TopicOrganizeResult } from '@/lib/api/topicOrganizer'
import { BackendApiError } from '@/lib/api/backendClient'
import { Preparation, Section, Topic } from '@/types/preparation'

interface AiOrganizeButtonProps {
  preparation: Preparation
  topics: Topic[]
  sections: Section[]
  onApply: (result: TopicOrganizeResult) => void
}

export function AiOrganizeButton({
  preparation,
  topics,
  sections,
  onApply,
}: AiOrganizeButtonProps) {
  const [loading, setLoading] = useState(false)

  const run = async () => {
    if (loading) return
    setLoading(true)

    try {
      const data = await organizeTopics({
        preparationTitle: preparation.title,
        preparationType: preparation.type,
        topics: topics.map(t => ({ id: t.id, name: t.name })),
        sections: sections.map(s => ({ id: s.id, name: s.name })),
      })

      // Apply immediately — the reorder/regroup animates into place, so
      // the reflow itself is the feedback. No approve/reject step, no
      // success toast.
      onApply(data)
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

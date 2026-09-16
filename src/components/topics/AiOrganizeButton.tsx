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
      onApply(data)
      toast.success('Reorganized')
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
      {loading ? (
        <>
          <div className="flex gap-1">
            <div
              className="h-1.5 w-1.5 animate-pulse rounded-full bg-current opacity-40"
              style={{ animationDelay: '0ms' }}
            />
            <div
              className="h-1.5 w-1.5 animate-pulse rounded-full bg-current opacity-60"
              style={{ animationDelay: '150ms' }}
            />
            <div
              className="h-1.5 w-1.5 animate-pulse rounded-full bg-current opacity-100"
              style={{ animationDelay: '300ms' }}
            />
          </div>
          Organizing your topics…
        </>
      ) : (
        <>
          <Sparkles size={15} />
          Organize with AI
        </>
      )}
    </Button>
  )
}

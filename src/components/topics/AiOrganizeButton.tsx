'use client'

import { useState } from 'react'
import { Sparkles, Wand2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/Button'
import { organizeTopics, TopicOrganizeResult } from '@/lib/api/topicOrganizer'
import { BackendApiError } from '@/lib/api/backendClient'
import { Preparation, Section, Topic } from '@/types/preparation'

// Magic sparkle animation component
function MagicSparkle() {
  return (
    <div className="relative inline-block">
      {/* Center sparkle */}
      <Wand2
        size={15}
        className="animate-spin text-brand"
        style={{ animationDuration: '2s' }}
      />

      {/* Orbiting sparkles */}
      <div className="absolute inset-0 animate-pulse">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-brand rounded-full" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-brand rounded-full" />
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-1 h-1 bg-brand rounded-full" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1 h-1 bg-brand rounded-full" />
      </div>
    </div>
  )
}

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

      // Apply immediately — the reorder/regroup animates into place
      onApply(data)

      // Count new sections created
      const newSectionNames = new Set<string>()
      for (const assignment of data.section_assignments) {
        const name = assignment.section_name?.trim()
        if (name) newSectionNames.add(name)
      }

      const existingSectionNames = new Set(sections.map(s => s.name.toLowerCase()))
      const actuallyNewSections = Array.from(newSectionNames).filter(
        name => !existingSectionNames.has(name.toLowerCase())
      )

      // Show magic success toast with details
      if (actuallyNewSections.length > 0) {
        toast.success(
          `✨ Topics organized into ${newSectionNames.size} section${newSectionNames.size === 1 ? '' : 's'}!`,
          { duration: 3000 }
        )
      } else {
        toast.success('✨ Topics reorganized with AI magic!', { duration: 3000 })
      }
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
    <div className="relative">
      {loading && (
        <>
          {/* Magic glow effect */}
          <div
            className="absolute inset-0 rounded-lg bg-brand/20 blur-lg animate-pulse"
            style={{ animationDuration: '2s' }}
          />

          {/* Floating sparkles */}
          <div className="absolute -top-2 -right-2 animate-bounce">
            <Sparkles size={12} className="text-brand" style={{ animationDuration: '0.8s' }} />
          </div>
          <div className="absolute -top-1 -left-2 animate-bounce" style={{ animationDelay: '0.2s' }}>
            <Sparkles size={10} className="text-brand/70" style={{ animationDuration: '0.8s' }} />
          </div>
          <div className="absolute -bottom-1 -right-1 animate-bounce" style={{ animationDelay: '0.4s' }}>
            <Sparkles size={10} className="text-brand/70" style={{ animationDuration: '0.8s' }} />
          </div>
        </>
      )}

      <Button
        variant="secondary"
        size="sm"
        onClick={run}
        disabled={loading}
        className={`relative transition-all ${loading ? 'ring-2 ring-brand/50' : ''}`}
      >
        {loading ? (
          <>
            <MagicSparkle />
            <span className="ml-2 animate-pulse">Organizing with Magic…</span>
          </>
        ) : (
          <>
            <Sparkles size={15} />
            <span className="ml-2">Organize with AI</span>
          </>
        )}
      </Button>
    </div>
  )
}

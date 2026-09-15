'use client'

import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Section, Topic } from '@/types/preparation'
import { Card } from '@/components/ui/Card'
import { SectionHeader } from './SectionHeader'
import { TopicList } from '@/components/topics/TopicList'

interface SectionCarouselProps {
  sections: Section[]
  topics: Topic[]
  selectedTopicIds: string[]
  preparation?: { type: string; description: string }
  onToggleSelectTopic: (id: string) => void
  onSelectManyTopics: (ids: string[], select: boolean) => void
  onRenameTopic: (id: string, name: string) => void
  onStatusChangeTopic: (id: string, status: any) => void
  onMoveTopicToSection: (id: string, sectionId: string | null) => void
  onDeleteTopic: (id: string) => void
  onUpdateTopic?: (id: string, updates: Partial<Topic>) => void
  onReorderTopicsInGroup: (orderedIds: string[]) => void
  onRenameSection: (id: string, name: string) => void
  onDeleteSection: (id: string, deleteTopics: boolean) => void
}

export function SectionCarousel({
  sections,
  topics,
  selectedTopicIds,
  preparation,
  onToggleSelectTopic,
  onSelectManyTopics,
  onRenameTopic,
  onStatusChangeTopic,
  onMoveTopicToSection,
  onDeleteTopic,
  onUpdateTopic,
  onReorderTopicsInGroup,
  onRenameSection,
  onDeleteSection,
}: SectionCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState<'next' | 'prev'>('next')

  const topicsBySection = (sectionId: string | null) =>
    topics.filter(t => t.sectionId === sectionId)

  const selectionState = (groupTopics: Topic[]) => {
    const ids = groupTopics.map(t => t.id)
    const selectedCount = ids.filter(id => selectedTopicIds.includes(id)).length
    return {
      allSelected: ids.length > 0 && selectedCount === ids.length,
      someSelected: selectedCount > 0,
    }
  }

  const currentSection = sections[currentIndex]
  const currentTopics = useMemo(
    () => topicsBySection(currentSection.id),
    [currentSection.id, topics],
  )
  const { allSelected, someSelected } = selectionState(currentTopics)

  const handlePrev = () => {
    setDirection('prev')
    setCurrentIndex((prev) => (prev === 0 ? sections.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setDirection('next')
    setCurrentIndex((prev) => (prev === sections.length - 1 ? 0 : prev + 1))
  }

  const handleDelete = (sectionId: string, deleteTopics: boolean) => {
    onDeleteSection(sectionId, deleteTopics)
    // Adjust index if needed
    if (currentIndex >= sections.length - 1 && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  return (
    <div className="space-y-4">
      {/* Carousel Header with Navigation */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={handlePrev}
          disabled={sections.length <= 1}
          className="rounded-lg border border-border bg-surface px-2.5 py-2 text-foreground transition-colors hover:bg-surface-2 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Previous section"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="flex-1 text-center">
          <p className="text-xs font-medium text-muted">
            Section {currentIndex + 1} of {sections.length}
          </p>
          <p className="text-sm font-semibold text-foreground">
            {currentSection.name}
          </p>
        </div>

        <button
          onClick={handleNext}
          disabled={sections.length <= 1}
          className="rounded-lg border border-border bg-surface px-2.5 py-2 text-foreground transition-colors hover:bg-surface-2 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Next section"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Carousel Dots */}
      <div className="flex justify-center gap-2">
        {sections.map((section, idx) => (
          <button
            key={section.id}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all ${
              idx === currentIndex
                ? 'w-6 bg-brand'
                : 'w-2 bg-border hover:bg-border/60'
            }`}
            title={`Go to ${section.name}`}
          />
        ))}
      </div>

      {/* Current Section Card with Animation */}
      <div
        className={`animate-in fade-in duration-300 ${
          direction === 'next' ? 'slide-in-from-right-4' : 'slide-in-from-left-4'
        }`}
        key={currentSection.id}
      >
        <Card className="overflow-hidden">
          <SectionHeader
            section={currentSection}
            topicCount={currentTopics.length}
            allSelected={allSelected}
            someSelected={someSelected}
            onToggleSelectAll={() =>
              onSelectManyTopics(currentTopics.map(t => t.id), !allSelected)
            }
            onRename={(name) => onRenameSection(currentSection.id, name)}
            onDelete={() =>
              handleDelete(currentSection.id, false)
            }
          />
          <div className="p-3">
            <TopicList
              topics={currentTopics}
              sections={sections}
              selectedTopicIds={selectedTopicIds}
              preparation={preparation}
              emptyMessage="Drag topics here, or move one in using its Section dropdown."
              onToggleSelect={onToggleSelectTopic}
              onRename={onRenameTopic}
              onStatusChange={onStatusChangeTopic}
              onMoveToSection={onMoveTopicToSection}
              onDelete={onDeleteTopic}
              onUpdateTopic={onUpdateTopic}
              onReorder={onReorderTopicsInGroup}
            />
          </div>
        </Card>
      </div>
    </div>
  )
}

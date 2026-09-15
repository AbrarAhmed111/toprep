'use client'

import { useState } from 'react'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { Card } from '@/components/ui/Card'
import { Section, Topic, TopicStatus, Preparation } from '@/types/preparation'
import { TopicList } from '@/components/topics/TopicList'
import { AddSectionForm } from './AddSectionForm'
import { SectionHeader } from './SectionHeader'
import { DeleteSectionDialog } from './DeleteSectionDialog'
import { SectionCarousel } from './SectionCarousel'

interface SectionBoardProps {
  sections: Section[]
  topics: Topic[]
  selectedTopicIds: string[]
  preparation?: Preparation
  onToggleSelectTopic: (id: string) => void
  onSelectManyTopics: (ids: string[], select: boolean) => void
  onRenameTopic: (id: string, name: string) => void
  onStatusChangeTopic: (id: string, status: TopicStatus) => void
  onMoveTopicToSection: (id: string, sectionId: string | null) => void
  onDeleteTopic: (id: string) => void
  onUpdateTopic?: (id: string, updates: Partial<Topic>) => void
  onReorderTopicsInGroup: (orderedIds: string[]) => void
  onAddSection: (name: string) => void
  onRenameSection: (id: string, name: string) => void
  onDeleteSection: (id: string, deleteTopics: boolean) => void
  onReorderSections: (orderedSectionIds: string[]) => void
}

export function SectionBoard({
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
  onAddSection,
  onRenameSection,
  onDeleteSection,
  onReorderSections,
}: SectionBoardProps) {
  const [pendingDelete, setPendingDelete] = useState<Section | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )
  const [sectionsAnimationParent] = useAutoAnimate({ duration: 350 })

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

  const handleSectionDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = sections.findIndex(s => s.id === active.id)
    const newIndex = sections.findIndex(s => s.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return
    const reordered = [...sections]
    const [moved] = reordered.splice(oldIndex, 1)
    reordered.splice(newIndex, 0, moved)
    onReorderSections(reordered.map(s => s.id))
  }

  const unsectionedTopics = topicsBySection(null)
  const hasSections = sections.length > 0

  return (
    <div className="flex flex-col gap-4">
      <div>
        <AddSectionForm onAdd={onAddSection} />
      </div>

      {!hasSections ? (
        <TopicList
          topics={topics}
          sections={sections}
          selectedTopicIds={selectedTopicIds}
          preparation={preparation}
          onToggleSelect={onToggleSelectTopic}
          onRename={onRenameTopic}
          onStatusChange={onStatusChangeTopic}
          onMoveToSection={onMoveTopicToSection}
          onDelete={onDeleteTopic}
          onUpdateTopic={onUpdateTopic}
          onReorder={onReorderTopicsInGroup}
        />
      ) : (
        <>
          <SectionCarousel
            sections={sections}
            topics={topics}
            selectedTopicIds={selectedTopicIds}
            preparation={preparation}
            onToggleSelectTopic={onToggleSelectTopic}
            onSelectManyTopics={onSelectManyTopics}
            onRenameTopic={onRenameTopic}
            onStatusChangeTopic={onStatusChangeTopic}
            onMoveTopicToSection={onMoveTopicToSection}
            onDeleteTopic={onDeleteTopic}
            onUpdateTopic={onUpdateTopic}
            onReorderTopicsInGroup={onReorderTopicsInGroup}
            onRenameSection={onRenameSection}
            onDeleteSection={onDeleteSection}
          />

          <div>
            <h3 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-muted">
              Unsectioned
            </h3>
            <TopicList
              topics={unsectionedTopics}
              sections={sections}
              selectedTopicIds={selectedTopicIds}
              preparation={preparation}
              emptyMessage="Every topic has a section."
              onToggleSelect={onToggleSelectTopic}
              onRename={onRenameTopic}
              onStatusChange={onStatusChangeTopic}
              onMoveToSection={onMoveTopicToSection}
              onDelete={onDeleteTopic}
              onUpdateTopic={onUpdateTopic}
              onReorder={onReorderTopicsInGroup}
            />
          </div>
        </>
      )}

      <DeleteSectionDialog
        open={pendingDelete !== null}
        sectionName={pendingDelete?.name ?? ''}
        topicCount={
          pendingDelete ? topicsBySection(pendingDelete.id).length : 0
        }
        onCancel={() => setPendingDelete(null)}
        onConfirm={deleteTopics => {
          if (!pendingDelete) return
          onDeleteSection(pendingDelete.id, deleteTopics)
          setPendingDelete(null)
        }}
      />
    </div>
  )
}

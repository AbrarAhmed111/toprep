'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
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
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(sections.map(s => s.id))
  )

  const toggleSectionExpand = (sectionId: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId)
    } else {
      newExpanded.add(sectionId)
    }
    setExpandedSections(newExpanded)
  }

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
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleSectionDragEnd}
          >
            <SortableContext
              items={sections.map(s => s.id)}
              strategy={verticalListSortingStrategy}
            >
              <div
                ref={sectionsAnimationParent}
                className="flex flex-col gap-4"
              >
                {sections.map(section => {
                  const groupTopics = topicsBySection(section.id)
                  const { allSelected, someSelected } =
                    selectionState(groupTopics)
                  const isExpanded = expandedSections.has(section.id)

                  return (
                    <Card key={section.id} className="overflow-hidden">
                      <div className="flex items-center">
                        <button
                          onClick={() => toggleSectionExpand(section.id)}
                          className="shrink-0 p-3 text-muted hover:text-foreground transition-colors"
                          title={isExpanded ? 'Collapse section' : 'Expand section'}
                        >
                          <ChevronDown
                            size={20}
                            className={`transition-transform duration-300 ${
                              isExpanded ? '' : '-rotate-90'
                            }`}
                          />
                        </button>
                        <div className="flex-1">
                          <SectionHeader
                            section={section}
                            topicCount={groupTopics.length}
                            allSelected={allSelected}
                            someSelected={someSelected}
                            onToggleSelectAll={() =>
                              onSelectManyTopics(
                                groupTopics.map(t => t.id),
                                !allSelected,
                              )
                            }
                            onRename={name => onRenameSection(section.id, name)}
                            onDelete={() => setPendingDelete(section)}
                          />
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="border-t border-border/40 p-3 animate-in fade-in slide-in-from-top-4 duration-500">
                          {/* Glow effect on expansion */}
                          <div className="absolute inset-0 rounded-lg bg-brand/5 animate-pulse" style={{ animationDuration: '3s' }} />
                          <div className="relative">
                            <TopicList
                              topics={groupTopics}
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
                        </div>
                      )}
                    </Card>
                  )
                })}
              </div>
            </SortableContext>
          </DndContext>

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

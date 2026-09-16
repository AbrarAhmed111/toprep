'use client'

import { ListChecks } from 'lucide-react'
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
import { EmptyState } from '@/components/ui/EmptyState'
import { Section, Topic, TopicStatus, Preparation } from '@/types/preparation'
import { TopicContainer } from './TopicContainer'

interface TopicListProps {
  topics: Topic[]
  sections: Section[]
  selectedTopicIds: string[]
  emptyMessage?: string
  preparation?: Preparation
  onToggleSelect: (id: string) => void
  onRename: (id: string, name: string) => void
  onStatusChange: (id: string, status: TopicStatus) => void
  onMoveToSection: (id: string, sectionId: string | null) => void
  onDelete: (id: string) => void
  onReorder: (orderedIds: string[]) => void
  onUpdateTopic?: (id: string, updates: Partial<Topic>) => void
}

export function TopicList({
  topics,
  sections,
  selectedTopicIds,
  emptyMessage,
  preparation,
  onToggleSelect,
  onRename,
  onStatusChange,
  onMoveToSection,
  onDelete,
  onReorder,
  onUpdateTopic,
}: TopicListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )
  const [animationParent] = useAutoAnimate({ duration: 350 })

  if (topics.length === 0) {
    return (
      <EmptyState
        icon={<ListChecks size={32} />}
        title="No topics yet"
        description={
          emptyMessage ??
          'Add your first topic above, or paste a list to add many at once.'
        }
      />
    )
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = topics.findIndex(t => t.id === active.id)
    const newIndex = topics.findIndex(t => t.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return

    const reordered = [...topics]
    const [moved] = reordered.splice(oldIndex, 1)
    reordered.splice(newIndex, 0, moved)
    onReorder(reordered.map(t => t.id))
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={topics.map(t => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div ref={animationParent} className="flex flex-col">
          {topics.map(topic => (
            <TopicContainer
              key={topic.id}
              topic={topic}
              sections={sections}
              isSelected={selectedTopicIds.includes(topic.id)}
              onToggleSelect={() => onToggleSelect(topic.id)}
              onRename={name => onRename(topic.id, name)}
              onStatusChange={status => onStatusChange(topic.id, status)}
              onMoveToSection={sectionId =>
                onMoveToSection(topic.id, sectionId)
              }
              onDelete={() => onDelete(topic.id)}
              preparation={preparation}
              onUpdateTopic={updates => onUpdateTopic?.(topic.id, updates)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}

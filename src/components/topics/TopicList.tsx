'use client'

import { ListChecks } from 'lucide-react'
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
import { EmptyState } from '@/components/ui/EmptyState'
import { Topic, TopicStatus } from '@/types/preparation'
import { TopicRow } from './TopicRow'

interface TopicListProps {
  topics: Topic[]
  onRename: (id: string, name: string) => void
  onStatusChange: (id: string, status: TopicStatus) => void
  onDelete: (id: string) => void
  onReorder: (orderedIds: string[]) => void
}

export function TopicList({
  topics,
  onRename,
  onStatusChange,
  onDelete,
  onReorder,
}: TopicListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  if (topics.length === 0) {
    return (
      <EmptyState
        icon={<ListChecks size={32} />}
        title="No topics yet"
        description="Add your first topic above, or paste a list to add many at once."
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
        <Card className="overflow-hidden">
          {topics.map(topic => (
            <TopicRow
              key={topic.id}
              topic={topic}
              onRename={name => onRename(topic.id, name)}
              onStatusChange={status => onStatusChange(topic.id, status)}
              onDelete={() => onDelete(topic.id)}
            />
          ))}
        </Card>
      </SortableContext>
    </DndContext>
  )
}

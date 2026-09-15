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
  justReorganized?: boolean
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
  justReorganized,
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
    <div className="space-y-2">
      <div ref={animationParent} className="space-y-2">
        <>
          {justReorganized && (
            <style>{`
              @keyframes shimmer {
                0% { transform: translateX(-100%); opacity: 0; }
                50% { opacity: 1; }
                100% { transform: translateX(100%); opacity: 0; }
              }
              .topic-shimmer {
                animation: shimmer 2s ease-in-out;
              }
            `}</style>
          )}
          {topics.map((topic, index) => (
              <div key={topic.id}>
                {justReorganized ? (
                  <div
                    className="relative animate-in fade-in slide-in-from-left-4 duration-500"
                    style={{
                      animationDelay: `${index * 75}ms`,
                    }}
                  >
                    {/* Shimmer overlay effect - only on reorganization */}
                    <div
                      className="absolute inset-0 rounded-2xl pointer-events-none topic-shimmer"
                      style={{
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
      
                      }}
                    />
                    <TopicContainer
                      topic={topic}
                      isSelected={selectedTopicIds.includes(topic.id)}
                      onToggleSelect={() => onToggleSelect(topic.id)}
                      onRename={name => onRename(topic.id, name)}
                      onStatusChange={status => onStatusChange(topic.id, status)}
                      onDelete={() => onDelete(topic.id)}
                      preparation={preparation}
                      onUpdateTopic={updates => onUpdateTopic?.(topic.id, updates)}
                    />
                  </div>
                ) : (
                  <TopicContainer
                    topic={topic}
                    isSelected={selectedTopicIds.includes(topic.id)}
                    onToggleSelect={() => onToggleSelect(topic.id)}
                    onRename={name => onRename(topic.id, name)}
                    onStatusChange={status => onStatusChange(topic.id, status)}
                    onDelete={() => onDelete(topic.id)}
                    preparation={preparation}
                    onUpdateTopic={updates => onUpdateTopic?.(topic.id, updates)}
                  />
                )}
              </div>
            ))}
        </>
      </div>
    </div>
  )
}

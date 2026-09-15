'use client'

import { ListChecks } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Priority, Topic, TopicStatus } from '@/types/preparation'
import { TopicRow } from './TopicRow'

interface TopicListProps {
  topics: Topic[]
  onRename: (id: string, name: string) => void
  onStatusChange: (id: string, status: TopicStatus) => void
  onPriorityChange: (id: string, priority: Priority) => void
  onDelete: (id: string) => void
}

export function TopicList({
  topics,
  onRename,
  onStatusChange,
  onPriorityChange,
  onDelete,
}: TopicListProps) {
  if (topics.length === 0) {
    return (
      <EmptyState
        icon={<ListChecks size={32} />}
        title="No topics yet"
        description="Add your first topic above, or paste a list to add many at once."
      />
    )
  }

  return (
    <Card className="overflow-hidden">
      {topics.map(topic => (
        <TopicRow
          key={topic.id}
          topic={topic}
          onRename={name => onRename(topic.id, name)}
          onStatusChange={status => onStatusChange(topic.id, status)}
          onPriorityChange={priority => onPriorityChange(topic.id, priority)}
          onDelete={() => onDelete(topic.id)}
        />
      ))}
    </Card>
  )
}

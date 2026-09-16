import { generateId } from '@/lib/id'
import {
  Preparation,
  PreparationType,
  Topic,
  TopicStatus,
} from '@/types/preparation'

// Builds a fresh Preparation + its Topics from a title and a flat list of
// topic names. Pure — callers dispatch the results themselves.
export function buildPreparation(
  title: string,
  type: PreparationType,
  topicNames: string[],
): { preparation: Preparation; topics: Topic[] } {
  const now = new Date().toISOString()

  const preparation: Preparation = {
    id: generateId(),
    title,
    description: '',
    type,
    targetDate: null,
    createdAt: now,
    updatedAt: now,
  }

  const topics: Topic[] = topicNames.map((name, index) => ({
    id: generateId(),
    preparationId: preparation.id,
    sectionId: null,
    name,
    status: 'need_to_study' as TopicStatus,
    notes: '',
    position: index,
    aiExplanation: null,
    aiExpectedQuestions: [],
    selectedVideoIds: [],
    createdAt: now,
    updatedAt: now,
  }))

  return { preparation, topics }
}

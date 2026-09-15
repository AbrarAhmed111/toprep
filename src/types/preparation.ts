export type PreparationType = 'Interview' | 'Exam' | 'Certification' | 'Custom'
export type PreparationStatus = 'active' | 'archived'
export type TopicStatus =
  'need_to_study' | 'understood' | 'completed' | 'skipping'

export interface Preparation {
  id: string
  title: string
  description: string
  type: PreparationType
  targetDate: string | null
  status: PreparationStatus
  createdAt: string
  updatedAt: string
}

// Sections are part of the core data model (Phase 0) but are not yet
// exposed in the UI — that lands with Topic Organization in Phase 2.
export interface Section {
  id: string
  preparationId: string
  name: string
  position: number
  createdAt: string
  updatedAt: string
}

export interface Topic {
  id: string
  preparationId: string
  sectionId: string | null
  name: string
  status: TopicStatus
  notes: string
  position: number
  // Reserved for later phases (YouTube integration, AI features).
  aiExplanation: string | null
  aiExpectedQuestions: string[]
  selectedVideoIds: string[]
  createdAt: string
  updatedAt: string
}

export const PREPARATION_TYPES: PreparationType[] = [
  'Interview',
  'Exam',
  'Certification',
  'Custom',
]

export const TOPIC_STATUSES: TopicStatus[] = [
  'need_to_study',
  'understood',
  'completed',
  'skipping',
]

export const TOPIC_STATUS_LABELS: Record<TopicStatus, string> = {
  need_to_study: 'Need to Study',
  understood: 'Understood',
  completed: 'Completed',
  skipping: 'Skipping',
}

export type PreparationType = 'Interview' | 'Exam' | 'Certification' | 'Custom'
export type TopicStatus =
  'need_to_study' | 'understood' | 'completed' | 'skipping'

export interface Preparation {
  id: string
  title: string
  description: string
  type: PreparationType
  targetDate: string | null
  createdAt: string
  updatedAt: string
}

export interface Section {
  id: string
  preparationId: string
  name: string
  position: number
  createdAt: string
  updatedAt: string
}

export interface YouTubeVideoData {
  id: string
  title: string
  channelName: string
  thumbnailUrl: string
  duration: string
  viewCount: number
  publishedDate: string
  url: string
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
  selectedVideos?: YouTubeVideoData[]
  createdAt: string
  updatedAt: string
}

export const PREPARATION_TYPES: PreparationType[] = [
  'Interview',
  'Exam',
  'Certification',
  'Custom',
]

// Static Tailwind class strings — kept as a literal lookup (not built with
// template interpolation) so the JIT compiler can actually see and generate
// them. Each preparation type gets its own identity color instead of a
// shared blue: badge tone for text/date chips, icon for the type-icon chip
// background, and accent for a solid fill (progress bars, accent lines).
export const PREPARATION_TYPE_STYLES: Record<
  PreparationType,
  {
    badge: 'interview' | 'exam' | 'certification' | 'custom'
    icon: string
    accent: string
  }
> = {
  Interview: {
    badge: 'interview',
    icon: 'bg-type-interview/10 text-type-interview',
    accent: 'bg-type-interview',
  },
  Exam: {
    badge: 'exam',
    icon: 'bg-type-exam/10 text-type-exam',
    accent: 'bg-type-exam',
  },
  Certification: {
    badge: 'certification',
    icon: 'bg-type-certification/10 text-type-certification',
    accent: 'bg-type-certification',
  },
  Custom: {
    badge: 'custom',
    icon: 'bg-type-custom/10 text-type-custom',
    accent: 'bg-type-custom',
  },
}

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

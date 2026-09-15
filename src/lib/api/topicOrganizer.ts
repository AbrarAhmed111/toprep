import { backendFetch } from './backendClient'

export interface OrganizeTopicItem {
  id: string
  name: string
}

export interface OrganizeSectionItem {
  id: string
  name: string
}

export interface TopicSectionAssignment {
  topic_id: string
  section_name: string | null
}

export interface TopicOrganizeResult {
  ordered_topic_ids: string[]
  section_assignments: TopicSectionAssignment[]
  reasoning: string | null
  provider: string
  model: string
}

export function organizeTopics(params: {
  preparationTitle: string
  preparationType?: string
  topics: OrganizeTopicItem[]
  sections: OrganizeSectionItem[]
}): Promise<TopicOrganizeResult> {
  return backendFetch<TopicOrganizeResult>('/api/topics/organize', {
    method: 'POST',
    body: JSON.stringify({
      preparation_title: params.preparationTitle,
      preparation_type: params.preparationType,
      topics: params.topics,
      sections: params.sections,
    }),
  })
}

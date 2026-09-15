import { backendFetch } from './backendClient'

export interface OrganizeTopicItem {
  id: string
  name: string
}

export interface TopicOrganizeResult {
  ordered_topic_ids: string[]
  reasoning: string | null
  provider: string
  model: string
}

export function organizeTopics(params: {
  preparationTitle: string
  preparationType?: string
  topics: OrganizeTopicItem[]
}): Promise<TopicOrganizeResult> {
  return backendFetch<TopicOrganizeResult>('/api/topics/organize', {
    method: 'POST',
    body: JSON.stringify({
      preparation_title: params.preparationTitle,
      preparation_type: params.preparationType,
      topics: params.topics,
    }),
  })
}

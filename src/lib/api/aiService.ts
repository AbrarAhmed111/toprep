import { Topic, Preparation } from '@/types/preparation'

interface AIGenerationError {
  code: string
  message: string
}

export interface AIExplanationResponse {
  explanation: string
}

export interface AIQuestionsResponse {
  questions: string[]
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

export async function generateTopicExplanation(
  topic: Topic,
  preparation: Preparation,
): Promise<AIExplanationResponse> {
  const response = await fetch(`${API_BASE}/api/ai/explain`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      topic_name: topic.name,
      preparation_type: preparation.type,
      preparation_description: preparation.description,
    }),
  })

  if (!response.ok) {
    const error = (await response.json()) as AIGenerationError
    throw new Error(error.message || 'Failed to generate explanation')
  }

  return response.json()
}

export async function generateExpectedQuestions(
  topic: Topic,
  preparation: Preparation,
): Promise<AIQuestionsResponse> {
  const response = await fetch(`${API_BASE}/api/ai/questions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      topic_name: topic.name,
      preparation_type: preparation.type,
      preparation_description: preparation.description,
    }),
  })

  if (!response.ok) {
    const error = (await response.json()) as AIGenerationError
    throw new Error(error.message || 'Failed to generate questions')
  }

  return response.json()
}

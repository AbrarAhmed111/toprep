const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ||
  'http://localhost:8000'

export type PdfExtractionStage =
  'validating' | 'reading' | 'analyzing' | 'organizing' | 'grouping'

export interface PdfExtractionProgressEvent {
  stage: PdfExtractionStage
  status: 'active' | 'done'
  message?: string
  current?: number
  total?: number
}

export interface ExtractedPdfTopic {
  name: string
  section: string | null
}

export interface ExtractTopicsFromPdfResult {
  topics: ExtractedPdfTopic[]
}

interface CompleteEvent {
  stage: 'complete'
  status: 'done'
  topics: ExtractedPdfTopic[]
}

interface ErrorEvent {
  stage: 'error'
  status: 'error'
  message: string
  status_code: number
}

type StreamEvent = PdfExtractionProgressEvent | CompleteEvent | ErrorEvent

// Sends a PDF to the ToPrep backend for topic extraction. The backend
// streams pipeline progress as Server-Sent Events (one JSON object per
// `data:` line) so the caller can show live status instead of a bare
// spinner — see onProgress. The stream always ends in either a "complete"
// event (resolved here) or an "error" event (rejected here).
export async function extractTopicsFromPdf(
  file: File,
  onProgress?: (event: PdfExtractionProgressEvent) => void,
): Promise<ExtractTopicsFromPdfResult> {
  const formData = new FormData()
  formData.append('file', file)

  let response: Response
  try {
    response = await fetch(`${API_BASE}/api/topics/extract-pdf`, {
      method: 'POST',
      body: formData,
    })
  } catch {
    throw new Error('Could not reach the ToPrep backend service.')
  }

  if (!response.ok) {
    let detail = response.statusText
    try {
      const body = await response.json()
      detail = body.detail ?? detail
    } catch {
      // Response body wasn't JSON — fall back to statusText.
    }
    throw new Error(detail || 'Failed to extract topics from PDF')
  }

  if (!response.body) {
    throw new Error('The server did not return a response stream.')
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })

    let boundary = buffer.indexOf('\n\n')
    while (boundary !== -1) {
      const rawEvent = buffer.slice(0, boundary)
      buffer = buffer.slice(boundary + 2)
      boundary = buffer.indexOf('\n\n')

      const dataLine = rawEvent
        .split('\n')
        .find(line => line.startsWith('data: '))
      if (!dataLine) continue

      const event = JSON.parse(dataLine.slice('data: '.length)) as StreamEvent

      if (event.stage === 'complete') {
        return { topics: event.topics }
      }
      if (event.stage === 'error') {
        throw new Error(event.message || 'Failed to extract topics from PDF')
      }
      onProgress?.(event)
    }
  }

  throw new Error('The server closed the connection before finishing.')
}

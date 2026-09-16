const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ||
  'http://localhost:8000'

export interface ExtractTopicsFromPdfResult {
  topics: string[]
}

// Sends a PDF to the ToPrep backend for topic extraction. The endpoint
// itself isn't implemented yet — this defines the contract the backend
// needs to satisfy: POST multipart/form-data with a `file` field, returns
// `{ topics: string[] }`.
export async function extractTopicsFromPdf(
  file: File,
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

  return response.json() as Promise<ExtractTopicsFromPdfResult>
}

export const MAX_BULK_TOPICS = 100

export interface ParsedBulkTopics {
  names: string[]
  duplicateCount: number
  truncated: boolean
}

// Splits a pasted block of text into individual topic names, one per line,
// dropping blanks and de-duping case-insensitively within the pasted list.
export function parseBulkTopics(raw: string): ParsedBulkTopics {
  const lines = raw
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)

  const seen = new Set<string>()
  const names: string[] = []
  let duplicateCount = 0

  for (const line of lines) {
    const key = line.toLowerCase()
    if (seen.has(key)) {
      duplicateCount += 1
      continue
    }
    seen.add(key)
    names.push(line)
  }

  return {
    names: names.slice(0, MAX_BULK_TOPICS),
    duplicateCount,
    truncated: names.length > MAX_BULK_TOPICS,
  }
}

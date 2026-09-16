export interface YouTubeSearchFilters {
  duration?: 'any' | 'short' | 'medium' | 'long'
  sort?: 'relevance' | 'upload_date' | 'view_count'
}

export interface YouTubeVideo {
  id: string
  title: string
  channelName: string
  thumbnailUrl: string
  duration: string
  viewCount: number
  publishedDate: string
  url: string
}

export interface YouTubeSearchResult {
  videos: YouTubeVideo[]
  nextPageToken: string | null
}

export async function searchYouTube(
  topicName: string,
  filters: YouTubeSearchFilters = {},
  pageToken?: string,
): Promise<YouTubeSearchResult> {
  try {
    const params = new URLSearchParams({
      q: topicName,
      maxResults: '10',
    })

    if (filters.duration) {
      params.append('duration', filters.duration)
    }

    if (filters.sort) {
      params.append('sort', filters.sort)
    }

    if (pageToken) {
      params.append('pageToken', pageToken)
    }

    const response = await fetch(`/api/youtube/search?${params.toString()}`)

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'YouTube API error')
    }

    const data = await response.json()

    const videos: YouTubeVideo[] = data.videos || []
    return {
      videos,
      nextPageToken: data.nextPageToken || null,
    }
  } catch (error) {
    console.error('YouTube search error:', error)
    throw error
  }
}

// Fetch additional details (duration, view count) for videos
export async function getVideoDetails(
  videoIds: string[],
): Promise<Map<string, { duration: string; viewCount: number }>> {
  if (videoIds.length === 0) return new Map()

  try {
    const response = await fetch('/api/youtube/videos/details', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videoIds }),
    })

    if (!response.ok) {
      throw new Error('Failed to fetch video details')
    }

    const data = await response.json()
    const detailsMap = new Map()

    data.videos?.forEach((video: any) => {
      detailsMap.set(video.id, {
        duration: video.duration || 'N/A',
        viewCount: video.viewCount || 0,
      })
    })

    return detailsMap
  } catch (error) {
    console.error('Error fetching video details:', error)
    return new Map()
  }
}

// Convert ISO 8601 duration to readable format (e.g., "12:34")
function parseDuration(iso8601Duration: string): string {
  if (!iso8601Duration) return '0:00'

  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/
  const matches = iso8601Duration.match(regex)

  if (!matches) return '0:00'

  const hours = parseInt(matches[1] || '0', 10)
  const minutes = parseInt(matches[2] || '0', 10)
  const seconds = parseInt(matches[3] || '0', 10)

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }

  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

// Format view count to readable format (e.g., "125K", "1.2M")
export function formatViewCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`
  }
  return count.toString()
}

// Format published date to readable format
export function formatPublishedDate(dateString: string): string {
  const date = new Date(dateString)
  return date.getFullYear().toString()
}

import { NextRequest, NextResponse } from 'next/server'

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { videoIds } = body

    if (!videoIds || !Array.isArray(videoIds) || videoIds.length === 0) {
      return NextResponse.json(
        { error: 'videoIds array is required' },
        { status: 400 }
      )
    }

    if (!YOUTUBE_API_KEY) {
      return NextResponse.json(
        { error: 'YouTube API key not configured' },
        { status: 500 }
      )
    }

    const params = new URLSearchParams({
      id: videoIds.join(','),
      part: 'contentDetails,statistics',
      key: YOUTUBE_API_KEY,
    })

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?${params.toString()}`
    )

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch video details' },
        { status: response.status }
      )
    }

    const data = await response.json()

    const videos = data.items?.map((item: any) => ({
      id: item.id,
      duration: parseDuration(item.contentDetails?.duration || ''),
      viewCount: parseInt(item.statistics?.viewCount || '0', 10),
    })) || []

    return NextResponse.json({ videos })
  } catch (error) {
    console.error('Video details error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

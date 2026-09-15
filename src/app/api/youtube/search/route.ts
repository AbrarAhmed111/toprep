import { NextRequest, NextResponse } from 'next/server'

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const q = searchParams.get('q')
    const duration = searchParams.get('duration')
    const sort = searchParams.get('sort')
    const pageToken = searchParams.get('pageToken')
    const maxResults = searchParams.get('maxResults') || '10'

    if (!q) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required' },
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
      q,
      type: 'video',
      part: 'snippet',
      maxResults,
      key: YOUTUBE_API_KEY,
    })

    if (duration && duration !== 'any') {
      params.append('videoDuration', duration)
    }

    if (sort && sort !== 'relevance') {
      params.append('order', sort === 'upload_date' ? 'date' : sort === 'view_count' ? 'viewCount' : 'relevance')
    }

    if (pageToken) {
      params.append('pageToken', pageToken)
    }

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?${params.toString()}`
    )

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(
        { error: error.error?.message || 'YouTube API error' },
        { status: response.status }
      )
    }

    const data = await response.json()

    const videos = data.items?.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      channelName: item.snippet.channelTitle,
      thumbnailUrl: item.snippet.thumbnails.medium?.url || '',
      duration: 'Loading...',
      viewCount: 0,
      publishedDate: item.snippet.publishedAt,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    })) || []

    return NextResponse.json({
      videos,
      nextPageToken: data.nextPageToken || null,
    })
  } catch (error) {
    console.error('YouTube search error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

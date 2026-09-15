'use client'

import Image from 'next/image'
import { X, Eye } from 'lucide-react'
import { YouTubeVideoData } from '@/types/preparation'
import { formatViewCount, formatPublishedDate } from '@/lib/api/youtubeSearch'

interface SelectedVideosListProps {
  videos: YouTubeVideoData[]
  onRemove: (videoId: string) => void
}

export function SelectedVideosList({
  videos,
  onRemove,
}: SelectedVideosListProps) {
  if (videos.length === 0) return null

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <h3 className="mb-3 font-semibold text-foreground">
        Selected Videos ({videos.length})
      </h3>
      <div className="space-y-2">
        {videos.map(video => (
          <div
            key={video.id}
            className="flex items-start gap-3 rounded-lg border border-border bg-surface-2 p-3"
          >
            {video.thumbnailUrl && (
              <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded">
                <Image
                  src={video.thumbnailUrl}
                  alt={video.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="line-clamp-1 text-sm font-medium text-brand hover:underline"
              >
                {video.title}
              </a>
              <p className="text-xs text-muted">{video.channelName}</p>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
                <span>{video.duration}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Eye size={11} />
                  {formatViewCount(video.viewCount)}
                </span>
                <span>•</span>
                <span>{formatPublishedDate(video.publishedDate)}</span>
              </div>
            </div>
            <button
              onClick={() => onRemove(video.id)}
              className="rounded p-1 text-muted hover:bg-surface hover:text-foreground transition-colors"
              aria-label="Remove video"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

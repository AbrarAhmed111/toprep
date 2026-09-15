'use client'

import Image from 'next/image'
import { Check, Eye, X, ChevronRight } from 'lucide-react'
import { YouTubeVideo } from '@/lib/api/youtubeSearch'
import { formatViewCount, formatPublishedDate } from '@/lib/api/youtubeSearch'

interface YouTubeVideoCardProps {
  video: YouTubeVideo
  isLoading?: boolean
  onSelect: (video: YouTubeVideo) => void
  onNext: () => void
  onHide: () => void
  isSelected?: boolean
}

export function YouTubeVideoCard({
  video,
  isLoading = false,
  onSelect,
  onNext,
  onHide,
  isSelected = false,
}: YouTubeVideoCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-6">
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-surface-2">
        {video.thumbnailUrl ? (
          <Image
            src={video.thumbnailUrl}
            alt={video.title}
            fill
            className="object-cover"
            unoptimized // YouTube thumbnails are external
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-muted">
            No thumbnail
          </div>
        )}
      </div>

      {/* Title */}
      <div className="space-y-1">
        <h3 className="line-clamp-2 font-semibold text-foreground">
          {video.title}
        </h3>
        <p className="text-sm text-muted">{video.channelName}</p>
      </div>

      {/* Metadata */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
        <span>{video.duration}</span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <Eye size={13} />
          {formatViewCount(video.viewCount)} views
        </span>
        <span>•</span>
        <span>{formatPublishedDate(video.publishedDate)}</span>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2 pt-2">
        <button
          onClick={() => onSelect(video)}
          disabled={isLoading || isSelected}
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-3 py-2 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand-hover disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSelected && <Check size={16} />}
          {isSelected ? 'Selected' : 'Select Video'}
        </button>

        <button
          onClick={onNext}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight size={16} />
        </button>

        <button
          onClick={onHide}
          disabled={isLoading}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-danger-bg hover:text-danger disabled:opacity-50 disabled:cursor-not-allowed"
          title="Hide this video"
        >
          <X size={16} />
        </button>
      </div>

      {/* YouTube Link */}
      <a
        href={video.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs font-medium text-brand hover:underline"
      >
        Watch on YouTube →
      </a>
    </div>
  )
}

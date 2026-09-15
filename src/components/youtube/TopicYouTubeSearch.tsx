'use client'

import { useState } from 'react'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { ChevronDown, Play, Loader, ThumbsUp, Eye, Calendar, Volume2 } from 'lucide-react'
import {
  searchYouTube,
  getVideoDetails,
  YouTubeSearchFilters,
  YouTubeVideo,
  formatViewCount,
  formatPublishedDate,
} from '@/lib/api/youtubeSearch'
import { YouTubeFilters } from './YouTubeFilters'

interface TopicYouTubeSearchProps {
  topicName: string
  topicId: string
}

export function TopicYouTubeSearch({
  topicName,
  topicId,
}: TopicYouTubeSearchProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [filters, setFilters] = useState<YouTubeSearchFilters>({
    duration: undefined,
    sort: 'relevance',
  })
  const [videos, setVideos] = useState<YouTubeVideo[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [nextPageToken, setNextPageToken] = useState<string | null>(null)
  const [hiddenVideoIds, setHiddenVideoIds] = useState<Set<string>>(new Set())
  const [hasSearched, setHasSearched] = useState(false)

  const performSearch = async () => {
    setIsSearching(true)
    try {
      const result = await searchYouTube(topicName, filters)

      if (result.videos.length === 0) {
        toast.error('No videos found for this topic. Try different filters.')
        setIsSearching(false)
        return
      }

      const videoIds = result.videos.map(v => v.id)
      const details = await getVideoDetails(videoIds)

      const enrichedVideos = result.videos.map(video => ({
        ...video,
        duration: details.get(video.id)?.duration || 'N/A',
        viewCount: details.get(video.id)?.viewCount || 0,
      }))

      setVideos(enrichedVideos)
      setCurrentIndex(0)
      setNextPageToken(result.nextPageToken)
      setHasSearched(true)
      setHiddenVideoIds(new Set())
    } catch (error) {
      console.error('Search error:', error)
      toast.error('Failed to search YouTube. Please try again.')
    } finally {
      setIsSearching(false)
    }
  }

  const currentVideo =
    currentIndex < videos.length && !hiddenVideoIds.has(videos[currentIndex].id)
      ? videos[currentIndex]
      : null

  const handleNext = async () => {
    let nextIndex = currentIndex + 1
    while (nextIndex < videos.length && hiddenVideoIds.has(videos[nextIndex].id)) {
      nextIndex++
    }

    if (nextIndex >= videos.length) {
      if (nextPageToken) {
        setIsSearching(true)
        try {
          const result = await searchYouTube(
            topicName,
            filters,
            nextPageToken
          )

          if (result.videos.length === 0) {
            toast.error('No more videos available.')
            setIsSearching(false)
            return
          }

          const videoIds = result.videos.map(v => v.id)
          const details = await getVideoDetails(videoIds)

          const enrichedVideos = result.videos.map(video => ({
            ...video,
            duration: details.get(video.id)?.duration || 'N/A',
            viewCount: details.get(video.id)?.viewCount || 0,
          }))

          setVideos([...videos, ...enrichedVideos])
          setCurrentIndex(videos.length)
          setNextPageToken(result.nextPageToken)
        } catch (error) {
          toast.error('Failed to load more videos.')
        } finally {
          setIsSearching(false)
        }
      } else {
        toast.error('No more videos available.')
      }
    } else {
      setCurrentIndex(nextIndex)
    }
  }

  const handleReject = () => {
    if (currentVideo) {
      setHiddenVideoIds(new Set([...hiddenVideoIds, currentVideo.id]))
      handleNext()
    }
  }

  return (
    <div className="space-y-4">
      {!hasSearched && (
        <>
          {/* Small Badge Button - Entry Point */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-2 rounded-lg bg-surface px-3 py-2 text-sm font-medium text-foreground border border-border hover:border-brand hover:text-brand transition-colors"
          >
            <Play size={16} className="text-brand" />
            YouTube Search
            <ChevronDown
              size={14}
              className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Inline Filters - Expand */}
          {isExpanded && (
            <div className="space-y-3 rounded-lg border border-border bg-surface-2 p-4">
              <YouTubeFilters
                filters={filters}
                onFiltersChange={setFilters}
              />

              {/* Submit/Search Button */}
              <button
                onClick={performSearch}
                disabled={isSearching}
                className="w-full rounded-lg bg-brand px-4 py-2 font-medium text-brand-foreground transition-colors hover:bg-brand-hover disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
              >
                {isSearching ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Play size={16} />
                    Search
                  </>
                )}
              </button>
            </div>
          )}
        </>
      )}

      {isSearching && !currentVideo && (
        <div className="flex items-center justify-center gap-2 rounded-lg border border-border bg-surface-2 py-6 text-muted">
          <Loader size={16} className="animate-spin" />
          <span className="text-sm font-medium">Searching...</span>
        </div>
      )}

      {hasSearched && currentVideo && (
        <div className="space-y-3 rounded-lg border border-border bg-surface-2 p-4">
          {/* YouTube Player */}
          <div className="aspect-video overflow-hidden rounded-lg bg-foreground">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${currentVideo.id}?autoplay=0`}
              title={currentVideo.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full"
            />
          </div>

          {/* Video Title */}
          <a
            href={currentVideo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="line-clamp-2 font-semibold text-foreground hover:text-brand transition-colors"
          >
            {currentVideo.title}
          </a>

          {/* Channel & Stats */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted">{currentVideo.channelName}</span>
            <div className="flex gap-3 text-xs text-muted">
              <span>{currentVideo.duration}</span>
              <span>•</span>
              <span>{formatViewCount(currentVideo.viewCount)} views</span>
              <span>•</span>
              <span>{formatPublishedDate(currentVideo.publishedDate)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleReject}
              disabled={isSearching}
              className="rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-danger-bg hover:text-danger hover:border-danger disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reject
            </button>
            <button
              onClick={handleNext}
              disabled={isSearching}
              className="flex-1 rounded-lg bg-brand px-3 py-2 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand-hover disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
            >
              {isSearching ? (
                <>
                  <Loader size={14} className="animate-spin" />
                  Loading
                </>
              ) : (
                'Next →'
              )}
            </button>
          </div>
        </div>
      )}

      {hasSearched && !currentVideo && videos.length > 0 && (
        <div className="rounded-lg border border-border bg-surface-2 p-4 text-center">
          <p className="text-sm text-muted">No more videos found.</p>
          <button
            onClick={() => {
              setHasSearched(false)
              setIsExpanded(true)
              setVideos([])
              setCurrentIndex(0)
              setHiddenVideoIds(new Set())
            }}
            className="mt-2 text-xs font-medium text-brand hover:underline"
          >
            Try another search
          </button>
        </div>
      )}
    </div>
  )
}

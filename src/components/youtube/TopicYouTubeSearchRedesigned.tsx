'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import {
  ChevronRight,
  Eye,
  Calendar,
  Play,
  RotateCcw,
  Youtube,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import {
  searchYouTube,
  getVideoDetails,
  YouTubeSearchFilters,
  YouTubeVideo,
  formatViewCount,
  formatPublishedDate,
} from '@/lib/api/youtubeSearch'
import { YouTubeFilters } from './YouTubeFilters'

function AnimatedLoader() {
  return (
    <div className="flex gap-1">
      <div
        className="h-2 w-2 animate-pulse rounded-full bg-current opacity-40"
        style={{ animationDelay: '0ms' }}
      />
      <div
        className="h-2 w-2 animate-pulse rounded-full bg-current opacity-60"
        style={{ animationDelay: '150ms' }}
      />
      <div
        className="h-2 w-2 animate-pulse rounded-full bg-current opacity-100"
        style={{ animationDelay: '300ms' }}
      />
    </div>
  )
}

interface TopicYouTubeSearchRedesignedProps {
  topicName: string
  topicId: string
}

export function TopicYouTubeSearchRedesigned({
  topicName,
}: TopicYouTubeSearchRedesignedProps) {
  const [showFilters, setShowFilters] = useState(false)
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
        toast.error('No videos found. Try different filters.')
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
      setShowFilters(false)
    } catch (error) {
      console.error('Search error:', error)
      toast.error('Failed to search. Please try again.')
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
    while (
      nextIndex < videos.length &&
      hiddenVideoIds.has(videos[nextIndex].id)
    ) {
      nextIndex++
    }

    if (nextIndex >= videos.length) {
      if (nextPageToken) {
        setIsSearching(true)
        try {
          const result = await searchYouTube(topicName, filters, nextPageToken)
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

  const handleSkip = () => {
    if (currentVideo) {
      setHiddenVideoIds(new Set([...hiddenVideoIds, currentVideo.id]))
      handleNext()
    }
  }

  const resetSearch = () => {
    setHasSearched(false)
    setVideos([])
    setCurrentIndex(0)
    setHiddenVideoIds(new Set())
    setShowFilters(false)
  }

  const openFilters = () => {
    setHasSearched(false)
    setShowFilters(true)
  }

  const isIdle = !hasSearched && !showFilters && !isSearching

  return (
    <div className="flex flex-col gap-3">
      {/* Idle — rendered as a compact action alongside Explain/Questions,
          not a separately-labeled feature, until there's something to show. */}
      {isIdle && (
        <button
          type="button"
          onClick={openFilters}
          className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-surface-hover"
        >
          <Youtube size={14} />
          Find a video
        </button>
      )}

      {!isIdle && (
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">
            Video Lesson
          </span>
          {hasSearched && (
            <button
              type="button"
              onClick={resetSearch}
              className="inline-flex items-center gap-1 rounded text-xs font-medium text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <RotateCcw size={12} />
              New search
            </button>
          )}
        </div>
      )}

      {/* Filters open */}
      {!hasSearched && showFilters && !isSearching && (
        <div className="flex flex-wrap items-center gap-2">
          <YouTubeFilters filters={filters} onFiltersChange={setFilters} />
          <Button size="sm" onClick={performSearch}>
            Find
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(false)}
          >
            Cancel
          </Button>
        </div>
      )}

      {/* Loading */}
      {isSearching && !currentVideo && (
        <div className="flex items-center gap-2 py-1 text-sm text-muted">
          <AnimatedLoader />
          Finding a lesson for{' '}
          <span className="text-foreground">{topicName}</span>…
        </div>
      )}

      {/* Video found */}
      {hasSearched && currentVideo && (
        <div className="flex flex-col gap-3">
          <div className="aspect-video w-full overflow-hidden rounded-lg bg-foreground/10">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${currentVideo.id}`}
              title={currentVideo.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <a
              href={currentVideo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="line-clamp-2 text-sm font-medium text-foreground hover:text-primary"
            >
              {currentVideo.title}
            </a>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-muted">
              <span>{currentVideo.channelName}</span>
              <span className="inline-flex items-center gap-1">
                <Play size={11} className="fill-current" />
                {currentVideo.duration}
              </span>
              <span className="inline-flex items-center gap-1">
                <Eye size={11} />
                {formatViewCount(currentVideo.viewCount)}
              </span>
              <span className="inline-flex items-center gap-1">
                <Calendar size={11} />
                {formatPublishedDate(currentVideo.publishedDate)}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleSkip}
              disabled={isSearching}
            >
              Skip
            </Button>
            <Button size="sm" onClick={handleNext} disabled={isSearching}>
              {isSearching ? (
                <AnimatedLoader />
              ) : (
                <>
                  Next
                  <ChevronRight size={14} />
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* No more results */}
      {hasSearched && !currentVideo && videos.length > 0 && (
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-muted">No more lessons found.</p>
          <Button variant="secondary" size="sm" onClick={openFilters}>
            Adjust filters
          </Button>
        </div>
      )}
    </div>
  )
}

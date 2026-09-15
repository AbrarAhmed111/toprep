'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { Play, Loader, ChevronRight, RotateCcw, Eye, Calendar } from 'lucide-react'
import {
  searchYouTube,
  getVideoDetails,
  YouTubeSearchFilters,
  YouTubeVideo,
  formatViewCount,
  formatPublishedDate,
} from '@/lib/api/youtubeSearch'
import { YouTubeFilters } from './YouTubeFilters'

const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="#FF0000" className="inline">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
)

interface TopicYouTubeSearchRedesignedProps {
  topicName: string
  topicId: string
}

export function TopicYouTubeSearchRedesigned({
  topicName,
  topicId,
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
    while (nextIndex < videos.length && hiddenVideoIds.has(videos[nextIndex].id)) {
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

  const handleReject = () => {
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

  return (
    <div className="space-y-4">
      {/* State: Loading - Only show loader, hide filters */}
      {isSearching && !currentVideo && (
        <div className="space-y-3">
          {/* Video Lesson Header */}
          <div className="text-sm font-semibold text-foreground uppercase tracking-wider">
            Video Lesson
          </div>
          <div className="flex items-center justify-center gap-3 p-8 rounded-lg border border-border bg-surface-2">
            <div className="relative h-8 w-8">
              <div className="absolute inset-0 rounded-full border-2 border-border border-t-brand animate-spin" />
            </div>
            <div className="text-sm font-medium text-foreground">
              Finding a lesson for <span className="text-brand">{topicName}</span>...
            </div>
          </div>
        </div>
      )}

      {/* State: No Video - Show filters or invitation */}
      {!hasSearched && !isSearching && (
        <div className="space-y-3">
          {/* Video Lesson Header */}
          <div className="text-sm font-semibold text-foreground uppercase tracking-wider">
            Video Lesson
          </div>

          {!showFilters ? (
            /* Compact Invitation */
            <div className="flex items-center justify-between p-4 rounded-lg border border-dashed border-border bg-surface/50">
              <div>
                <p className="text-sm text-foreground font-medium">Find a learning video</p>
                <p className="text-xs text-muted mt-1">Let ToPrep find a suitable lesson for this topic</p>
              </div>
              <button
                onClick={() => setShowFilters(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-brand-foreground hover:bg-brand-hover transition-colors shrink-0 ml-4"
              >
                <YouTubeIcon />
                Find
              </button>
            </div>
          ) : (
            /* Filter Controls - Inline */
            <div className="space-y-3 p-4 rounded-lg border border-border bg-surface-2">
              <YouTubeFilters
                filters={filters}
                onFiltersChange={setFilters}
              />

              <div className="flex gap-2">
                <button
                  onClick={performSearch}
                  disabled={isSearching}
                  className="flex-1 rounded-lg bg-brand px-4 py-2 font-medium text-brand-foreground hover:bg-brand-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center justify-center gap-2"
                >
                  {isSearching ? (
                    <>
                      <Loader size={16} className="animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <YouTubeIcon />
                      Find Lesson
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="rounded-lg border border-border px-4 py-2 font-medium text-foreground hover:bg-surface-2 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* State: Video Found */}
      {hasSearched && currentVideo && (
        <div className="space-y-4">
          {/* Video Lesson Header */}
          <div className="text-sm font-semibold text-foreground uppercase tracking-wider">
            Video Lesson
          </div>

          {/* Video Card */}
          <div className="space-y-4 rounded-xl border border-border/50 bg-gradient-to-b from-surface to-surface-2/50 p-4 sm:p-5">
            {/* YouTube Player */}
            <div className="aspect-video w-full overflow-hidden rounded-lg bg-foreground">
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

            {/* Video Info */}
            <div className="space-y-2">
              <a
                href={currentVideo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="line-clamp-2 text-base font-semibold text-foreground hover:text-brand transition-colors"
              >
                {currentVideo.title}
              </a>

              <div className="flex items-center justify-between text-xs text-muted">
                <span className="font-medium">{currentVideo.channelName}</span>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Play size={12} className="fill-current" />
                    {currentVideo.duration}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Eye size={12} />
                    {formatViewCount(currentVideo.viewCount)}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {formatPublishedDate(currentVideo.publishedDate)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleReject}
                disabled={isSearching}
                className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground hover:bg-danger/10 hover:text-danger hover:border-danger transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Skip
              </button>
              <button
                onClick={handleNext}
                disabled={isSearching}
                className="flex-1 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-brand-foreground hover:bg-brand-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center justify-center gap-2"
              >
                {isSearching ? (
                  <>
                    <Loader size={14} className="animate-spin" />
                    Loading
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight size={14} />
                  </>
                )}
              </button>
            </div>

            {/* New Search Button */}
            <button
              onClick={resetSearch}
              className="w-full text-center text-xs font-medium text-muted hover:text-foreground transition-colors py-2 rounded-lg hover:bg-surface"
            >
              <RotateCcw size={12} className="inline mr-1" />
              New search
            </button>
          </div>
        </div>
      )}

      {/* State: No More Results */}
      {hasSearched && !currentVideo && videos.length > 0 && (
        <div className="text-center p-6 rounded-lg border border-dashed border-border bg-surface/50">
          <p className="text-sm font-medium text-foreground">No more lessons found</p>
          <p className="text-xs text-muted mt-1">Try adjusting your filters</p>
          <button
            onClick={() => setShowFilters(true)}
            className="mt-3 text-xs font-medium text-brand hover:underline"
          >
            Adjust filters
          </button>
        </div>
      )}
    </div>
  )
}

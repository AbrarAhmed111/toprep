'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { X, Loader } from 'lucide-react'
import {
  searchYouTube,
  getVideoDetails,
  YouTubeSearchFilters,
  YouTubeVideo,
} from '@/lib/api/youtubeSearch'
import { YouTubeFilters } from './YouTubeFilters'
import { YouTubeVideoCard } from './YouTubeVideoCard'
import { EmptyState } from '@/components/ui/EmptyState'

interface YouTubeSearchModalProps {
  isOpen: boolean
  topicName: string
  onClose: () => void
  onSelectVideo: (video: YouTubeVideo) => void
  selectedVideoIds?: string[]
}

export function YouTubeSearchModal({
  isOpen,
  topicName,
  onClose,
  onSelectVideo,
  selectedVideoIds = [],
}: YouTubeSearchModalProps) {
  const [filters, setFilters] = useState<YouTubeSearchFilters>({
    duration: undefined,
    sort: 'relevance',
  })
  const [videos, setVideos] = useState<YouTubeVideo[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [nextPageToken, setNextPageToken] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [hiddenVideoIds, setHiddenVideoIds] = useState<Set<string>>(
    new Set()
  )

  useEffect(() => {
    if (!isOpen) {
      setVideos([])
      setCurrentIndex(0)
      setHasSearched(false)
      setHiddenVideoIds(new Set())
    }
  }, [isOpen])

  const performSearch = async (usePageToken: boolean = false) => {
    setIsSearching(true)
    try {
      const result = await searchYouTube(
        topicName,
        filters,
        usePageToken ? nextPageToken || undefined : undefined
      )

      if (result.videos.length === 0) {
        toast.error('No videos found. Try adjusting your filters.')
        setIsSearching(false)
        return
      }

      // Fetch additional details for videos
      const videoIds = result.videos.map(v => v.id)
      const details = await getVideoDetails(videoIds)

      const enrichedVideos = result.videos.map(video => ({
        ...video,
        duration: details.get(video.id)?.duration || 'N/A',
        viewCount: details.get(video.id)?.viewCount || 0,
      }))

      if (usePageToken) {
        setVideos([...videos, ...enrichedVideos])
      } else {
        setVideos(enrichedVideos)
        setCurrentIndex(0)
      }

      setNextPageToken(result.nextPageToken)
      setHasSearched(true)
    } catch (error) {
      console.error('Search error:', error)
      toast.error('Failed to search YouTube. Please try again.')
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearch = async () => {
    setHiddenVideoIds(new Set())
    await performSearch(false)
  }

  const handleNext = async () => {
    const nextVisibleIndex = findNextVisibleIndex(currentIndex + 1)

    if (nextVisibleIndex >= videos.length) {
      // Need to fetch more results
      if (nextPageToken) {
        setIsLoading(true)
        try {
          const result = await searchYouTube(
            topicName,
            filters,
            nextPageToken
          )

          if (result.videos.length === 0) {
            toast.error('No more videos found.')
            setIsLoading(false)
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
          setNextPageToken(result.nextPageToken)
          setCurrentIndex(videos.length)
        } catch (error) {
          console.error('Error fetching more videos:', error)
          toast.error('Failed to load more videos.')
        } finally {
          setIsLoading(false)
        }
      } else {
        toast.error('No more videos available.')
      }
    } else {
      setCurrentIndex(nextVisibleIndex)
    }
  }

  const handleHide = () => {
    const currentVideo = videos[currentIndex]
    if (currentVideo) {
      setHiddenVideoIds(new Set([...hiddenVideoIds, currentVideo.id]))
      handleNext()
    }
  }

  const findNextVisibleIndex = (startIndex: number): number => {
    for (let i = startIndex; i < videos.length; i++) {
      if (!hiddenVideoIds.has(videos[i].id)) {
        return i
      }
    }
    return videos.length
  }

  const handleSelectVideo = (video: YouTubeVideo) => {
    onSelectVideo(video)
    toast.success('Video added to topic!')
  }

  const visibleVideos = videos.filter(v => !hiddenVideoIds.has(v.id))
  const currentVideo =
    currentIndex < videos.length && !hiddenVideoIds.has(videos[currentIndex].id)
      ? videos[currentIndex]
      : visibleVideos[0]
  const currentVideoIndex = videos.findIndex(
    v => v.id === currentVideo?.id
  )
  const hasMoreHidden = visibleVideos.length < videos.length

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-foreground/10 sm:items-center">
      <div className="max-h-[90vh] w-full overflow-y-auto rounded-t-2xl bg-background sm:max-w-2xl sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Search YouTube
            </h2>
            <p className="mt-1 text-sm text-muted">
              Topic: <span className="font-medium text-foreground">{topicName}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-surface-2 transition-colors"
          >
            <X size={20} className="text-muted" />
          </button>
        </div>

        <div className="space-y-6 px-6 py-6">
          {/* Filters */}
          <YouTubeFilters
            filters={filters}
            onFiltersChange={setFilters}
          />

          {/* Search Button */}
          {!hasSearched && (
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="w-full rounded-lg bg-brand px-4 py-3 font-medium text-brand-foreground transition-colors hover:bg-brand-hover disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
            >
              {isSearching && <Loader size={18} className="animate-spin" />}
              Search YouTube
            </button>
          )}

          {/* Results */}
          {hasSearched && videos.length === 0 && (
            <EmptyState
              title="No videos found"
              description="Try adjusting your search filters or topic name."
            />
          )}

          {hasSearched && currentVideo && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted">
                  {currentVideoIndex + 1} of {videos.length} results
                  {hasMoreHidden && ' (some hidden)'}
                </div>
                <button
                  onClick={handleSearch}
                  className="text-xs font-medium text-brand hover:underline"
                >
                  New Search
                </button>
              </div>

              <YouTubeVideoCard
                video={currentVideo}
                isLoading={isLoading}
                onSelect={handleSelectVideo}
                onNext={handleNext}
                onHide={handleHide}
                isSelected={selectedVideoIds.includes(currentVideo.id)}
              />
            </div>
          )}

          {hasSearched && videos.length > 0 && !currentVideo && (
            <EmptyState
              title="All videos hidden"
              description="You've hidden all results. Try a new search with different filters."
            />
          )}
        </div>
      </div>
    </div>
  )
}

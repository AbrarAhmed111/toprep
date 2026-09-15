'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { X, Loader } from 'lucide-react'
import { Topic } from '@/types/preparation'
import { YouTubeVideo, searchYouTube, getVideoDetails, YouTubeSearchFilters } from '@/lib/api/youtubeSearch'
import { YouTubeFilters } from './YouTubeFilters'
import { YouTubeVideoCard } from './YouTubeVideoCard'
import { EmptyState } from '@/components/ui/EmptyState'

interface GlobalYouTubeSearchProps {
  isOpen: boolean
  selectedTopics: Topic[]
  onClose: () => void
  onSelectVideo: (topicId: string, video: YouTubeVideo) => void
}

interface TopicResults {
  topicId: string
  topicName: string
  videos: YouTubeVideo[]
  currentIndex: number
  nextPageToken: string | null
  hiddenVideoIds: Set<string>
  isLoading: boolean
}

export function GlobalYouTubeSearch({
  isOpen,
  selectedTopics,
  onClose,
  onSelectVideo,
}: GlobalYouTubeSearchProps) {
  const [filters, setFilters] = useState<YouTubeSearchFilters>({
    duration: undefined,
    sort: 'relevance',
  })
  const [resultsMap, setResultsMap] = useState<Map<string, TopicResults>>(
    new Map()
  )
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setResultsMap(new Map())
      setHasSearched(false)
    }
  }, [isOpen])

  const performSearch = async () => {
    setIsSearching(true)
    setHasSearched(true)

    const newMap = new Map<string, TopicResults>()
    let successCount = 0

    for (const topic of selectedTopics) {
      try {
        const result = await searchYouTube(topic.name, filters)

        if (result.videos.length === 0) {
          newMap.set(topic.id, {
            topicId: topic.id,
            topicName: topic.name,
            videos: [],
            currentIndex: 0,
            nextPageToken: null,
            hiddenVideoIds: new Set(),
            isLoading: false,
          })
          continue
        }

        const videoIds = result.videos.map(v => v.id)
        const details = await getVideoDetails(videoIds)

        const enrichedVideos = result.videos.map(video => ({
          ...video,
          duration: details.get(video.id)?.duration || 'N/A',
          viewCount: details.get(video.id)?.viewCount || 0,
        }))

        newMap.set(topic.id, {
          topicId: topic.id,
          topicName: topic.name,
          videos: enrichedVideos,
          currentIndex: 0,
          nextPageToken: result.nextPageToken,
          hiddenVideoIds: new Set(),
          isLoading: false,
        })

        successCount++
      } catch (error) {
        console.error(`Search error for topic ${topic.name}:`, error)
      }
    }

    setResultsMap(newMap)
    setIsSearching(false)

    if (successCount === 0) {
      toast.error('Failed to search YouTube for the selected topics.')
    } else if (successCount < selectedTopics.length) {
      toast.error('Some searches failed. Please try again.')
    }
  }

  const handleNext = async (topicId: string) => {
    const topicResults = resultsMap.get(topicId)
    if (!topicResults) return

    const nextVisibleIndex = findNextVisibleIndex(
      topicResults,
      topicResults.currentIndex + 1
    )

    if (nextVisibleIndex >= topicResults.videos.length) {
      if (topicResults.nextPageToken) {
        const updatedResults = { ...topicResults, isLoading: true }
        setResultsMap(new Map(resultsMap.set(topicId, updatedResults)))

        try {
          const result = await searchYouTube(
            topicResults.topicName,
            filters,
            topicResults.nextPageToken
          )

          if (result.videos.length === 0) {
            toast.error('No more videos for this topic.')
            return
          }

          const videoIds = result.videos.map(v => v.id)
          const details = await getVideoDetails(videoIds)

          const enrichedVideos = result.videos.map(video => ({
            ...video,
            duration: details.get(video.id)?.duration || 'N/A',
            viewCount: details.get(video.id)?.viewCount || 0,
          }))

          const newResults: TopicResults = {
            ...topicResults,
            videos: [...topicResults.videos, ...enrichedVideos],
            currentIndex: topicResults.videos.length,
            nextPageToken: result.nextPageToken,
            isLoading: false,
          }

          setResultsMap(new Map(resultsMap.set(topicId, newResults)))
        } catch (error) {
          console.error('Error fetching more videos:', error)
          toast.error('Failed to load more videos.')
        }
      } else {
        toast.error('No more videos available.')
      }
    } else {
      const updatedResults = {
        ...topicResults,
        currentIndex: nextVisibleIndex,
      }
      setResultsMap(new Map(resultsMap.set(topicId, updatedResults)))
    }
  }

  const handleHide = (topicId: string) => {
    const topicResults = resultsMap.get(topicId)
    if (!topicResults) return

    const currentVideo = topicResults.videos[topicResults.currentIndex]
    if (currentVideo) {
      const newHiddenIds = new Set([...topicResults.hiddenVideoIds, currentVideo.id])
      const updatedResults = {
        ...topicResults,
        hiddenVideoIds: newHiddenIds,
      }
      setResultsMap(new Map(resultsMap.set(topicId, updatedResults)))
      handleNext(topicId)
    }
  }

  const findNextVisibleIndex = (
    topicResults: TopicResults,
    startIndex: number
  ): number => {
    for (let i = startIndex; i < topicResults.videos.length; i++) {
      if (!topicResults.hiddenVideoIds.has(topicResults.videos[i].id)) {
        return i
      }
    }
    return topicResults.videos.length
  }

  const handleSelectVideo = (topicId: string, video: YouTubeVideo) => {
    onSelectVideo(topicId, video)
    toast.success('Video added to topic!')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/50 sm:items-center">
      <div className="max-h-[90vh] w-full overflow-y-auto rounded-t-2xl bg-background sm:max-w-3xl sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Global YouTube Search
            </h2>
            <p className="mt-1 text-sm text-muted">
              {selectedTopics.length} topics selected
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
              onClick={performSearch}
              disabled={isSearching}
              className="w-full rounded-lg bg-brand px-4 py-3 font-medium text-white transition-colors hover:bg-brand-600 disabled:bg-brand-400 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
            >
              {isSearching && <Loader size={18} className="animate-spin" />}
              Search YouTube for {selectedTopics.length} Topic{selectedTopics.length !== 1 ? 's' : ''}
            </button>
          )}

          {/* Results */}
          {hasSearched && resultsMap.size === 0 && (
            <EmptyState
              title="No results"
              description="Try adjusting your search filters."
            />
          )}

          {hasSearched && resultsMap.size > 0 && (
            <div className="space-y-6">
              {selectedTopics.map(topic => {
                const topicResults = resultsMap.get(topic.id)
                if (!topicResults) return null

                const currentVideo =
                  topicResults.videos.length > 0
                    ? topicResults.videos[
                        findNextVisibleIndex(topicResults, topicResults.currentIndex)
                      ]
                    : null

                return (
                  <div key={topic.id} className="border-t border-border pt-6 first:border-t-0 first:pt-0">
                    <h3 className="mb-4 font-semibold text-foreground">
                      {topic.name}
                    </h3>

                    {topicResults.videos.length === 0 ? (
                      <p className="text-sm text-muted">
                        No videos found with current filters.
                      </p>
                    ) : currentVideo ? (
                      <YouTubeVideoCard
                        video={currentVideo}
                        isLoading={topicResults.isLoading}
                        onSelect={() => handleSelectVideo(topic.id, currentVideo)}
                        onNext={() => handleNext(topic.id)}
                        onHide={() => handleHide(topic.id)}
                      />
                    ) : (
                      <p className="text-sm text-muted">All videos hidden.</p>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

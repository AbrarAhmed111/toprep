'use client'

import { Select } from '@/components/ui/Select'
import { YouTubeSearchFilters } from '@/lib/api/youtubeSearch'

interface YouTubeFiltersProps {
  filters: YouTubeSearchFilters
  onFiltersChange: (filters: YouTubeSearchFilters) => void
}

export function YouTubeFilters({
  filters,
  onFiltersChange,
}: YouTubeFiltersProps) {
  const handleDurationChange = (value: string) => {
    const duration = (value as 'any' | 'short' | 'medium' | 'long') || undefined
    onFiltersChange({
      ...filters,
      duration: duration === 'any' ? undefined : duration,
    })
  }

  const handleSortChange = (value: string) => {
    const sort =
      (value as 'relevance' | 'upload_date' | 'view_count') || undefined
    onFiltersChange({
      ...filters,
      sort: sort === 'relevance' ? undefined : sort,
    })
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Select
        aria-label="Duration"
        value={filters.duration || 'any'}
        onChange={e => handleDurationChange(e.target.value)}
        className="w-auto"
      >
        <option value="any">Any duration</option>
        <option value="short">Short (&lt; 4 min)</option>
        <option value="medium">Medium (4-20 min)</option>
        <option value="long">Long (&gt; 20 min)</option>
      </Select>

      <Select
        aria-label="Sort by"
        value={filters.sort || 'relevance'}
        onChange={e => handleSortChange(e.target.value)}
        className="w-auto"
      >
        <option value="relevance">Relevance</option>
        <option value="upload_date">Newest</option>
        <option value="view_count">Most viewed</option>
      </Select>
    </div>
  )
}

'use client'

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
    const duration =
      (value as 'any' | 'short' | 'medium' | 'long') || undefined
    onFiltersChange({ ...filters, duration: duration === 'any' ? undefined : duration })
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
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Duration Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            Duration
          </label>
          <select
            value={filters.duration || 'any'}
            onChange={e => handleDurationChange(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          >
            <option value="any">Any</option>
            <option value="short">Short (&lt; 4 min)</option>
            <option value="medium">Medium (4-20 min)</option>
            <option value="long">Long (&gt; 20 min)</option>
          </select>
        </div>

        {/* Sort Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            Sort by
          </label>
          <select
            value={filters.sort || 'relevance'}
            onChange={e => handleSortChange(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          >
            <option value="relevance">Relevance</option>
            <option value="upload_date">Newest</option>
            <option value="view_count">Most Viewed</option>
          </select>
        </div>
      </div>
    </div>
  )
}

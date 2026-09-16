export function formatRelativeDate(iso: string): string {
  const then = new Date(iso)
  const days = Math.floor((Date.now() - then.getTime()) / (1000 * 60 * 60 * 24))

  if (days <= 0) return 'Updated today'
  if (days === 1) return 'Updated yesterday'
  if (days < 7) return `Updated ${days} days ago`
  if (days < 14) return 'Updated last week'
  if (days < 30) return `Updated ${Math.floor(days / 7)} weeks ago`
  return `Updated ${then.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`
}

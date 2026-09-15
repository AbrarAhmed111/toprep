'use client'

import { FormEvent, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { MAX_BULK_TOPICS } from '@/lib/topics/parseBulkTopics'

interface AddTopicPanelProps {
  onAddSingle: (name: string) => void
  onAddBulk: (raw: string) => void
}

export function AddTopicPanel({ onAddSingle, onAddBulk }: AddTopicPanelProps) {
  const [mode, setMode] = useState<'single' | 'bulk'>('single')
  const [singleName, setSingleName] = useState('')
  const [bulkText, setBulkText] = useState('')

  const submitSingle = (event: FormEvent) => {
    event.preventDefault()
    const trimmed = singleName.trim()
    if (!trimmed) return
    onAddSingle(trimmed)
    setSingleName('')
  }

  const submitBulk = (event: FormEvent) => {
    event.preventDefault()
    if (!bulkText.trim()) return
    onAddBulk(bulkText)
    setBulkText('')
  }

  return (
    <Card className="p-4">
      <div className="mb-3 inline-flex rounded-lg border border-border bg-surface p-1 text-sm">
        <button
          type="button"
          onClick={() => setMode('single')}
          className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
            mode === 'single'
              ? 'bg-white text-foreground shadow-sm'
              : 'text-muted'
          }`}
        >
          Single Topic
        </button>
        <button
          type="button"
          onClick={() => setMode('bulk')}
          className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
            mode === 'bulk'
              ? 'bg-white text-foreground shadow-sm'
              : 'text-muted'
          }`}
        >
          Bulk Add
        </button>
      </div>

      {mode === 'single' ? (
        <form onSubmit={submitSingle} className="flex items-end gap-2">
          <div className="flex-1">
            <Input
              aria-label="Topic name"
              placeholder="e.g. React Server Components"
              value={singleName}
              onChange={event => setSingleName(event.target.value)}
            />
          </div>
          <Button type="submit">Add Topic</Button>
        </form>
      ) : (
        <form onSubmit={submitBulk} className="flex flex-col gap-3">
          <Textarea
            aria-label="Bulk topics"
            placeholder={'One topic per line, e.g.\nReact\nNext.js\nTypeScript'}
            rows={5}
            value={bulkText}
            onChange={event => setBulkText(event.target.value)}
            hint={`One topic per line, up to ${MAX_BULK_TOPICS} at a time.`}
          />
          <div>
            <Button type="submit">Add Topics</Button>
          </div>
        </form>
      )}
    </Card>
  )
}

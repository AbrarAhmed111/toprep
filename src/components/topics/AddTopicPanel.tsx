'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import { Plus, X } from 'lucide-react'
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
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<'single' | 'bulk'>('single')
  const [singleName, setSingleName] = useState('')
  const [bulkText, setBulkText] = useState('')
  const singleInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open && mode === 'single') singleInputRef.current?.focus()
  }, [open, mode])

  const closePanel = () => {
    setOpen(false)
    setSingleName('')
    setBulkText('')
  }

  const submitSingle = (event: FormEvent) => {
    event.preventDefault()
    const trimmed = singleName.trim()
    if (!trimmed) return
    onAddSingle(trimmed)
    closePanel()
  }

  const submitBulk = (event: FormEvent) => {
    event.preventDefault()
    if (!bulkText.trim()) return
    onAddBulk(bulkText)
    closePanel()
  }

  return (
    <div className="flex w-full flex-col gap-3">
      <div>
        <Button
          type="button"
          variant={open ? 'secondary' : 'primary'}
          size="sm"
          onClick={() => (open ? closePanel() : setOpen(true))}
        >
          {open ? (
            <>
              <X size={15} />
              Cancel
            </>
          ) : (
            <>
              <Plus size={15} />
              Add Topics
            </>
          )}
        </Button>
      </div>

      <div
        className={`grid transition-all duration-300 ease-out ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <Card className="p-4">
            <div className="mb-3 inline-flex rounded-xl border border-border bg-surface-2 p-1 text-sm">
              <button
                type="button"
                onClick={() => setMode('single')}
                className={`rounded-lg px-3 py-1.5 font-medium transition-colors ${
                  mode === 'single'
                    ? 'bg-surface text-foreground shadow-sm'
                    : 'text-muted hover:text-foreground'
                }`}
              >
                Single Topic
              </button>
              <button
                type="button"
                onClick={() => setMode('bulk')}
                className={`rounded-lg px-3 py-1.5 font-medium transition-colors ${
                  mode === 'bulk'
                    ? 'bg-surface text-foreground shadow-sm'
                    : 'text-muted hover:text-foreground'
                }`}
              >
                Bulk Add
              </button>
            </div>

            {mode === 'single' ? (
              <form onSubmit={submitSingle} className="flex items-end gap-2">
                <div className="flex-1">
                  <Input
                    ref={singleInputRef}
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
                  placeholder={
                    'One topic per line, e.g.\nReact\nNext.js\nTypeScript'
                  }
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
        </div>
      </div>
    </div>
  )
}

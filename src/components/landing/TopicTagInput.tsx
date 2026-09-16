'use client'

import { ClipboardEvent, KeyboardEvent, useState } from 'react'
import { X } from 'lucide-react'
import { MAX_BULK_TOPICS } from '@/lib/topics/parseBulkTopics'

interface TopicTagInputProps {
  label?: string
  hint?: string
  placeholder?: string
  value: string[]
  onChange: (topics: string[]) => void
}

export function TopicTagInput({
  label,
  hint,
  placeholder,
  value,
  onChange,
}: TopicTagInputProps) {
  const [draft, setDraft] = useState('')

  const addTopics = (raw: string[]) => {
    const seen = new Set(value.map(v => v.toLowerCase()))
    const additions: string[] = []
    for (const item of raw) {
      const trimmed = item.trim()
      if (!trimmed || seen.has(trimmed.toLowerCase())) continue
      seen.add(trimmed.toLowerCase())
      additions.push(trimmed)
    }
    if (!additions.length) return
    onChange([...value, ...additions].slice(0, MAX_BULK_TOPICS))
  }

  const removeAt = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const commitDraft = () => {
    if (!draft.trim()) return
    addTopics([draft])
    setDraft('')
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault()
      commitDraft()
      return
    }
    if (event.key === 'Backspace' && !draft && value.length) {
      removeAt(value.length - 1)
    }
  }

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    const text = event.clipboardData.getData('text')
    if (!text.includes('\n') && !text.includes(',')) return
    event.preventDefault()
    addTopics(text.split(/[\n,]/))
  }

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-foreground">{label}</label>
      )}
      <div className="flex min-h-[6.5rem] flex-wrap items-start gap-1.5 rounded-xl border border-border bg-background/50 px-3 py-2 transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
        {value.map((topic, index) => (
          <span
            key={`${topic}-${index}`}
            className="animate-scale-in inline-flex items-center gap-1 rounded-full bg-primary-soft py-1 pl-2.5 pr-1.5 text-sm font-medium text-primary"
          >
            {topic}
            <button
              type="button"
              onClick={() => removeAt(index)}
              aria-label={`Remove ${topic}`}
              className="rounded-full p-0.5 text-primary/70 transition-colors hover:bg-primary/15 hover:text-primary"
            >
              <X size={12} />
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={event => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onBlur={commitDraft}
          placeholder={value.length ? '' : placeholder}
          className="min-w-[140px] flex-1 bg-transparent py-1 text-sm text-foreground placeholder:text-muted focus:outline-none"
        />
      </div>
      {hint && <p className="text-xs text-muted">{hint}</p>}
    </div>
  )
}

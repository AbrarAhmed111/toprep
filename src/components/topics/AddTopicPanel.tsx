'use client'

import {
  ChangeEvent,
  DragEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from 'react'
import { FileText, Plus, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { MAX_BULK_TOPICS } from '@/lib/topics/parseBulkTopics'
import { extractTopicsFromPdf } from '@/lib/api/pdfExtraction'

const MAX_PDF_SIZE_BYTES = 15 * 1024 * 1024 // 15MB

interface AddTopicPanelProps {
  onAddSingle: (name: string) => void
  onAddBulk: (raw: string) => void
}

export function AddTopicPanel({ onAddSingle, onAddBulk }: AddTopicPanelProps) {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<'single' | 'bulk' | 'pdf'>('single')
  const [singleName, setSingleName] = useState('')
  const [bulkText, setBulkText] = useState('')
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [isExtracting, setIsExtracting] = useState(false)
  const singleInputRef = useRef<HTMLInputElement>(null)
  const pdfInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open && mode === 'single') singleInputRef.current?.focus()
  }, [open, mode])

  const closePanel = () => {
    setOpen(false)
    setSingleName('')
    setBulkText('')
    setPdfFile(null)
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

  const acceptPdfFile = (file: File | null) => {
    if (!file) return
    if (
      file.type !== 'application/pdf' &&
      !file.name.toLowerCase().endsWith('.pdf')
    ) {
      toast.error('Please choose a PDF file')
      return
    }
    if (file.size > MAX_PDF_SIZE_BYTES) {
      toast.error('PDF is too large — please keep it under 15MB')
      return
    }
    setPdfFile(file)
  }

  const handlePdfInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    acceptPdfFile(event.target.files?.[0] ?? null)
    event.target.value = ''
  }

  const handlePdfDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    acceptPdfFile(event.dataTransfer.files?.[0] ?? null)
  }

  const submitPdf = async (event: FormEvent) => {
    event.preventDefault()
    if (!pdfFile || isExtracting) return
    setIsExtracting(true)
    try {
      const result = await extractTopicsFromPdf(pdfFile)
      if (result.topics.length === 0) {
        toast.error('No topics found in that PDF')
        return
      }
      onAddBulk(result.topics.join('\n'))
      closePanel()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to extract topics',
      )
    } finally {
      setIsExtracting(false)
    }
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
            <div className="mb-3 inline-flex rounded-lg border border-border bg-surface-hover p-1 text-sm">
              <button
                type="button"
                onClick={() => setMode('single')}
                className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
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
                className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
                  mode === 'bulk'
                    ? 'bg-surface text-foreground shadow-sm'
                    : 'text-muted hover:text-foreground'
                }`}
              >
                Bulk Add
              </button>
              <button
                type="button"
                onClick={() => setMode('pdf')}
                className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
                  mode === 'pdf'
                    ? 'bg-surface text-foreground shadow-sm'
                    : 'text-muted hover:text-foreground'
                }`}
              >
                Upload PDF
              </button>
            </div>

            {mode === 'single' && (
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
            )}

            {mode === 'bulk' && (
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

            {mode === 'pdf' && (
              <form onSubmit={submitPdf} className="flex flex-col gap-3">
                <input
                  ref={pdfInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  className="hidden"
                  onChange={handlePdfInputChange}
                />
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => pdfInputRef.current?.click()}
                  onKeyDown={event => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      pdfInputRef.current?.click()
                    }
                  }}
                  onDragOver={event => event.preventDefault()}
                  onDrop={handlePdfDrop}
                  className="flex cursor-pointer flex-col items-center gap-1.5 rounded-lg border border-dashed border-border bg-surface px-4 py-6 text-center transition-colors hover:border-primary hover:bg-primary-soft"
                >
                  <FileText size={20} className="text-muted" />
                  {pdfFile ? (
                    <p className="text-sm font-medium text-foreground">
                      {pdfFile.name}
                    </p>
                  ) : (
                    <>
                      <p className="text-sm font-medium text-foreground">
                        Click to upload a PDF, or drag one here
                      </p>
                      <p className="text-xs text-muted">
                        We&apos;ll pull a topic list out of the document.
                      </p>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button type="submit" disabled={!pdfFile || isExtracting}>
                    {isExtracting ? 'Extracting…' : 'Extract Topics'}
                  </Button>
                  {pdfFile && !isExtracting && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setPdfFile(null)}
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

import { Check, Loader2, X } from 'lucide-react'
import { PdfExtractionStage } from '@/lib/api/pdfExtraction'

export type StageState = 'pending' | 'active' | 'done' | 'error'

export const PDF_EXTRACTION_STAGES: {
  key: PdfExtractionStage
  label: string
}[] = [
  { key: 'validating', label: 'Validating PDF' },
  { key: 'reading', label: 'Reading document' },
  { key: 'analyzing', label: 'AI is analyzing content' },
  { key: 'organizing', label: 'Deduplicating topics' },
  { key: 'grouping', label: 'Sorting into sections' },
]

interface PdfExtractionProgressProps {
  statuses: Record<PdfExtractionStage, StageState>
  activeMessage: string | null
}

const ICON_WRAPPER_CLASSES: Record<StageState, string> = {
  pending: 'border-border text-transparent',
  active: 'border-primary text-primary',
  done: 'border-success bg-success-bg text-success',
  error: 'border-danger bg-danger-bg text-danger',
}

export function PdfExtractionProgress({
  statuses,
  activeMessage,
}: PdfExtractionProgressProps) {
  return (
    <div className="flex flex-col gap-2.5 rounded-lg border border-border bg-surface-hover/50 p-4">
      {PDF_EXTRACTION_STAGES.map(({ key, label }, index) => {
        const state = statuses[key]
        return (
          <div
            key={key}
            className="animate-slide-up flex items-center gap-2.5 text-sm"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${ICON_WRAPPER_CLASSES[state]}`}
            >
              {state === 'done' && <Check size={12} strokeWidth={3} />}
              {state === 'error' && <X size={12} strokeWidth={3} />}
              {state === 'active' && (
                <Loader2 size={12} className="animate-spin" />
              )}
            </span>
            <span
              className={`transition-colors duration-300 ${
                state === 'pending'
                  ? 'text-muted'
                  : state === 'error'
                    ? 'text-danger'
                    : 'text-foreground'
              } ${state === 'active' ? 'font-medium' : ''}`}
            >
              {state === 'active' && activeMessage ? activeMessage : label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

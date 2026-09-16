import { StatusBadge } from '@/components/ui/StatusBadge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { TopicStatus } from '@/types/preparation'

// A static preview of what a filled-in workspace looks like — the landing
// page's job is to show the "input → organized preparation → progress"
// story, not just collect input, so this sits right below the composer.
const PREVIEW_TOPICS: { name: string; status: TopicStatus }[] = [
  { name: 'JavaScript Fundamentals', status: 'completed' },
  { name: 'React', status: 'completed' },
  { name: 'Node.js & Express', status: 'understood' },
  { name: 'System Design Basics', status: 'need_to_study' },
  { name: 'Behavioral Interview Questions', status: 'need_to_study' },
]

export function WorkspacePreview() {
  const completed = PREVIEW_TOPICS.filter(t => t.status === 'completed').length

  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">
        This is what you&apos;ll get
      </p>
      <div className="relative isolate">
        <div
          className="absolute inset-x-4 -top-3 bottom-3 -z-10 rotate-[-2deg] rounded-2xl border border-border/50 bg-surface/60"
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-2 -top-1.5 bottom-1.5 -z-10 rotate-1 rounded-2xl border border-border/70 bg-surface/80"
          aria-hidden="true"
        />
        <div className="rounded-xl border border-border bg-surface p-5 text-left shadow-md transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-display text-lg font-semibold text-foreground">
                Full Stack Developer Interview
              </h3>
              <p className="mt-0.5 text-sm text-muted">
                {completed} of {PREVIEW_TOPICS.length} topics completed
              </p>
            </div>
          </div>
          <ProgressBar
            value={completed}
            max={PREVIEW_TOPICS.length}
            className="mt-4"
            barClassName="bg-type-interview"
          />
          <div className="mt-5 flex flex-col gap-3">
            {PREVIEW_TOPICS.map((topic, index) => (
              <div
                key={topic.name}
                className="animate-slide-up flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-surface-hover"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <span className="text-sm text-foreground">{topic.name}</span>
                <StatusBadge status={topic.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

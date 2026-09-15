import Link from 'next/link'
import { ListChecks, Sparkles, Youtube } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

const features = [
  {
    icon: ListChecks,
    title: 'Organize your topics',
    description:
      'Add topics one at a time or paste a whole list — ToPrep keeps every preparation structured and trackable.',
  },
  {
    icon: Youtube,
    title: 'Find videos, not tabs',
    description:
      'Search YouTube per topic or across many at once, and keep the videos that are actually worth watching.',
  },
  {
    icon: Sparkles,
    title: 'Scoped AI assistance',
    description:
      'A short explanation, a handful of expected questions, a sensible study order — never more than that.',
  },
]

export default function Home() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col items-center gap-8 px-4 py-24 text-center">
      <span className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted">
        Less searching. More prepping.
      </span>

      <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
        Turn your topic list into a preparation plan
      </h1>

      <p className="max-w-xl text-base text-muted">
        ToPrep helps you prepare for interviews, exams, and certifications.
        Bring your topics — ToPrep helps you organize them, find the right
        videos, and track what&rsquo;s left to learn.
      </p>

      <Link href="/preparations">
        <Button size="md" className="px-6 py-3 text-base">
          Get Started
        </Button>
      </Link>

      <div className="mt-8 grid grid-cols-1 gap-4 text-left sm:grid-cols-3">
        {features.map(feature => (
          <Card key={feature.title} className="p-5">
            <feature.icon size={20} className="text-brand" />
            <h3 className="mt-3 text-sm font-semibold text-foreground">
              {feature.title}
            </h3>
            <p className="mt-1 text-sm text-muted">{feature.description}</p>
          </Card>
        ))}
      </div>
    </main>
  )
}

import Link from 'next/link'
import { BookOpen, Sparkles, Youtube, FileText, Brain, Lightbulb } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

const features = [
  {
    icon: FileText,
    title: 'Upload & Extract',
    description: 'Upload PDFs and let AI automatically extract and organize topics in the correct order.',
    color: 'text-blue-500',
  },
  {
    icon: BookOpen,
    title: 'Organize Topics',
    description: 'Structure your preparation with organized sections. AI helps prioritize what matters most.',
    color: 'text-brand',
  },
  {
    icon: Youtube,
    title: 'Video Learning',
    description: 'Search and watch YouTube videos directly for each topic. Keep only the best learning materials.',
    color: 'text-danger',
  },
  {
    icon: Brain,
    title: 'AI Explanations',
    description: 'Get concise AI-powered explanations for complex topics from multiple LLM providers.',
    color: 'text-success',
  },
  {
    icon: Lightbulb,
    title: 'Practice Questions',
    description: 'AI generates expected interview and exam questions to test your knowledge.',
    color: 'text-warning',
  },
]

const aiProviders = [
  {
    name: 'Claude',
    color: 'from-orange-500 to-orange-600',
    textColor: 'text-orange-600',
  },
  {
    name: 'GPT',
    color: 'from-red-500 to-red-600',
    textColor: 'text-red-600',
  },
  {
    name: 'Gemini',
    color: 'from-blue-500 via-red-500 to-yellow-500',
    textColor: 'text-blue-600',
  },
  {
    name: 'YouTube',
    color: 'from-red-600 to-red-700',
    textColor: 'text-red-600',
  },
]


export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[560px]"
        style={{
          background:
            'radial-gradient(600px circle at 50% -10%, rgb(var(--brand) / 0.16), transparent 65%)',
        }}
        aria-hidden="true"
      />

      <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-4 py-16 text-center sm:py-24">
        {/* AI Powered Badge */}
        <div className="flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-semibold uppercase tracking-wider">
          <Sparkles size={14} className="text-brand" />
          <span className="text-foreground">AI Powered</span>
        </div>

        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Prepare smarter with
          <span className="text-brand"> AI-driven learning</span>
        </h1>

        <p className="max-w-2xl text-base leading-relaxed text-muted">
          Upload your study materials, extract topics, watch videos, and get AI explanations and practice questions — all in one intelligent preparation platform.
        </p>

        <Link href="/preparations">
          <Button size="md" className="px-8 py-3 text-base">
            Start Preparing Now
          </Button>
        </Link>

        {/* Main Features Grid - 5 columns */}
        <div className="w-full mt-12">
          <h2 className="mb-6 text-xl font-semibold text-foreground">
            Everything You Need to Succeed
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {features.map(feature => (
              <Card
                key={feature.title}
                className="p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
              >
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl bg-surface-2 ${feature.color}`}>
                  <feature.icon size={20} />
                </span>
                <h3 className="mt-3 text-sm font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Powered By AI Section */}
        <div className="w-full mt-16 pt-12 border-t border-border/50">
          <h2 className="mb-2 text-xl font-bold text-foreground">
            ⚡ Powered by Leading AI Models
          </h2>
          <p className="mb-10 text-sm text-muted">
            We integrate multiple advanced LLM providers to give you the best learning experience
          </p>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 max-w-2xl mx-auto">
            {aiProviders.map(provider => (
              <div
                key={provider.name}
                className={`flex flex-col items-center justify-center gap-3 px-4 py-6 rounded-xl border-2 border-border bg-gradient-to-br ${provider.color} opacity-10 hover:opacity-20 hover:border-brand/50 transition-all`}
              >
                <div
                  className={`h-12 w-12 rounded-full bg-gradient-to-br ${provider.color}`}
                />
                <span className="text-sm font-semibold text-foreground text-center">
                  {provider.name}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-8 text-xs text-muted text-center">
            🔐 Your data is secure. We use official APIs from each provider with enterprise-grade encryption.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="w-full mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-lg border border-border/50 bg-surface/30 p-6">
            <h3 className="font-semibold text-foreground mb-2">📄 Smart Extraction</h3>
            <p className="text-sm text-muted">
              Upload PDFs and AI automatically extracts and organizes topics in optimal order
            </p>
          </div>
          <div className="rounded-lg border border-border/50 bg-surface/30 p-6">
            <h3 className="font-semibold text-foreground mb-2">▶️ Video Integration</h3>
            <p className="text-sm text-muted">
              Search YouTube directly from topics and build curated playlists of quality content
            </p>
          </div>
          <div className="rounded-lg border border-border/50 bg-surface/30 p-6">
            <h3 className="font-semibold text-foreground mb-2">🧠 AI Assistance</h3>
            <p className="text-sm text-muted">
              Get personalized explanations, practice questions, and learning recommendations
            </p>
          </div>
        </div>
      </div>

    </main>
  )
}

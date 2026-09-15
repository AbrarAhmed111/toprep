import Link from 'next/link'
import { FileText, Sparkles, Youtube, Brain, Zap, CheckCircle2, Wand2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

const features = [
  {
    icon: FileText,
    title: 'Upload PDF & Extract Topics',
    description:
      'Upload your study materials. AI intelligently extracts and organizes topics in the correct learning order automatically.',
    highlight: true,
    bgGradient: 'from-blue-500/20 to-purple-500/20',
    borderColor: 'border-blue-500/50',
    iconBg: 'from-blue-500 to-purple-600',
    iconColor: 'text-white'
  },
  {
    icon: Youtube,
    title: 'Watch Videos Directly',
    description:
      'Search and watch YouTube videos right within each topic. No switching tabs, no distractions—learn in context.',
    bgGradient: 'from-red-500/10 to-red-600/5',
    borderColor: 'border-red-500/30',
    iconBg: 'bg-red-600',
    iconColor: 'text-white'
  },
  {
    icon: Brain,
    title: 'AI Explanations',
    description:
      'Get concise, beginner-friendly explanations for any topic powered by multiple AI providers with automatic fallback.',
    bgGradient: 'from-purple-500/10 to-pink-500/5',
    borderColor: 'border-purple-500/30',
    iconBg: 'bg-purple-600',
    iconColor: 'text-white'
  },
  {
    icon: CheckCircle2,
    title: 'Expected Questions',
    description:
      'AI generates realistic interview or exam questions for each topic. Practice with what actually matters.',
    bgGradient: 'from-emerald-500/10 to-teal-500/5',
    borderColor: 'border-emerald-500/30',
    iconBg: 'bg-emerald-600',
    iconColor: 'text-white'
  },
  {
    icon: Zap,
    title: 'Smart Organization',
    description:
      'AI suggests optimal section groupings and learning sequences. Reorganize topics with a single click.',
    bgGradient: 'from-amber-500/10 to-orange-500/5',
    borderColor: 'border-amber-500/30',
    iconBg: 'bg-amber-600',
    iconColor: 'text-white'
  },
  {
    icon: CheckCircle2,
    title: 'Track Progress',
    description:
      'Mark topics as understood, completed, or skipping. Keep track of your preparation journey at a glance.',
    bgGradient: 'from-cyan-500/10 to-blue-500/5',
    borderColor: 'border-cyan-500/30',
    iconBg: 'bg-cyan-600',
    iconColor: 'text-white'
  },
]

const aiProviders = [
  {
    name: 'Google Gemini',
    color: 'text-blue-400',
    logoSvg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <circle cx="6" cy="6" r="2" fill="#4285F4" />
        <circle cx="12" cy="6" r="2" fill="#DB4437" />
        <circle cx="18" cy="6" r="2" fill="#F4B400" />
        <circle cx="6" cy="12" r="2" fill="#0F9D58" />
        <circle cx="12" cy="12" r="2" fill="#AB47BC" />
        <circle cx="18" cy="12" r="2" fill="#00BCD4" />
      </svg>
    ),
    delay: '0s'
  },
  {
    name: 'OpenAI GPT',
    color: 'text-white',
    logoSvg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">G</text>
      </svg>
    ),
    delay: '0.1s'
  },
  {
    name: 'Anthropic Claude',
    color: 'text-purple-400',
    logoSvg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#E879F9" />
      </svg>
    ),
    delay: '0.2s'
  },
  {
    name: 'Groq',
    color: 'text-orange-400',
    logoSvg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11z" fill="#FF9900" />
      </svg>
    ),
    delay: '0.3s'
  },
]

export default function Home() {
  return (
    <main className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Animated gradient background */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[800px]"
        style={{
          background:
            'radial-gradient(800px circle at 50% 0%, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.1), transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* Hero Section */}
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 py-16 text-center sm:py-24">
        {/* AI-Powered Badge */}
        <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-300 shadow-lg backdrop-blur">
          <Sparkles size={16} className="animate-pulse" />
          🤖 AI-Powered Learning Platform
        </span>

        {/* Main Headline */}
        <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl">
          Prepare Smarter with
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"> AI Magic</span>
        </h1>

        {/* Subheading */}
        <p className="max-w-2xl text-lg leading-relaxed text-slate-300">
          Upload PDFs, watch YouTube videos, get AI explanations and expected questions—all in one intelligent learning platform powered by Google Gemini, OpenAI GPT, Anthropic Claude, and more.
        </p>

        {/* CTA Button */}
        <Link href="/preparations">
          <Button size="md" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-4 text-base font-semibold shadow-lg">
            Start Learning Now →
          </Button>
        </Link>

        {/* AI Providers */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <style>{`
            @keyframes slide-in-provider {
              from {
                opacity: 0;
                transform: translateX(-20px);
              }
              to {
                opacity: 1;
                transform: translateX(0);
              }
            }
            .provider-badge {
              animation: slide-in-provider 0.6s ease-out forwards;
            }
          `}</style>
          <span className="text-sm font-medium text-slate-300">Powered by:</span>
          {aiProviders.map(provider => (
            <div
              key={provider.name}
              className="provider-badge inline-flex items-center gap-2 rounded-full border border-slate-600/50 px-3 py-2 text-xs font-medium text-slate-200 backdrop-blur transition-all duration-300 hover:scale-105 hover:border-slate-500"
              style={{
                background: `linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)`,
                animationDelay: provider.delay,
              }}
            >
              <span className={`${provider.color} flex-shrink-0`}>
                {provider.logoSvg}
              </span>
              <span>{provider.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <div className="mx-auto max-w-6xl px-4 py-20">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Everything You Need to Master Any Topic
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            All-in-one platform combining AI, videos, and intelligent organization
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map(feature => (
            <Card
              key={feature.title}
              className={`relative overflow-hidden border-2 p-6 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-xl bg-gradient-to-br ${feature.bgGradient} ${feature.borderColor}`}
            >
              {feature.highlight && (
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-blue-500/20 blur-3xl" />
              )}
              <div className="relative">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${feature.iconBg} ${feature.iconColor}`}>
                  <feature.icon size={24} />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {feature.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Workflow Section */}
      <div className="mx-auto max-w-4xl px-4 py-20">
        <h2 className="mb-12 text-center text-3xl font-bold text-white sm:text-4xl">
          Your Learning Workflow
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {[
            { step: '1', title: 'Upload', desc: 'Add PDF or paste topics' },
            { step: '2', title: 'Organize', desc: 'AI organizes with magic' },
            { step: '3', title: 'Learn', desc: 'Videos + AI explanations' },
            { step: '4', title: 'Practice', desc: 'Get expected questions' },
          ].map((item, idx) => (
            <div key={idx} className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-blue-500/50 bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-2xl font-bold text-blue-300">
                {item.step}
              </div>
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Final CTA */}
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="rounded-2xl border-2 border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-8 backdrop-blur">
          <h2 className="text-2xl font-bold text-white">Ready to Ace Your Preparation?</h2>
          <p className="mt-3 text-slate-300">
            Join students and professionals mastering topics with AI-powered learning.
          </p>
          <Link href="/preparations">
            <Button size="md" className="mt-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-3 font-semibold shadow-lg">
              Start Your Journey
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}

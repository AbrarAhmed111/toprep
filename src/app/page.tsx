import Link from 'next/link'
import { BookOpen, Sparkles, Youtube, FileText, Brain, Lightbulb } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

// AI Provider Logo Components - Professional Branding
const ClaudeLogo = () => (
  <svg viewBox="0 0 100 100" className="w-8 h-8" fill="none">
    <defs>
      <linearGradient id="claude-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#9D7BE0" />
        <stop offset="100%" stopColor="#5B4B9A" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="48" fill="url(#claude-grad)"/>
    <text x="50" y="65" fontSize="50" fontWeight="bold" fill="white" textAnchor="middle" fontFamily="Arial">C</text>
  </svg>
)

const GPTLogo = () => (
  <svg viewBox="0 0 100 100" className="w-8 h-8" fill="none">
    <defs>
      <linearGradient id="gpt-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10A37F" />
        <stop offset="100%" stopColor="#0D7F5F" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="48" fill="url(#gpt-grad)"/>
    <text x="50" y="62" fontSize="35" fontWeight="bold" fill="white" textAnchor="middle" fontFamily="Arial">GPT</text>
  </svg>
)

const GeminiLogo = () => (
  <svg viewBox="0 0 100 100" className="w-8 h-8" fill="none">
    <defs>
      <linearGradient id="gemini-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4285F4" />
        <stop offset="33%" stopColor="#EA4335" />
        <stop offset="66%" stopColor="#FBBC04" />
        <stop offset="100%" stopColor="#34A853" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="48" fill="url(#gemini-grad)"/>
    <text x="50" y="65" fontSize="45" fontWeight="bold" fill="white" textAnchor="middle" fontFamily="Arial">G</text>
  </svg>
)

const YouTubeLogo = () => (
  <svg viewBox="0 0 100 100" className="w-8 h-8" fill="none">
    <circle cx="50" cy="50" r="48" fill="#FF0000"/>
    <polygon points="40,30 40,70 70,50" fill="white"/>
  </svg>
)

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
    logo: ClaudeLogo,
    description: 'Advanced reasoning and multi-turn conversations',
  },
  {
    name: 'GPT',
    logo: GPTLogo,
    description: 'State-of-the-art language understanding',
  },
  {
    name: 'Gemini',
    logo: GeminiLogo,
    description: 'Multimodal AI with advanced analysis',
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
        <div className="w-full mt-16">
          <h2 className="mb-8 text-2xl font-bold text-foreground text-center">
            Everything You Need to Succeed
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {features.map(feature => {
              const isVideoLearning = feature.title === 'Video Learning'
              return (
                <Card
                  key={feature.title}
                  className="p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:border-brand/50 flex flex-col items-center text-center min-h-72"
                >
                  <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-2 border-2 border-border/50 ${feature.color} transition-all duration-300`}>
                    {isVideoLearning ? (
                      <YouTubeLogo />
                    ) : (
                      <feature.icon size={28} strokeWidth={1.5} />
                    )}
                  </div>
                  <h3 className="mt-5 text-base font-bold text-foreground leading-tight">
                    {feature.title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-muted line-clamp-4">
                    {feature.description}
                  </p>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Powered By AI Section */}
        <div className="w-full mt-20 pt-12 border-t border-border/50">
          <h2 className="mb-3 text-2xl font-bold text-foreground text-center">
            ⚡ Powered by Industry-Leading AI
          </h2>
          <p className="mb-12 text-sm text-muted text-center max-w-2xl mx-auto">
            We integrate multiple advanced LLM providers to give you the best learning experience and multiple ways to understand complex topics
          </p>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 max-w-3xl mx-auto">
            {aiProviders.map(provider => {
              const LogoComponent = provider.logo
              return (
                <Card
                  key={provider.name}
                  className="flex flex-col items-center justify-center gap-4 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-brand/50"
                >
                  <div className="text-orange-500 dark:text-orange-400">
                    <LogoComponent />
                  </div>
                  <div className="text-center">
                    <h3 className="text-sm font-bold text-foreground">
                      {provider.name}
                    </h3>
                    <p className="mt-1 text-xs text-muted leading-tight">
                      {provider.description}
                    </p>
                  </div>
                </Card>
              )
            })}
          </div>

          <div className="mt-10 p-4 rounded-lg bg-surface/50 border border-border/50">
            <p className="text-xs text-muted text-center">
              🔐 <span className="font-medium text-foreground">Your data is secure.</span> We use official APIs from each provider with enterprise-grade encryption and never store your study materials.
            </p>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="w-full mt-16 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <Card className="p-6 border-l-4 border-l-blue-500 hover:shadow-md transition-all">
            <h3 className="text-sm font-bold text-foreground mb-3">📄 Smart Extraction</h3>
            <p className="text-sm text-muted leading-relaxed">
              Upload PDFs and AI automatically extracts and organizes topics in optimal learning order
            </p>
          </Card>
          <Card className="p-6 border-l-4 border-l-danger hover:shadow-md transition-all">
            <h3 className="text-sm font-bold text-foreground mb-3">▶️ Video Integration</h3>
            <p className="text-sm text-muted leading-relaxed">
              Search YouTube directly from topics and build curated playlists of quality content
            </p>
          </Card>
          <Card className="p-6 border-l-4 border-l-success hover:shadow-md transition-all">
            <h3 className="text-sm font-bold text-foreground mb-3">🧠 AI Assistance</h3>
            <p className="text-sm text-muted leading-relaxed">
              Get personalized explanations, practice questions, and learning recommendations
            </p>
          </Card>
        </div>
      </div>

    </main>
  )
}

import Link from 'next/link'
import { BookOpen, Sparkles, Youtube, FileText, Brain, Lightbulb } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

// AI Provider Logo Components - Using Official Brand Images
const ClaudeLogo = () => (
  <img
    src="https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b0/Claude_AI_symbol.svg/1280px-Claude_AI_symbol.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail"
    alt="Claude"
    className="w-8 h-8 object-contain"
  />
)

const GPTLogo = () => (
  <img
    src="https://static.vecteezy.com/system/resources/previews/021/059/825/non_2x/chatgpt-logo-chat-gpt-icon-on-green-background-free-vector.jpg"
    alt="GPT"
    className="w-8 h-8 object-contain"
  />
)

const GeminiLogo = () => (
  <img
    src="https://raw.githubusercontent.com/lobehub/lobe-icons/refs/heads/master/packages/static-png/dark/gemini-color.png"
    alt="Gemini"
    className="w-8 h-8 object-contain"
  />
)

const YouTubeLogo = () => (
  <img
    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqKweOmL0sCXzCDo4pd2RgiRUvniaVvfMIwt1t4RHtKA&s=10"
    alt="YouTube"
    className="w-8 h-8 object-contain"
  />
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

        {/* Main Features Grid - 5 columns with improved card design */}
        <div className="w-full mt-20">
          <h2 className="mb-12 text-3xl font-bold text-foreground text-center">
            Everything You Need to Succeed
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {features.map(feature => {
              const isVideoLearning = feature.title === 'Video Learning'
              return (
                <Card
                  key={feature.title}
                  className="p-8 transition-all duration-300 hover:-translate-y-3 hover:shadow-xl hover:border-brand/60 flex flex-col items-center text-center min-h-80 border-2 group"
                >
                  {/* Icon/Logo Container */}
                  <div className={`flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br ${feature.color === 'text-brand' ? 'from-brand/20 to-brand/10' : 'from-surface-2 to-surface'} border-3 border-${feature.color === 'text-brand' ? 'brand/30' : 'border/50'} ${feature.color} transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}>
                    {isVideoLearning ? (
                      <YouTubeLogo />
                    ) : (
                      <feature.icon size={32} strokeWidth={1.3} />
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="mt-6 text-lg font-bold text-foreground leading-tight">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-4 text-sm leading-relaxed text-muted line-clamp-5 flex-grow">
                    {feature.description}
                  </p>

                  {/* Learn More Link */}
                  <div className="mt-auto pt-4">
                    <div className="inline-flex items-center gap-1 text-xs font-semibold text-brand opacity-0 group-hover:opacity-100 transition-opacity">
                      Learn more <span>→</span>
                    </div>
                  </div>
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

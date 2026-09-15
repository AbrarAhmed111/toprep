import Link from 'next/link'
import { BookOpen, Sparkles, Youtube, FileText, FolderKanban, HelpCircle, ArrowRight } from 'lucide-react'
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
    className="w-8 rounded-md h-8 object-contain"
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
    src="https://img.magnific.com/premium-vector/youtube-app-round-icon-social-media-logo-vector-illustration_277909-797.jpg?semt=ais_hybrid&w=740&q=80"
    alt="YouTube"
    className="w-8 h-8 object-contain"
  />
)

const features = [
  {
    icon: FileText,
    title: 'Upload & Extract',
    description: 'Upload PDFs and let AI automatically extract, structure, and organize key topics for fast revision.',
    gradient: 'from-blue-500/20 to-blue-600/10',
    iconColor: 'text-blue-400',
  },
  {
    icon: FolderKanban,
    title: 'Organize Topics',
    description: 'Structure your preparation into clean, prioritized sections with intelligent AI suggestions.',
    gradient: 'from-purple-500/20 to-purple-600/10',
    iconColor: 'text-purple-400',
  },
  {
    icon: Youtube,
    title: 'Video Learning',
    description: 'Search and stream relevant YouTube educational videos directly alongside your study notes.',
    gradient: 'from-red-500/20 to-red-600/10',
    iconColor: 'text-red-400',
  },
  {
    icon: Sparkles,
    title: 'AI Explanations',
    description: 'Get instant, simplified breakdowns and visual explanations for complex concepts from Claude, GPT, and Gemini.',
    gradient: 'from-yellow-500/20 to-yellow-600/10',
    iconColor: 'text-yellow-400',
  },
  {
    icon: HelpCircle,
    title: 'Practice Questions',
    description: 'Auto-generate tailored exam and interview questions with real-time feedback and detailed solutions.',
    gradient: 'from-green-500/20 to-green-600/10',
    iconColor: 'text-green-400',
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

        {/* Modern Features Section - Glassmorphic Design */}
        <div className="w-full mt-24">
          {/* Header with Badge */}
          <div className="flex flex-col items-center gap-4 mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
              <Sparkles size={16} className="text-brand" />
              <span className="text-xs font-semibold uppercase tracking-wider text-brand">Features</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-center text-foreground max-w-3xl">
              Everything You Need to Succeed
            </h2>
          </div>

          {/* Features Grid - 3 columns responsive */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {features.map(feature => {
              const isVideoLearning = feature.title === 'Video Learning'
              const Icon = feature.icon

              return (
                <div
                  key={feature.title}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl p-8 transition-all duration-300 hover:border-white/20 hover:bg-gradient-to-br hover:from-white/10 hover:to-white/5 hover:shadow-2xl hover:-translate-y-1"
                >
                  {/* Animated background glow on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/0 group-hover:from-white/5 group-hover:to-white/[0.02] transition-all duration-300 pointer-events-none" />

                  {/* Content */}
                  <div className="relative z-10 flex flex-col h-full items-center">
                    {/* Icon Container - Centered */}
                    <div className={`flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} border border-white/10 ${feature.iconColor} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      {isVideoLearning ? (
                        <YouTubeLogo />
                      ) : (
                        <Icon size={28} strokeWidth={1.5} />
                      )}
                    </div>

                    {/* Title - Centered */}
                    <h3 className="text-xl font-semibold text-white mb-3 leading-tight text-center">
                      {feature.title}
                    </h3>

                    {/* Description - Full text without truncation, Centered */}
                    <p className="text-sm text-gray-400 leading-relaxed text-center">
                      {feature.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Powered By AI Section */}
        <div className="w-full mt-20 pt-12 border-t border-white/10">
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
                  className="flex flex-col items-center justify-center gap-4 p-6 hover:-translate-y-1 hover:shadow-lg"
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

          <div className="mt-10 p-4 rounded-lg border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl">
            <p className="text-xs text-muted text-center">
              🔐 <span className="font-medium text-foreground">Your data is secure.</span> We use official APIs from each provider with enterprise-grade encryption and never store your study materials.
            </p>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="w-full mt-16 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <Card className="p-6 border-l-4 border-l-blue-500 hover:-translate-y-1 hover:shadow-lg">
            <h3 className="text-sm font-bold text-foreground mb-3">📄 Smart Extraction</h3>
            <p className="text-sm text-muted leading-relaxed">
              Upload PDFs and AI automatically extracts and organizes topics in optimal learning order
            </p>
          </Card>
          <Card className="p-6 border-l-4 border-l-danger hover:-translate-y-1 hover:shadow-lg">
            <h3 className="text-sm font-bold text-foreground mb-3">▶️ Video Integration</h3>
            <p className="text-sm text-muted leading-relaxed">
              Search YouTube directly from topics and build curated playlists of quality content
            </p>
          </Card>
          <Card className="p-6 border-l-4 border-l-success hover:-translate-y-1 hover:shadow-lg">
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

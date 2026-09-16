import { PreparationComposer } from '@/components/landing/PreparationComposer'
import { ExamplePreparations } from '@/components/landing/ExamplePreparations'
import { WorkspacePreview } from '@/components/landing/WorkspacePreview'
import { AmbientBackground } from '@/components/landing/AmbientBackground'
import { Footer } from '@/components/layout/Footer'

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <AmbientBackground />

      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-8 px-4 py-16 text-center sm:py-16">
        <div className="flex flex-col items-center gap-3">
          <h1 className="font-display text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
            Less searching. <span className="text-primary">More prepping.</span>
          </h1>
          <p className="max-w-md text-base text-muted">
            Tell ToPrep what you&apos;re preparing for and what you need to
            learn, it builds your workspace instantly.
          </p>
        </div>

        <PreparationComposer />
        <ExamplePreparations />
        <WorkspacePreview />

        <p className="text-xs text-muted">
          Free to use as a guest — everything is saved on this device.
        </p>
      </div>

      <Footer />
    </main>
  )
}

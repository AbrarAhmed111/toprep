import { PreparationComposer } from '@/components/landing/PreparationComposer'
import { ExamplePreparations } from '@/components/landing/ExamplePreparations'
import { Footer } from '@/components/layout/Footer'

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[560px]"
        style={{
          background:
            'radial-gradient(600px circle at 50% -10%, rgb(var(--primary) / 0.16), transparent 65%)',
        }}
        aria-hidden="true"
      />

      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-8 px-4 py-16 text-center sm:py-24">
        <div className="flex flex-col items-center gap-3">
          <h1 className="text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
            Less searching. <span className="text-primary">More prepping.</span>
          </h1>
          <p className="max-w-md text-base text-muted">
            Tell ToPrep what you&apos;re preparing for and what you need to
            learn — it builds your workspace instantly.
          </p>
        </div>

        <PreparationComposer />
        <ExamplePreparations />

        <p className="text-xs text-muted">
          Free to use as a guest — everything is saved on this device.
        </p>
      </div>

      <Footer />
    </main>
  )
}

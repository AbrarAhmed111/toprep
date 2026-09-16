// Soft, slowly drifting gradient blobs behind the hero. Purely decorative —
// respects prefers-reduced-motion via the global override on .animate-drift.
export function AmbientBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[640px] overflow-hidden"
      aria-hidden="true"
    >
      <div
        className="animate-drift absolute left-1/2 top-[-140px] h-[420px] w-[420px] -translate-x-[60%] rounded-full bg-primary/20 blur-3xl"
        style={{ animationDuration: '22s' }}
      />
      <div
        className="animate-drift absolute right-[8%] top-[60px] h-[320px] w-[320px] rounded-full bg-type-custom/20 blur-3xl"
        style={{ animationDuration: '26s', animationDelay: '2s' }}
      />
      <div
        className="animate-drift absolute left-[12%] top-[260px] h-[260px] w-[260px] rounded-full bg-primary/10 blur-3xl"
        style={{ animationDuration: '30s', animationDelay: '4s' }}
      />
    </div>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-border py-6 text-center text-xs text-muted">
      <p>
        <span className="font-medium text-foreground">ToPrep</span> — Less
        searching. More prepping.
      </p>
      <p className="mt-1">© {new Date().getFullYear()} ToPrep</p>
    </footer>
  )
}

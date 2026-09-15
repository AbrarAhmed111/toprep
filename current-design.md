# ToPrep — Current Design Audit

App: **ToPrep** ("Less searching. More prepping.") — an AI-assisted study/interview-prep tool. Upload/organize topics into preparations, group into sections, attach YouTube lessons, get AI explanations and practice questions per topic.

Stack: Next.js 15 (App Router) + React 18 + TypeScript, Tailwind CSS 3, Redux Toolkit (local-storage-persisted state, no backend DB for this data), `@dnd-kit` for drag-and-drop, `lucide-react` + `react-icons` for icons, `react-hot-toast` for toasts, `@formkit/auto-animate` for list animations.

This doc is a snapshot for handing to another model (e.g. GPT) to get redesign recommendations. It covers the design tokens, every page/component, and — importantly — the **inconsistencies currently in the codebase**, since the app is mid-migration between two different visual styles.

---

## 1. The core problem: two design systems coexisting

Recent commits ("Apply sleek glassmorphic theme to all pages and components", "Update AppHeader with sleek glassmorphic design...") introduced a **dark glassmorphic** look (`bg-white/5`, `border-white/10`, `backdrop-blur-xl`, gradient overlays) on top of an **older warm, light "cream/terracotta" design system** built from CSS variables (`bg-surface`, `border-border`, `text-muted`, etc.). The migration was only partially applied:

- **Fully migrated to glassmorphism**: landing page (`page.tsx`), `AppHeader`, `Button`, `Card`, `Modal`, `Input`, `Select`, `Textarea`, `PreparationCard`, `TopicContainer` (the live topic row).
- **Still on the old token system** (untouched): `EmptyState`, `ThemeToggle`, `SectionHeader`, `AddSectionForm`/tab UI inside `AddTopicPanel`, `DeleteSectionDialog`, the **entire live YouTube-search flow** (`TopicYouTubeSearchRedesigned` + `YouTubeFilters`), most of `PreparationWorkspace`'s own markup (edit button, progress bar, selection bar), `error.tsx`/`not-found.tsx`.
- **The CSS tokens themselves were never updated** for the glassmorphic direction: `src/assets/css/globals.css` still defines a **light, warm cream/terracotta palette** as the `:root` default (`--background: 250 243 230` ≈ `#FAF3E6`, `--brand: 201 100 66` ≈ a burnt-orange terracotta) with a separate dark-mode override. Meanwhile the glassmorphic components hard-code `white/5`, `white/10` etc. directly rather than using the token system, and assume a **dark** background — but the token-based `body` background is a gradient mixing the cream `--background` var with a hard-coded navy (`rgb(23 37 84 / 0.5)`, Tailwind's `blue-900`). In light mode this produces a muddy cream-into-navy diagonal gradient behind glass cards designed for a dark backdrop.
- There's also a real **light/dark theme toggle** (`ThemeToggle`, persisted to `localStorage`, `prefers-color-scheme` fallback) wired through CSS variables — but the glassmorphic components' hard-coded `white/*` opacities don't adapt to light mode at all, so the two features (theme toggle vs. glass redesign) actively fight each other.

**This is probably the single most important thing for a redesign to resolve**: pick one direction (full dark glassmorphic, ditch the light theme; or a proper token-driven glass system that works in both themes; or revert to the original warm token system) and apply it uniformly, rather than continuing to patch page-by-page.

---

## 2. Design tokens (`src/assets/css/globals.css` + `tailwind.config.ts`)

Colors are stored as `R G B` triplets on CSS custom properties, wrapped by Tailwind via `rgb(var(--x) / <alpha-value>)` so opacity modifiers work (e.g. `bg-surface/80`).

### Light (default `:root`)
| token | rgb | approx hex | usage |
|---|---|---|---|
| `--background` | 250 243 230 | `#FAF3E6` | page bg (cream) |
| `--foreground` | 43 36 23 | `#2B2417` | body text (dark brown) |
| `--surface` | 255 253 248 | `#FFFDF8` | card bg |
| `--surface-2` | 241 228 204 | `#F1E4CC` | secondary surface / hover |
| `--border` | 232 215 184 | `#E8D7B8` | borders |
| `--muted` | 138 122 95 | `#8A7A5F` | secondary text |
| `--brand` | 201 100 66 | `#C96442` | terracotta/burnt-orange primary |
| `--brand-hover` | 177 85 55 | `#B15537` | |
| `--accent-teal` | 79 143 124 | `#4F8F7C` | secondary accent |
| `--success` / `--success-bg` | 79 148 99 / 232 243 231 | green | |
| `--warning` / `--warning-bg` | 192 134 42 / 250 240 220 | amber | |
| `--danger` / `--danger-bg` | 193 72 61 / 250 233 230 | red | |
| shadows | soft warm-tinted `rgba(43,32,20,…)` | | sm/md/lg scale |

### Dark (`prefers-color-scheme: dark` or `[data-theme=dark]`)
| token | rgb | approx hex |
|---|---|---|
| `--background` | 27 22 15 | `#1B160F` |
| `--foreground` | 244 234 214 | `#F4EAD6` |
| `--surface` | 36 30 20 | `#241E14` |
| `--surface-2` | 21 17 11 | `#15110B` |
| `--brand` | 229 138 99 | `#E58A63` (lighter terracotta) |
| `--accent-teal` | 127 184 165 | |
| shadows | black-tinted, heavier | |

This is a warm, earthy, "cozy study desk" palette by design — not the blue/purple/neutral-gray palette typical of most SaaS dashboards, and **not** what the ad-hoc glassmorphic overlays visually read as (those read as a generic dark "neon/glass" tech aesthetic, closer to blue-black).

### Tailwind mapping
Tokens exposed as: `background`, `foreground`, `brand` (+ `.hover`, `.foreground`), `surface`, `surface-2`, `border`, `muted`, `teal`, `success`/`success.bg`, `warning`/`warning.bg`, `danger`/`danger.bg`. Shadows: `shadow-sm|DEFAULT|md|lg` mapped to the CSS var scale. Font: `Inter` (Google Fonts, variable weight 100–900) as the sole typeface, `font-optical-sizing: auto`.

### What glassmorphic components actually use (not tokens)
`border-white/10` / `border-white/20` (hover), `bg-white/5` → `bg-white/10` (hover), gradient `bg-gradient-to-br from-white/5 to-white/[0.02]`, `backdrop-blur-xl` / `backdrop-blur-sm`, `shadow-2xl` on hover, `-translate-y-1` lift on hover. These are pure Tailwind opacity utilities with **no theme awareness** — they look fine over a dark bg and wash out/become nearly invisible over the light cream bg.

### Radius / motion conventions
- Radius: `rounded-xl` (buttons, inputs) / `rounded-2xl` (cards, modals) / `rounded-full` (badges, avatar, theme toggle) — consistent throughout.
- Custom keyframes in globals.css: `fade-in` (0.15s), `scale-in` (0.16s, modal open), `slide-up` (0.25s) — all `cubic-bezier(0.16,1,0.3,1)` (a springy ease-out).
- Component-level ad-hoc animation is also used liberally in the topics area: `animate-in fade-in slide-in-from-*` (Tailwind-animate-style utility classes, not defined in globals.css — likely relies on a plugin or v4 syntax; **worth double-checking these classes actually resolve**, since `tailwindcss-animate` isn't in `package.json`'s dependency list), a hand-rolled CSS `@keyframes shimmer` injected via a `<style>` tag in `TopicList.tsx`, staggered `animationDelay` per list item, a `Wand2`-spinning "magic" sparkle effect in `AiOrganizeButton`.
- `active:scale-[0.97]` press-feedback on all buttons.

---

## 3. Typography

- Single font family: **Inter** everywhere, loaded via `@import` in globals.css (not `next/font` — no self-hosting/optimization).
- No defined type scale / heading component system — sizes are picked ad hoc per usage:
  - Landing H1: `text-4xl sm:text-5xl font-semibold`
  - Landing feature-section H2: `text-4xl sm:text-5xl font-bold`
  - Page H1 (dashboard, workspace): `text-2xl font-semibold`
  - Card/section titles: `text-base font-semibold` → `text-sm font-semibold` → `text-lg font-semibold` (TopicContainer) — inconsistent across similar-purpose components
  - Body/description: `text-sm` / `text-base`, `text-muted`
  - Labels/eyebrows: `text-xs font-semibold uppercase tracking-wider` (landing section badges) vs `text-xs font-semibold uppercase tracking-wide` (section headers) — two different tracking values for the same visual role
- No documented scale in Tailwind config (no custom `fontSize` extension) — everything is inline utility classes, decided per-component.

---

## 4. Layout & structure

- Global shell: `AppHeader` (sticky, glass) → page content → (no footer anywhere in the app).
- Max-width containers vary by page: landing/header/dashboard/error/not-found use `max-w-5xl`; workspace uses `max-w-4xl`; not-found uses `max-w-2xl`. No shared layout primitive — each page hand-codes its own `mx-auto max-w-* px-4 py-*`.
- Responsive breakpoints used: `sm`, `md`, `lg` (Tailwind defaults) — grids collapse 3→2→1 columns (dashboard cards, landing features).
- No sidebar/nav beyond the header; navigation is a single header link ("Your Preparations") plus the logo-as-home-link and in-page back links (`ArrowLeft` "Back to Preparations").

---

## 5. Pages

### `/` — Landing (`src/app/page.tsx`)
- Hero: radial brand-colored glow behind an H1 + subtext + single primary CTA ("Start Preparing Now" → `/preparations`).
- "Features" section: eyebrow pill badge + H2, then a 1/2/3-col grid of 5 glass feature cards (icon in a gradient tinted box, title, description). One card (Video Learning) swaps its icon for a raw YouTube logo `<img>` from an external CDN instead of an inline icon — inconsistent with the other 4 using `lucide-react` icons.
- "Powered by AI" section: same eyebrow+H2 pattern, then 3 provider cards (Claude, ChatGPT, Gemini) each rendering a **hot-linked external image** as the provider logo (Wikipedia, vecteezy.com, a GitHub raw lobehub icon) — fragile (hotlinking third-party/stock-photo URLs, no local asset, no fallback, sizes/aspect ratios not controlled, `GPTLogo` has a stray `rounded-md` class ordering typo `w-8 rounded-md h-8`).
- Small trust/security note strip with a lock icon at the bottom.
- No footer, no secondary nav, no pricing/testimonials/FAQ — it's a single long scroll ending abruptly after the AI-providers block.

### `/preparations` — Dashboard (`PreparationsDashboard.tsx`)
- Header row: "Your Preparations" title + tagline, "New Preparation" primary button.
- Search input with leading icon, live-filters by title only (no filter by type/status/date).
- Grid of `PreparationCard`s (responsive 1/2/3 col), or `EmptyState` (two variants: "no preparations yet" vs "no matches" for a search with no hits).
- `PreparationFormModal` (create/edit) and `ConfirmDialog` (delete) as overlays.
- Each `PreparationCard`: type icon chip, title (whole card is a link via absolute-positioned overlay), optional 2-line-clamp description, type + target-date badges, "N topics / N completed" text + slim progress bar, and a hover-revealed row of Edit/Duplicate/Delete icon buttons.

### `/preparations/[id]` — Workspace (`PreparationWorkspace.tsx`)
The most complex screen:
- Back link, title/description, type+date badges, edit button (still old-token-styled, visually inconsistent with the glass edit affordance pattern used elsewhere).
- Overall progress bar (topics completed / total) — second, separate progress-bar implementation from the one on `PreparationCard` (not shared as a component).
- `AddTopicPanel`: toggle button that expands (via CSS grid-rows transition) a card with a Single/Bulk tab switch; bulk mode is a textarea (one topic per line, capped at `MAX_BULK_TOPICS`, dedupes existing names case-insensitively, reports duplicates/truncation via toast).
- Bulk selection bar (appears once ≥1 topic selected): count, "Select all", "Clear" — old-token-styled pill.
- `AiOrganizeButton` ("Organize with AI", only shown once ≥2 topics exist): calls an AI organize endpoint, shows an elaborate ~2s "magic" loading state (spinning wand, orbiting dots, pulsing glow, bouncing sparkles) before applying the result, then a follow-up shimmer + staggered slide-in animation across the reorganized list. This is by far the most animation-heavy single interaction in the app.
- `SectionBoard`: drag-and-drop (`@dnd-kit`) reorderable list of collapsible section cards, each with a checkbox-select-all header, rename-inline, delete (via `DeleteSectionDialog`, which offers "move topics to Unsectioned" vs "delete topics too"), plus a trailing "Unsectioned" group. If there are zero sections yet, it falls back to rendering one flat `TopicList` with no section chrome.
- Each topic renders as a `TopicContainer` (see §6) — a fairly large card, not a compact row, so a long topic list makes for a lot of vertical scrolling (there's no virtualization).

### Error / empty states
- `error.tsx` (route error boundary) and `not-found.tsx` (404) share an identical layout: icon-in-circle (warning triangle), H1, description, action buttons — but **use different icon backgrounds** (`bg-danger-bg`/`text-danger` vs `bg-warning-bg`/`text-warning`) despite both using the same `RiAlarmWarningFill` icon, and both still use pre-glassmorphism token classes (never touched by the redesign pass).

---

## 6. Component inventory

### `ui/` primitives (all `'use client'`, all migrated to glass except EmptyState)
| Component | Notes |
|---|---|
| `Button` | variants `primary/secondary/ghost/danger`, sizes `sm/md`. `primary`/`danger` use solid token colors (`bg-brand`, `bg-danger`); `secondary`/`ghost` use glass (`bg-white/5`, `bg-white/10`) — so even within one component the two systems are mixed by variant. |
| `Card` | glass gradient + hover lift/border-brighten + `backdrop-blur-xl`. Used for feature cards, provider cards, prep cards, section cards, add-topic panel. |
| `Badge` | tones `neutral/brand/success/warning/danger`, still 100% token-based (`bg-surface-2`, `bg-success-bg`…) — not glass. |
| `Input` / `Textarea` / `Select` | glass style (`bg-white/5`, `border-white/10`, `backdrop-blur-sm`), brand focus ring. `Select` has a custom chevron (native `<select>` under the hood, not a custom listbox). |
| `Modal` | glass panel, backdrop `bg-foreground/10 backdrop-blur-sm`, close on Escape/backdrop click, header/body/optional-footer layout, scale-in animation. |
| `ConfirmDialog` | thin wrapper over `Modal` + `Button` for yes/no confirms. |
| `EmptyState` | **not migrated** — dashed border, `bg-surface-2`, `text-brand` icon circle. Used for "no preparations", "no topics", "preparation not found". |

### Feature components actually rendered in the app (live tree)
`AppHeader` → `ThemeToggle` (old-token pill button, sun/moon icon, only place theme is switchable) · `PreparationsDashboard` → `PreparationCard`, `PreparationFormModal` (+ `Modal`/`Input`/`Textarea`/`Select`), `ConfirmDialog` · `PreparationWorkspace` → `AddTopicPanel`, `AiOrganizeButton`, `SectionBoard` → `AddSectionForm`, `SectionHeader`, `DeleteSectionDialog`, `TopicList` → `TopicContainer` → `TopicYouTubeSearchRedesigned` → `YouTubeFilters`.

### Dead code (built, styled, but not imported/rendered anywhere)
These exist in the repo and would confuse an AI reviewer or a new dev if not flagged — worth deleting or reconciling before/alongside a redesign:
- `src/components/topics/TopicCard.tsx` — an older, fully old-token-styled topic card. Superseded by `TopicContainer`.
- `src/components/topics/TopicRow.tsx` — an even older compact table-row-style topic representation (status dot, inline section-move dropdown). Not used by `TopicList` (which renders `TopicContainer` instead).
- `src/components/youtube/TopicYouTubeSearch.tsx` — old-token YouTube search UI, only referenced by the dead `TopicCard`.
- `src/components/youtube/GlobalYouTubeSearch.tsx`, `YouTubeSearchModal.tsx`, `SelectedVideosList.tsx`, `YouTubeVideoCard.tsx` — an entire alternate "search videos globally / select multiple / modal picker" flow (multi-select video cards, a full search modal) with zero import references anywhere in the app. Represents a different, more list-oriented UX direction than the single-card swipe-style flow that's actually live (`TopicYouTubeSearchRedesigned`).

A redesign brief should decide whether any of that dead UX (batch video selection, a dedicated search modal) is a direction worth reviving, or whether it should just be deleted.

### Live YouTube lesson flow (`TopicYouTubeSearchRedesigned` + `YouTubeFilters`)
The actual UX, per topic (expanded inside `TopicContainer`): idle "Find a learning video" prompt → click "Find" reveals inline duration/sort filter selects → search hits a backend (`/api/youtube/search`, `/api/youtube/videos/details`) → shows **one video at a time** (embedded iframe player, title/channel/duration/views/published-date meta) with Skip/Next controls that page through results one-by-one (a Tinder-style single-card browse, not a grid/list of results) → "New search" resets. This entire component tree is **not** glassmorphic — plain bordered cards on `bg-surface`/`bg-surface-2`.

### AI feature affordances (`TopicContainer`)
Two per-topic buttons — "Explain" (`Zap` icon) and "Questions" — call AI endpoints (`generateTopicExplanation`, `generateExpectedQuestions`), each with its own loading state (three staggered pulsing dots), success state (turns green, `CheckCircle2` icon, label flips to "Explained"/"Questioned"), and renders results inline in a tinted `bg-brand/5 border-brand/20` box below the topic (skeleton pulse placeholders shown while generating).

---

## 7. Iconography & brand assets

- Icons: `lucide-react` (primary, most of the app) + `react-icons` (`Io`/`Ri` sets used for exactly two one-off icons: lock icon on landing, warning-triangle on error/404 pages) — two icon libraries in play for no clear reason.
- Logo: `src/assets/img/logo.png`, referenced via `next/image` in `AppHeader` inside a `bg-brand` rounded-xl chip. This asset is **new/untracked** in git (`?? src/assets/img/`) alongside modified `favicon.ico` files in both `public/` and `src/app/` — i.e. there's a rebrand-in-progress that hasn't been committed yet.
- Landing page hotlinks 4 external images (Claude/GPT/Gemini/YouTube logos) from third-party CDNs rather than using local/optimized assets — a real risk (broken hotlinks, no control over image dimensions/format, potential trademark/attribution concerns for repurposed stock-photo "GPT" and "YouTube" icons that aren't official brand assets).

---

## 8. Interaction/motion patterns worth noting for a redesigner

- Drag-and-drop reordering (topics within a group, sections themselves) via `@dnd-kit`, keyboard-accessible sensors included.
- `@formkit/auto-animate` wraps most add/remove/reorder lists for automatic FLIP-style transitions.
- Heavy bespoke animation specifically around the "AI Organize" action (sparkles/glow/shimmer/staggered entrance) — disproportionate relative to the otherwise-minimal motion budget elsewhere in the app; a redesign should decide if this level of flourish is the intended brand feeling everywhere, or a one-off.
- Hover-lift (`-translate-y-1`) + shadow-grow pattern used identically for prep cards, section cards, feature cards, AI-provider cards, and topic containers.
- Inline-edit pattern (click title → text input + check/X buttons, Enter/Escape handling) is reimplemented independently in `SectionHeader`, `TopicCard`, `TopicRow`, and `TopicContainer` — four separate copies of near-identical logic and near-identical (but not pixel-identical) markup. A shared `InlineEditableText` component would remove a lot of duplication and drift.

---

## 9. Summary of open questions for a redesign

1. **Pick one visual language.** Warm light/dark cream-terracotta token system (currently defined in CSS, currently what `EmptyState`, `Badge`, `ThemeToggle`, `SectionHeader`, the YouTube-search flow, and the error/404 pages still look like) vs. the dark glassmorphic look partially applied to header/buttons/cards/landing. Right now the app renders as neither, consistently.
2. **Decide whether the light theme stays.** The glass components assume a dark backdrop and don't restyle for light mode; the toggle exists and is wired up but produces a visually broken light mode wherever glass components appear.
3. **Establish a real type scale** (headings currently vary 2xl/4xl/5xl with semibold/bold inconsistently chosen per page) and a single icon library.
4. **Consolidate duplicated UI**: two progress-bar implementations, four inline-rename implementations, two dead YouTube-search UX trees, two dead topic-card components — a redesign is a natural point to delete these and factor out shared primitives (`ProgressBar`, `InlineEditableText`).
5. **Replace hotlinked third-party logo images** on the landing page with owned/optimized assets.
6. **Reconsider the AI-organize flourish** relative to the rest of the app's (currently minimal) motion language, and apply that decision consistently rather than as a one-off.
7. A brand refresh already seems underway (new `logo.png`, modified favicons, uncommitted) — worth aligning any GPT recommendations with wherever that's headed rather than treating brand assets as fixed.

# ToPrep

**Less searching. More prepping.**

ToPrep is a preparation workspace that turns a list of topics into an organized
learning and preparation experience. Instead of manually hunting for resources
on every topic, you create a **Preparation** (an interview, exam, or
certification goal), add your **Topics**, and ToPrep helps you work through the
material efficiently — finding relevant YouTube videos, suggesting a sensible
learning order, and generating short AI explanations and expected questions
along the way.

> Core philosophy: **you bring the topics, ToPrep helps you prepare.**

## What ToPrep does

- Organizes topics into a clear, navigable structure (Preparations → Sections →
  Topics)
- Finds relevant YouTube videos for each topic, individually or across many
  topics at once
- Lets you select, reject, and filter/sort videos per topic
- Generates a short (2–3 line) AI explanation for each topic
- Generates a small set of AI expected questions per topic
- Suggests an effective learning order across topics — you review and explicitly
  accept it
- Supports lightweight personal notes per topic
- Tracks what's been studied and what remains
- Works fully as a guest (local storage) with optional accounts for cloud sync
  across devices

ToPrep is intentionally **not** an AI-first app, AI tutor, agent, or RAG-powered
search engine. AI is a scoped, supporting feature limited to three capabilities:
topic ordering, short explanations, and expected questions.

## Core data hierarchy

```
User
 └─ Preparations
     └─ Preparation
         └─ Sections / Categories
             └─ Topics
                 └─ YouTube Videos
                 └─ AI Explanation
                 └─ AI Expected Questions
                 └─ Notes
                 └─ Status
```

**Worked example** — Preparation: _Full Stack Developer Interview_

- Frontend → React, Next.js, TypeScript
- Backend → Node.js, REST APIs, Authentication
- Database → PostgreSQL, MongoDB, Database Design

## Product scope (MVP)

| Area                 | Included                                                                                           |
| -------------------- | -------------------------------------------------------------------------------------------------- |
| Preparation          | Create/edit/delete · types · target date · priority · status · archive · duplicate                 |
| Topics               | Single + bulk add · edit/delete · reorder · sections · priority · status · select/deselect         |
| YouTube              | Topic search · global search · selection · reject/hide · multiple videos · filters · sorting       |
| AI (supporting only) | Topic organization · short topic explanation (2–3 lines) · expected questions                      |
| Notes                | Simple topic notes                                                                                 |
| Accounts             | Guest mode · local persistence · auth · cloud persistence · cross-device · guest→account migration |
| Dashboard            | Preparation list · search · open · archive · delete · duplicate                                    |

Explicitly out of scope for now: a full resources/document library, standalone
question banks, flashcards/spaced repetition, resume/job-description parsing,
calendars/study planners, and any AI capability beyond the three above. Full
details live in the product architecture & delivery blueprint document (kept
locally, not tracked in this repository).

## Delivery phases

The build is broken into ten sequential phases, from foundations through launch:

| Phase | Focus                                                  |
| ----- | ------------------------------------------------------ |
| 0     | Foundations & Technical Setup                          |
| 1     | Preparation & Topic Core (CRUD)                        |
| 2     | Topic Organization (sections, ordering, AI first pass) |
| 3     | YouTube Integration (search & selection)               |
| 4     | Search Filters & Sorting                               |
| 5     | AI Features (explanation, expected questions)          |
| 6     | Topic Workspace & Notes                                |
| 7     | Authentication & Cloud Sync                            |
| 8     | Dashboard                                              |
| 9     | QA, Hardening & Launch                                 |

This repository currently completes **Phase 0** (foundations, design
tokens/components, CI) and **Phase 1** (guest-mode Preparation & Topic CRUD,
backed by local storage). Phase 2 onward — sections, drag-and-drop ordering,
YouTube search, and AI features — is not yet implemented.

## Tech stack

- **Next.js 15** (App Router) + **TypeScript**
- **Supabase** — SSR-safe clients, auth middleware, session helpers
- **Tailwind CSS** for styling
- **Redux Toolkit** for state management
- **ESLint + Prettier + Jest** for linting, formatting, and testing

## Directory structure

```
src/
├── app/
│   ├── preparations/
│   │   ├── page.tsx               # Preparation dashboard (list, search, CRUD)
│   │   └── [id]/page.tsx          # Topic workspace for a single Preparation
│   ├── error.tsx
│   ├── layout.tsx
│   ├── not-found.tsx
│   └── page.tsx                   # Landing page
├── assets/
│   └── css/
│       └── globals.css            # Design tokens (CSS variables)
├── components/
│   ├── ui/                        # Design system: Button, Input, Modal, Badge, etc.
│   ├── preparations/               # Preparation dashboard, card, form, workspace
│   ├── topics/                     # Topic list/row, single + bulk add
│   └── guards/
│       └── AuthGate.tsx            # Client-side auth gate (optional)
├── lib/
│   ├── auth/
│   │   ├── index.ts                # getCurrentUser / requireAuth
│   │   └── signout.ts              # clientSignout
│   ├── storage/
│   │   └── localStorageRepo.ts     # Guest-mode persistence
│   ├── topics/
│   │   └── parseBulkTopics.ts      # Bulk-paste parsing, dedupe, cap
│   ├── supabase/
│   │   ├── client.ts                # Browser client
│   │   ├── server.ts                # Server client (SSR cookies)
│   │   └── middleware.ts            # Routing + session refresh
│   └── id.ts                       # Guest-mode id generation
├── types/
│   └── preparation.ts              # Preparation / Section / Topic data model
├── middleware.ts                   # App middleware -> uses supabase/middleware
├── store/                          # Redux Toolkit store, slices, and providers
└── utils/                          # Utilities (e.g., axios config)
```

The product architecture & delivery blueprint document is kept locally in `doc/`
and is gitignored — it isn't tracked in this repository.

## Environment variables

Copy `.env.example` to `.env.local` and fill in the Supabase values (required
for Phase 7 authentication; not needed for the current guest-mode features):

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

The YouTube and AI provider keys in `.env.example` are placeholders for Phases
2/3/5 and aren't required yet.

## Getting started

```bash
npm install
npm run dev
# visit http://localhost:3000
```

## Scripts

- `npm run dev` – Start development server
- `npm run build` – Build for production
- `npm run start` – Start production server
- `npm run lint` – Lint with ESLint
- `npm run format` – Format with Prettier

## Author

**Abrar Ahmed** ([@AbrarAhmed111](https://github.com/AbrarAhmed111))

## License

[MIT](LICENSE)

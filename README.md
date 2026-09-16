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

### ✅ Fully Implemented Features

- ✅ **Organizes topics** into clear structure (Preparations → Sections →
  Topics)
- ✅ **YouTube Integration** - Search and discover videos per topic or globally
- ✅ **Video Management** - Select, reject, filter by duration/views, sort by
  relevance/newest
- ✅ **AI Explanations** - Get 2–3 line summaries via Claude, GPT, or Gemini
- ✅ **Practice Questions** - AI-generated expected interview/exam questions
- ✅ **Topic Organization** - AI-suggested optimal learning order with
  explanation
- ✅ **Personal Notes** - Lightweight notes per topic
- ✅ **Status Tracking** - Track progress (need to study, understood, completed,
  skipping)
- ✅ **Guest Mode** - Full product with no account required; data persists
  locally
- 🚧 **PDF Topic Upload** - Frontend upload UI is wired up; extraction runs via
  a backend endpoint that isn't implemented yet (planned as a Python service)

### Philosophy

ToPrep is intentionally **not** an AI-first app, AI tutor, agent, or RAG-powered
search engine. AI is a scoped, supporting feature limited to three key
capabilities: topic ordering, short explanations, and expected questions.

### Backend Integration

All AI operations (explanations, questions, topic ordering) are powered by the
**toprep-llm-youtube** backend service with automatic provider failover (Claude
→ GPT → Gemini).

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

| Area                 | Included                                                                                     |
| -------------------- | -------------------------------------------------------------------------------------------- |
| Preparation          | Create/edit/delete · types · target date · priority · status · archive · duplicate           |
| Topics               | Single + bulk add · edit/delete · reorder · sections · priority · status · select/deselect   |
| YouTube              | Topic search · global search · selection · reject/hide · multiple videos · filters · sorting |
| AI (supporting only) | Topic organization · short topic explanation (2–3 lines) · expected questions                |
| Notes                | Simple topic notes                                                                           |
| Accounts             | Guest mode · local persistence only — no auth/cloud sync in this build                       |
| Dashboard            | Preparation list · search · open · archive · delete · duplicate                              |

Explicitly out of scope for now: authentication, cloud sync/cross-device
accounts, a full resources/document library, standalone question banks,
flashcards/spaced repetition, resume/job-description parsing, calendars/study
planners, and any AI capability beyond the three above. Full details live in the
product architecture & delivery blueprint document (kept locally, not tracked in
this repository).

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

This repository currently completes **Phase 0** through **Phase 6**:

- **Phase 0** - Foundations, design tokens/components, CI
- **Phase 1** - Guest-mode Preparation & Topic CRUD (local storage)
- **Phase 2** - Topic organization with sections and AI-suggested ordering
- **Phase 3** - YouTube integration (search, filtering, sorting, selection)
- **Phase 4** - Advanced search filters and sorting options
- **Phase 5** - AI features (topic explanations via Claude/GPT/Gemini, expected
  questions)
- **Phase 6** - Topic workspace with notes and AI-powered assistance

This build intentionally stops here — guest mode only, no accounts. Phases 7+
(Authentication, Cloud Sync, Dashboard refinements) are not part of this
codebase; the previously-scaffolded Supabase/auth infrastructure has been
removed rather than left half-built.

## Tech stack

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS** for styling with CSS variables and a semantic token system
- **React** hooks and state management
- **ESLint + Prettier + Jest** for linting, formatting, and testing
- **AI Providers** - Claude (Anthropic), GPT (OpenAI), Gemini (Google) via
  backend gateway
- **YouTube Integration** - Dynamic video search and content discovery
- **Lucide React** - Modern icon library

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
│   ├── ui/                        # Design system: Button, Input, Modal, Badge, Card, etc.
│   ├── layout/                    # App header, footer
│   ├── landing/                    # Preparation composer, example preparations
│   ├── preparations/               # Preparation dashboard, card, form, workspace
│   ├── sections/                   # Section management, organization
│   ├── topics/                     # Topic list, container, AI buttons, PDF upload
│   └── youtube/                    # YouTube in-topic search & player
├── lib/
│   ├── storage/
│   │   └── localStorageRepo.ts     # Guest-mode persistence
│   ├── topics/
│   │   └── parseBulkTopics.ts      # Bulk-paste parsing, dedupe, cap
│   ├── preparations/
│   │   └── createPreparation.ts    # Builds a Preparation + Topics from raw input
│   ├── api/
│   │   └── pdfExtraction.ts        # Client for the (not-yet-built) PDF extraction endpoint
│   └── id.ts                       # Guest-mode id generation
├── types/
│   └── preparation.ts              # Preparation / Section / Topic data model
├── store/                          # Redux Toolkit store, slices, and providers
└── utils/                          # Utilities (e.g., axios config)
```

The product architecture & delivery blueprint document is kept locally in `doc/`
and is gitignored — it isn't tracked in this repository.

## Environment variables

Copy `.env.example` to `.env.local` and configure:

### Backend API (Required for AI features)

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

### YouTube (Required for video search)

```env
NEXT_PUBLIC_YOUTUBE_API_KEY=your_youtube_data_api_key
```

Note: The backend service (toprep-llm-youtube) handles all LLM API keys (Claude,
GPT, Gemini) via its own `.env` configuration. The frontend communicates with
the backend gateway.

## Getting started

### Prerequisites

- **Backend Service**: The AI features require the **toprep-llm-youtube**
  backend running
  - Clone/navigate to `toprep-llm-youtube/`
  - Follow its README to start the backend on `http://localhost:8000`
  - Configure API keys for your chosen LLM providers (Claude, GPT, Gemini)

### Frontend Setup

```bash
npm install
npm run dev
# visit http://localhost:3000
```

**Note**: Video search and AI features work best when the backend service is
running. Guest mode (local storage) works without the backend.

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

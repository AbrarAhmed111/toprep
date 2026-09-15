# ToPrep

**Less searching. More prepping.**

ToPrep is a preparation workspace that turns a list of topics into an organized learning and preparation experience. Instead of manually hunting for resources on every topic, you create a **Preparation** (an interview, exam, or certification goal), add your **Topics**, and ToPrep helps you work through the material efficiently — finding relevant YouTube videos, suggesting a sensible learning order, and generating short AI explanations and expected questions along the way.

> Core philosophy: **you bring the topics, ToPrep helps you prepare.**

## What ToPrep does

- Organizes topics into a clear, navigable structure (Preparations → Sections → Topics)
- Finds relevant YouTube videos for each topic, individually or across many topics at once
- Lets you select, reject, and filter/sort videos per topic
- Generates a short (2–3 line) AI explanation for each topic
- Generates a small set of AI expected questions per topic
- Suggests an effective learning order across topics — you review and explicitly accept it
- Supports lightweight personal notes per topic
- Tracks what's been studied and what remains
- Works fully as a guest (local storage) with optional accounts for cloud sync across devices

ToPrep is intentionally **not** an AI-first app, AI tutor, agent, or RAG-powered search engine. AI is a scoped, supporting feature limited to three capabilities: topic ordering, short explanations, and expected questions.

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

**Worked example** — Preparation: *Full Stack Developer Interview*
- Frontend → React, Next.js, TypeScript
- Backend → Node.js, REST APIs, Authentication
- Database → PostgreSQL, MongoDB, Database Design

## Product scope (MVP)

| Area | Included |
|---|---|
| Preparation | Create/edit/delete · types · target date · priority · status · archive · duplicate |
| Topics | Single + bulk add · edit/delete · reorder · sections · priority · status · select/deselect |
| YouTube | Topic search · global search · selection · reject/hide · multiple videos · filters · sorting |
| AI (supporting only) | Topic organization · short topic explanation (2–3 lines) · expected questions |
| Notes | Simple topic notes |
| Accounts | Guest mode · local persistence · auth · cloud persistence · cross-device · guest→account migration |
| Dashboard | Preparation list · search · open · archive · delete · duplicate |

Explicitly out of scope for now: a full resources/document library, standalone question banks, flashcards/spaced repetition, resume/job-description parsing, calendars/study planners, and any AI capability beyond the three above. Full details live in [`doc/ToPrep - Less searching. More prepping..docx`](doc/ToPrep%20-%20Less%20searching.%20More%20prepping..docx), the product architecture & delivery blueprint.

## Delivery phases

The build is broken into ten sequential phases, from foundations through launch:

| Phase | Focus |
|---|---|
| 0 | Foundations & Technical Setup |
| 1 | Preparation & Topic Core (CRUD) |
| 2 | Topic Organization (sections, ordering, AI first pass) |
| 3 | YouTube Integration (search & selection) |
| 4 | Search Filters & Sorting |
| 5 | AI Features (explanation, expected questions) |
| 6 | Topic Workspace & Notes |
| 7 | Authentication & Cloud Sync |
| 8 | Dashboard |
| 9 | QA, Hardening & Launch |

This repository currently reflects **Phase 0**: the base application scaffold (Next.js, TypeScript, Tailwind, Redux Toolkit, Supabase integration) is in place, ready for Preparation/Topic core features to be built on top of it.

## Tech stack

- **Next.js 15** (App Router) + **TypeScript**
- **Supabase** — SSR-safe clients, auth middleware, session helpers
- **Tailwind CSS** for styling
- **Redux Toolkit** for state management
- **ESLint + Prettier + Jest** for linting, formatting, and testing

## Directory structure

```
src/
├── app/                          # Next.js App Router
│   ├── error.tsx
│   ├── layout.tsx
│   ├── not-found.tsx
│   └── page.tsx
├── assets/
│   └── css/
│       └── globals.css
├── components/
│   └── guards/
│       └── AuthGate.tsx          # Client-side auth gate (optional)
├── lib/
│   ├── auth/
│   │   ├── index.ts              # getCurrentUser / requireAuth
│   │   └── signout.ts            # clientSignout
│   └── supabase/
│       ├── client.ts             # Browser client
│       ├── server.ts             # Server client (SSR cookies)
│       └── middleware.ts         # Routing + session refresh
├── middleware.ts                 # App middleware -> uses supabase/middleware
├── store/                        # Redux Toolkit store and providers
└── utils/                        # Utilities (e.g., axios config)

doc/
└── ToPrep - Less searching. More prepping..docx   # Full product & architecture blueprint
```

## Environment variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

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

MIT

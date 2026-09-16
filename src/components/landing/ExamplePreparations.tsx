'use client'

import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { useAppDispatch } from '@/store/hooks'
import { preparationAdded } from '@/store/preparations/preparationsSlice'
import { topicsAddedMany } from '@/store/topics/topicsSlice'
import { buildPreparation } from '@/lib/preparations/createPreparation'

interface ExamplePreparation {
  title: string
  topics: string[]
}

const EXAMPLES: ExamplePreparation[] = [
  {
    title: 'Full Stack Developer Interview',
    topics: [
      'JavaScript Fundamentals',
      'React',
      'Node.js & Express',
      'REST API Design',
      'SQL & Database Design',
      'System Design Basics',
      'Git & Version Control',
      'Behavioral Interview Questions',
    ],
  },
  {
    title: 'React Interview',
    topics: [
      'JSX & Components',
      'Hooks (useState, useEffect)',
      'State Management',
      'Component Lifecycle',
      'Performance Optimization',
      'Testing React Apps',
      'React Router',
      'Context API',
    ],
  },
  {
    title: 'JavaScript Fundamentals',
    topics: [
      'Variables & Scope',
      'Closures',
      'Prototypes & Inheritance',
      'Async/Await & Promises',
      'Event Loop',
      'Array & Object Methods',
      'ES6+ Features',
      'Error Handling',
    ],
  },
  {
    title: 'System Design Preparation',
    topics: [
      'Scalability Basics',
      'Load Balancing',
      'Caching Strategies',
      'Database Sharding',
      'CAP Theorem',
      'Message Queues',
      'Microservices vs Monolith',
      'Designing a URL Shortener',
    ],
  },
  {
    title: 'Python Backend Interview',
    topics: [
      'Python Fundamentals',
      'Django/Flask Basics',
      'REST API Design',
      'ORM & Database Queries',
      'Async Python',
      'Testing with Pytest',
      'Authentication & Security',
      'Deployment Basics',
    ],
  },
]

export function ExamplePreparations() {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const createExample = (example: ExamplePreparation) => {
    const { preparation, topics } = buildPreparation(
      example.title,
      'Interview',
      example.topics,
    )
    dispatch(preparationAdded(preparation))
    dispatch(topicsAddedMany(topics))
    toast.success(`Created "${example.title}"`)
    router.push(`/preparations/${preparation.id}`)
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted">
        Example Preparations
      </span>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {EXAMPLES.map(example => (
          <button
            key={example.title}
            type="button"
            onClick={() => createExample(example)}
            className="rounded-lg border border-border bg-surface px-3.5 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            {example.title}
          </button>
        ))}
      </div>
    </div>
  )
}

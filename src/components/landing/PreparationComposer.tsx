'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { ArrowRight } from 'lucide-react'
import { useAppDispatch } from '@/store/hooks'
import { preparationAdded } from '@/store/preparations/preparationsSlice'
import { topicsAddedMany } from '@/store/topics/topicsSlice'
import { buildPreparation } from '@/lib/preparations/createPreparation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { TopicTagInput } from './TopicTagInput'

export function PreparationComposer() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [topics, setTopics] = useState<string[]>([])
  const [titleError, setTitleError] = useState<string | null>(null)

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const trimmedTitle = title.trim()
    if (!trimmedTitle) {
      setTitleError('Tell us what you’re preparing for')
      return
    }

    const { preparation, topics: builtTopics } = buildPreparation(
      trimmedTitle,
      'Custom',
      topics,
    )
    dispatch(preparationAdded(preparation))
    if (builtTopics.length) dispatch(topicsAddedMany(builtTopics))
    toast.success('Preparation created')
    router.push(`/preparations/${preparation.id}`)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-2xl flex-col gap-5 rounded-2xl border border-border/60 bg-surface/95 p-6 text-left shadow-lg backdrop-blur-sm sm:p-8"
    >
      <Input
        label="What are you preparing for?"
        placeholder="Full Stack Developer Interview"
        value={title}
        error={titleError ?? undefined}
        onChange={event => {
          setTitle(event.target.value)
          if (titleError) setTitleError(null)
        }}
        autoFocus
      />
      <TopicTagInput
        label="What do you need to learn?"
        placeholder="Type a topic and press Enter…"
        value={topics}
        onChange={setTopics}
        hint="Press Enter after each topic — paste a list to add several at once."
      />
      <Button type="submit" className="w-full justify-center py-3 text-base">
        Start Preparing
        <ArrowRight size={16} />
      </Button>
    </form>
  )
}

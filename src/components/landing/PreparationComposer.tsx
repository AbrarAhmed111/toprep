'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { ArrowRight } from 'lucide-react'
import { useAppDispatch } from '@/store/hooks'
import { preparationAdded } from '@/store/preparations/preparationsSlice'
import { topicsAddedMany } from '@/store/topics/topicsSlice'
import { parseBulkTopics } from '@/lib/topics/parseBulkTopics'
import { buildPreparation } from '@/lib/preparations/createPreparation'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'

export function PreparationComposer() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [topicsText, setTopicsText] = useState('')
  const [titleError, setTitleError] = useState<string | null>(null)

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const trimmedTitle = title.trim()
    if (!trimmedTitle) {
      setTitleError('Tell us what you’re preparing for')
      return
    }

    const { names } = parseBulkTopics(topicsText)
    const { preparation, topics } = buildPreparation(
      trimmedTitle,
      'Custom',
      names,
    )
    dispatch(preparationAdded(preparation))
    if (topics.length) dispatch(topicsAddedMany(topics))
    toast.success('Preparation created')
    router.push(`/preparations/${preparation.id}`)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-xl flex-col gap-5 rounded-xl border border-border bg-surface p-6 text-left shadow-sm sm:p-8"
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
      <Textarea
        label="What do you need to learn?"
        placeholder={'React\nSystem Design\nBehavioral Interview Questions'}
        rows={5}
        value={topicsText}
        onChange={event => setTopicsText(event.target.value)}
        hint="One topic per line. You can add or edit these anytime."
      />
      <Button type="submit" className="w-full justify-center py-3 text-base">
        Start Preparing
        <ArrowRight size={16} />
      </Button>
    </form>
  )
}

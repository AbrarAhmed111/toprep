'use client'

import { FormEvent, useState } from 'react'
import { FolderPlus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface AddSectionFormProps {
  onAdd: (name: string) => void
}

export function AddSectionForm({ onAdd }: AddSectionFormProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')

  const close = () => {
    setOpen(false)
    setName('')
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    onAdd(trimmed)
    close()
  }

  if (!open) {
    return (
      <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
        <FolderPlus size={15} />
        Add Section
      </Button>
    )
  }

  return (
    <form onSubmit={submit} className="flex items-end gap-2">
      <div className="flex-1">
        <Input
          autoFocus
          aria-label="Section name"
          placeholder="e.g. Frontend"
          value={name}
          onChange={event => setName(event.target.value)}
          onKeyDown={event => {
            if (event.key === 'Escape') close()
          }}
        />
      </div>
      <Button type="submit">Add</Button>
      <Button type="button" variant="secondary" onClick={close}>
        Cancel
      </Button>
    </form>
  )
}

'use client'

import { FormEvent, useEffect, useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import {
  PREPARATION_TYPES,
  Preparation,
  PreparationType,
} from '@/types/preparation'

export interface PreparationFormValues {
  title: string
  description: string
  type: PreparationType
  targetDate: string
}

interface PreparationFormModalProps {
  open: boolean
  preparation?: Preparation | null
  onClose: () => void
  onSubmit: (values: PreparationFormValues) => void
}

const emptyValues: PreparationFormValues = {
  title: '',
  description: '',
  type: 'Interview',
  targetDate: '',
}

export function PreparationFormModal({
  open,
  preparation,
  onClose,
  onSubmit,
}: PreparationFormModalProps) {
  const [values, setValues] = useState<PreparationFormValues>(emptyValues)
  const [titleError, setTitleError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setValues(
      preparation
        ? {
            title: preparation.title,
            description: preparation.description,
            type: preparation.type,
            targetDate: preparation.targetDate ?? '',
          }
        : emptyValues,
    )
    setTitleError(null)
  }, [open, preparation])

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!values.title.trim()) {
      setTitleError('Title is required')
      return
    }
    onSubmit({ ...values, title: values.title.trim() })
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={preparation ? 'Edit Preparation' : 'New Preparation'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="preparation-form">
            {preparation ? 'Save Changes' : 'Create Preparation'}
          </Button>
        </>
      }
    >
      <form
        id="preparation-form"
        className="flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <Input
          name="title"
          label="Title"
          placeholder="e.g. Full Stack Developer Interview"
          value={values.title}
          error={titleError ?? undefined}
          onChange={event => {
            setValues(v => ({ ...v, title: event.target.value }))
            if (titleError) setTitleError(null)
          }}
          autoFocus
        />
        <Textarea
          name="description"
          label="Description"
          placeholder="Optional context for this preparation"
          rows={3}
          value={values.description}
          onChange={event =>
            setValues(v => ({ ...v, description: event.target.value }))
          }
        />
        <div className="grid grid-cols-2 gap-4">
          <Select
            name="type"
            label="Type"
            value={values.type}
            onChange={event =>
              setValues(v => ({
                ...v,
                type: event.target.value as PreparationType,
              }))
            }
          >
            {PREPARATION_TYPES.map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Select>
          <Input
            type="date"
            name="targetDate"
            label="Target Date"
            value={values.targetDate}
            onChange={event =>
              setValues(v => ({ ...v, targetDate: event.target.value }))
            }
          />
        </div>
      </form>
    </Modal>
  )
}

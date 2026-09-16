'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'

interface DeleteSectionDialogProps {
  open: boolean
  sectionName: string
  topicCount: number
  onCancel: () => void
  onConfirm: (deleteTopics: boolean) => void
}

export function DeleteSectionDialog({
  open,
  sectionName,
  topicCount,
  onCancel,
  onConfirm,
}: DeleteSectionDialogProps) {
  const [deleteTopics, setDeleteTopics] = useState(false)

  const handleClose = () => {
    setDeleteTopics(false)
    onCancel()
  }

  const handleConfirm = () => {
    onConfirm(deleteTopics)
    setDeleteTopics(false)
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={`Delete "${sectionName}"`}
      footer={
        <>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirm}>
            Delete Section
          </Button>
        </>
      }
    >
      {topicCount === 0 ? (
        <p className="text-sm text-muted">
          This section has no topics. It will be deleted permanently.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-muted">
            {topicCount} {topicCount === 1 ? 'topic is' : 'topics are'} in this
            section. What should happen to {topicCount === 1 ? 'it' : 'them'}?
          </p>
          <label className="flex items-start gap-2 rounded-xl border border-border p-3 text-sm">
            <input
              type="radio"
              name="delete-section-topics"
              checked={!deleteTopics}
              onChange={() => setDeleteTopics(false)}
              className="mt-0.5 accent-primary"
            />
            <span>
              <span className="font-medium text-foreground">
                Move to Unsectioned
              </span>
              <br />
              <span className="text-muted">
                Keep the topics — just remove the grouping.
              </span>
            </span>
          </label>
          <label className="flex items-start gap-2 rounded-xl border border-border p-3 text-sm">
            <input
              type="radio"
              name="delete-section-topics"
              checked={deleteTopics}
              onChange={() => setDeleteTopics(true)}
              className="mt-0.5 accent-danger"
            />
            <span>
              <span className="font-medium text-danger">
                Delete the topics too
              </span>
              <br />
              <span className="text-muted">This can&apos;t be undone.</span>
            </span>
          </label>
        </div>
      )}
    </Modal>
  )
}

'use client'

import { TextareaHTMLAttributes, forwardRef } from 'react'
import clsx from 'clsx'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, id, className, ...props }, ref) => {
    const textareaId = id ?? props.name
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium text-foreground"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={clsx(
            'rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground placeholder:text-muted transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand backdrop-blur-sm',
            error && 'border-danger focus:border-danger focus:ring-danger',
            className,
          )}
          {...props}
        />
        {hint && !error && <p className="text-xs text-muted">{hint}</p>}
        {error && <p className="text-xs text-danger">{error}</p>}
      </div>
    )
  },
)

Textarea.displayName = 'Textarea'

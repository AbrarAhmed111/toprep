'use client'

import { SelectHTMLAttributes, forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'
import clsx from 'clsx'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, id, className, children, ...props }, ref) => {
    const selectId = id ?? props.name
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-medium text-foreground"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={clsx(
              'w-full appearance-none rounded-lg border border-border bg-surface px-3 py-2 pr-9 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary',
              className,
            )}
            {...props}
          >
            {children}
          </select>
          <ChevronDown
            size={15}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted"
          />
        </div>
      </div>
    )
  },
)

Select.displayName = 'Select'

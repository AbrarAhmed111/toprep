'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'
import clsx from 'clsx'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-primary-foreground shadow-sm hover:bg-primary-hover hover:shadow-md',
  secondary:
    'bg-surface text-foreground border border-border hover:bg-surface-hover',
  ghost: 'bg-transparent text-foreground hover:bg-surface-hover',
  danger:
    'bg-danger text-danger-foreground shadow-sm hover:brightness-95 hover:shadow-md',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'text-sm px-3 py-1.5',
  md: 'text-sm px-4 py-2',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, ...props }, ref) => (
    <button
      ref={ref}
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-150 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  ),
)

Button.displayName = 'Button'

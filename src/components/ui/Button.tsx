import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { SpinnerIcon } from './icons'

export type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'whatsapp'
export type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  ariaLabel?: string
  disabled?: boolean
  /**
   * Shows a spinner in place of the label and blocks further clicks —
   * use while an action (add to cart, …) is in flight so every click
   * gives immediate visual feedback, even on slow connections.
   */
  loading?: boolean
  /** Internal route, e.g. "/shop" — renders a Router <Link>. */
  to?: string
  /** External URL — renders an <a>. */
  href?: string
  target?: '_blank' | '_self'
  rel?: string
  onClick?: () => void
  type?: 'button' | 'submit'
}

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'bg-burgundy-700 text-bone-50 hover:bg-burgundy-800 active:bg-burgundy-900 active:scale-[0.97] shadow-card hover:shadow-lift cursor-pointer',
  outline:
    'border border-burgundy-600 text-burgundy-700 hover:bg-burgundy-600 hover:text-bone-50 active:bg-burgundy-700 active:scale-[0.97] cursor-pointer',
  ghost:
    'border border-line text-ink bg-bone-50 hover:border-burgundy-500 hover:text-burgundy-700 active:bg-bone-200 active:scale-[0.97] cursor-pointer',
  whatsapp:
    'bg-whatsapp text-white hover:bg-[#0E6E5F] active:bg-[#0B5A4E] active:scale-[0.97] shadow-card hover:shadow-lift cursor-pointer'
}

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-[12px]',
  md: 'h-11 px-6 text-[13px]',
  lg: 'h-12 px-8 text-sm'
}

const BASE =
  'inline-flex items-center justify-center gap-2 select-none whitespace-nowrap font-sans font-semibold uppercase tracking-[0.08em] transition-[background-color,border-color,color,transform,box-shadow,opacity] duration-200 ease-out rounded-[2px]'

function classes(variant: ButtonVariant, size: ButtonSize, className?: string, disabled?: boolean, loading?: boolean): string {
  const state = disabled || loading ? ' opacity-60 pointer-events-none' : ''
  return `${BASE} ${VARIANTS[variant]} ${SIZES[size]}${state} ${className ?? ''}`.trim()
}

/**
 * A single button component used site-wide. Pass `to` for an internal route,
 * `href` for an external link, or `onClick` for a plain button action.
 * Every variant has hover, active (press) and focus feedback; `loading`
 * swaps the label for a spinner while an action is running.
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  ariaLabel,
  disabled = false,
  loading = false,
  to,
  href,
  target,
  rel,
  onClick,
  type = 'button'
}: ButtonProps) {
  const cls = classes(variant, size, className, disabled, loading)
  const busy = loading || undefined
  const content = loading ? <SpinnerIcon size={size === 'sm' ? 14 : 16} /> : children

  if (to) {
    return (
      <Link
        to={to}
        className={cls}
        aria-label={ariaLabel}
        onClick={onClick}
        aria-disabled={disabled || loading}
        aria-busy={busy}
      >
        {content}
      </Link>
    )
  }

  if (href) {
    return (
      <a
        href={href}
        className={cls}
        aria-label={ariaLabel}
        target={target}
        rel={rel}
        onClick={onClick}
        aria-disabled={disabled || loading}
        aria-busy={busy}
      >
        {content}
      </a>
    )
  }

  return (
    <button type={type} className={cls} aria-label={ariaLabel} disabled={disabled || loading} aria-busy={busy} onClick={onClick}>
      {content}
    </button>
  )
}
import type { ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  className?: string
  /** Kept for compatibility with existing call sites — no longer used. */
  delay?: number
}

/**
 * Plain wrapper kept for layout compatibility.
 *
 * The scroll-reveal (fade-in on scroll) animation has been REMOVED —
 * all content is visible immediately, no observer, no transition.
 */
export default function Reveal({ children, className = '' }: RevealProps) {
  return <div className={className.trim()}>{children}</div>
}
import type { ReactNode } from 'react'

interface SectionHeadingProps {
  kicker: string
  title: ReactNode
  lead?: string
  align?: 'left' | 'center'
}

/** Editorial section heading: small uppercase kicker + serif title + optional lead. */
export default function SectionHeading({
  kicker,
  title,
  lead,
  align = 'center'
}: SectionHeadingProps) {
  const alignClasses = align === 'center' ? 'text-center mx-auto' : 'text-left'
  return (
    <div className={`${alignClasses} max-w-2xl`}>
      <p className="text-[11px] font-sans tracking-[0.22em] uppercase text-burgundy-500">{kicker}</p>
      <h2 className="mt-4 font-display text-3xl sm:text-4xl font-bold text-ink leading-tight">
        {title}
      </h2>
      {lead ? <p className="mt-4 text-base text-muted leading-relaxed max-w-xl">{lead}</p> : null}
    </div>
  )
}
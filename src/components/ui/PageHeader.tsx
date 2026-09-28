interface PageHeaderProps {
  /** Optional small label above the title. */
  kicker?: string
  title: string
  lead?: string
  align?: 'left' | 'center'
}

/** Elegant header used at the top of interior pages. */
export default function PageHeader({ kicker, title, lead, align = 'center' }: PageHeaderProps) {
  const alignment = align === 'center' ? 'text-center' : 'text-left'
  return (
    <section className={`border-b border-line bg-bone-50 py-16 sm:py-20 ${alignment}`}>
      <div className={`mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 ${alignment === 'text-center' ? '' : 'max-w-3xl'}`}>
        {kicker ? (
          <p className="text-[11px] font-sans uppercase tracking-[0.26em] text-burgundy-600">{kicker}</p>
        ) : null}
        <h1 className={`font-display text-4xl font-bold leading-tight text-ink sm:text-5xl ${kicker ? 'mt-5' : ''}`}>
          {title}
        </h1>
        {lead ? (
          <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">{lead}</p>
        ) : null}
      </div>
    </section>
  )
}
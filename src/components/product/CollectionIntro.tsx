import type { CollectionIntro as CollectionIntroContent } from '../../types'

interface CollectionIntroProps {
  intro: CollectionIntroContent
  className?: string
}

/**
 * Editable write-up shown above a collection's products on the Shop page —
 * an optional brand name, one or more paragraphs, and a "Please note" callout
 * (the label is always rendered bold).
 */
export default function CollectionIntro({ intro, className = '' }: CollectionIntroProps) {
  return (
    <div className={`max-w-3xl ${className}`.trim()}>
      {intro.brand ? (
        <p className="font-display text-xl font-bold text-burgundy-700 sm:text-2xl">{intro.brand}</p>
      ) : null}

      <div className={`space-y-3 ${intro.brand ? 'mt-4' : ''}`.trim()}>
        {intro.paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 40)} className="text-sm leading-relaxed text-muted sm:text-[15px]">
            {paragraph}
          </p>
        ))}
      </div>

      {intro.note ? (
        <p className="mt-5 rounded-[6px] border-l-2 border-burgundy-300 bg-bone-200 px-5 py-4 text-sm leading-relaxed text-muted sm:text-[15px]">
          <strong className="font-bold text-ink">{intro.note.label}</strong> {intro.note.text}
        </p>
      ) : null}
    </div>
  )
}

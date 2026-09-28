import type { FaqItem } from '../../types'
import { ChevronIcon } from '../ui/icons'

interface FAQItemProps {
  item: FaqItem
  isOpen: boolean
  onToggle: (id: string) => void
}

/**
 * Accessible accordion row — animates smoothly via the .faq-panel grid-rows
 * technique. IMPORTANT: all padding around the answer sits INSIDE the
 * collapsing body (never on it), so the closed state collapses to truly 0
 * height and no answer text can ever peek out.
 */
export default function FAQItem({ item, isOpen, onToggle }: FAQItemProps) {
  const buttonId = `faq-${item.id}-button`
  const panelId = `faq-${item.id}-panel`

  return (
    <div
      className={`rounded-[8px] border bg-bone-50 transition-colors ${
        isOpen ? 'border-burgundy-200 shadow-card' : 'border-line'
      }`}
    >
      <h3>
        <button
          type="button"
          id={buttonId}
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => onToggle(item.id)}
          className="flex w-full items-center justify-between gap-4 rounded-[8px] px-5 py-4.5 text-left font-sans text-[15px] font-semibold text-ink transition-colors hover:text-burgundy-700 sm:px-6 sm:py-5 sm:text-base"
        >
          {item.question}
          <span
            aria-hidden="true"
            className={`grid size-7 shrink-0 place-items-center rounded-full border transition-all duration-200 ${
              isOpen
                ? 'rotate-180 border-burgundy-700 bg-burgundy-700 text-bone-100'
                : 'border-line text-muted'
            }`}
          >
            <ChevronIcon size={14} />
          </span>
        </button>
      </h3>
      <div id={panelId} role="region" aria-labelledby={buttonId} className={`faq-panel ${isOpen ? 'is-open' : ''}`}>
        {/* Collapsing body — keep it padding-free; spacing lives one level deeper. */}
        <div className="faq-panel__body">
          <div className="px-5 pb-5 sm:px-6 sm:pb-6">
            <p className="max-w-prose border-l-2 border-burgundy-100 pl-4 text-[15px] leading-relaxed text-ink/85">
              {item.answer}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
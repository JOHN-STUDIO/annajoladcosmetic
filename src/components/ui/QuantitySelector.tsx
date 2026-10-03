import { MinusIcon, PlusIcon } from './icons'

interface QuantitySelectorProps {
  value: number
  onChange: (quantity: number) => void
  min?: number
  max?: number
  label?: string
}

/** Accessible − / + quantity stepper with a live region for the value. */
export default function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  label = 'Quantity'
}: QuantitySelectorProps) {
  const decrement = () => onChange(Math.max(min, value - 1))
  const increment = () => onChange(Math.min(max, value + 1))

  return (
    <span className="inline-flex items-center gap-1" role="group" aria-label={label}>
      <button
        type="button"
        className="grid size-10 place-items-center rounded-[2px] border border-line bg-bone-50 text-ink transition-all duration-200 hover:border-burgundy-500 hover:text-burgundy-700 hover:shadow-card active:scale-90 active:bg-bone-200 disabled:opacity-40 disabled:hover:shadow-none"
        aria-label="Decrease quantity"
        onClick={decrement}
        disabled={value <= min}
      >
        <MinusIcon size={16} />
      </button>
      <span className="min-w-12 py-2 text-center font-sans text-sm font-bold tabular-nums" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className="grid size-10 place-items-center rounded-[2px] border border-line bg-bone-50 text-ink transition-all duration-200 hover:border-burgundy-500 hover:text-burgundy-700 hover:shadow-card active:scale-90 active:bg-bone-200 disabled:opacity-40 disabled:hover:shadow-none"
        aria-label="Increase quantity"
        onClick={increment}
        disabled={value >= max}
      >
        <PlusIcon size={16} />
      </button>
    </span>
  )
}
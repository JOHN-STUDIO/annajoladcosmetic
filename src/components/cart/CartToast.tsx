import { useEffect, useState } from 'react'
import { useCart } from '../../context/CartContext'
import { getProductById } from '../../data/products'
import { formatNaira } from '../../utils/formatCurrency'
import ProductImage from '../product/ProductImage'
import Button from '../ui/Button'
import { CheckIcon, CloseIcon } from '../ui/icons'

const AUTO_DISMISS_MS = 5000
const EXIT_ANIMATION_MS = 240

/**
 * Mini cart preview shown after an item is added ("Added to cart" toast).
 *
 * Replaces the old behaviour of force-opening the full cart drawer on every
 * add: the visitor stays on the product page, sees exactly what was added
 * (thumbnail, name, running quantity, subtotal) and can open the slide-out
 * drawer themselves via "View cart". Repeat adds re-trigger the animation
 * (keyed on `lastAdded.seq`) instead of stacking notifications; the toast
 * auto-dismisses after 5s and can be closed manually.
 */
export default function CartToast() {
  const { lastAdded, dismissAdded, lines, totalItems, subtotal, openCart, isOpen } = useCart()
  // Only the seq of a DISMISSED toast is remembered — a brand-new add has a
  // higher seq, so `visible` is already true on first paint (no flash).
  const [dismissedSeq, setDismissedSeq] = useState<number | null>(null)

  // The open drawer already shows the cart — step out of its way.
  const visible = lastAdded !== null && dismissedSeq !== lastAdded.seq && !isOpen

  // Auto-dismiss after a few seconds; a new add resets the timer (seq changes).
  useEffect(() => {
    if (!visible || !lastAdded) return
    const timer = window.setTimeout(() => setDismissedSeq(lastAdded.seq), AUTO_DISMISS_MS)
    return () => window.clearTimeout(timer)
  }, [visible, lastAdded])

  // Drop the toast from the DOM once its exit animation has finished.
  useEffect(() => {
    if (visible || !lastAdded) return
    const timer = window.setTimeout(dismissAdded, EXIT_ANIMATION_MS)
    return () => window.clearTimeout(timer)
  }, [visible, lastAdded, dismissAdded])

  if (!lastAdded) return null

  const product = getProductById(lastAdded.productId)
  if (!product) return null

  // Quantity of THIS product currently in the cart (live as lines change).
  const lineQuantity = lines.find((line) => line.productId === product.id)?.quantity ?? 0

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-4 left-4 right-4 z-40 sm:left-auto sm:w-[360px] ${visible ? 'toast-in' : 'toast-out'}`}
    >
      <div className="flex gap-3.5 rounded-[8px] border border-line bg-bone-50 p-4 shadow-lift">
        <ProductImage
          src={product.image}
          alt={product.name}
          aspect="aspect-square"
          fit="contain"
          className="h-16 w-16 shrink-0 rounded-[6px]"
        />

        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-[11px] font-sans font-bold uppercase tracking-[0.16em] text-burgundy-700">
            <CheckIcon size={14} />
            Added to cart
          </p>
          <p className="mt-1 truncate font-display text-[15px] font-bold text-ink">{product.name}</p>
          <p className="mt-0.5 text-[13px] text-muted tabular-nums">
            {lineQuantity} in cart · {formatNaira(subtotal)} subtotal
          </p>

          <div className="mt-3 flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              className="flex-1 justify-center"
              onClick={() => {
                dismissAdded()
                openCart()
              }}
            >
              View cart ({totalItems})
            </Button>
            <button
              type="button"
              className="grid size-9 shrink-0 place-items-center rounded-[2px] border border-line text-muted transition-colors duration-200 hover:border-burgundy-500 hover:text-burgundy-700 active:scale-90 active:bg-bone-200"
              aria-label="Dismiss notification"
              onClick={() => setDismissedSeq(lastAdded.seq)}
            >
              <CloseIcon size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
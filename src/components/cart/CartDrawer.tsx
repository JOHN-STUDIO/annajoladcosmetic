import { useEffect } from 'react'
import { useCart } from '../../context/CartContext'
import { getProductById } from '../../data/products'
import { formatNaira } from '../../utils/formatCurrency'
import type { OrderLine } from '../../utils/whatsapp'
import CartItemRow from './CartItemRow'
import WhatsAppButton from '../whatsapp/WhatsAppButton'
import Button from '../ui/Button'
import { CartIcon, CloseIcon } from '../ui/icons'

export default function CartDrawer() {
  const { lines, totalItems, subtotal, isOpen, closeCart, clear } = useCart()

  const orderLines: OrderLine[] = lines.flatMap((line) => {
    const product = getProductById(line.productId)
    return product
      ? [{ name: product.name, quantity: line.quantity, price: product.price }]
      : []
  })

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeCart()
    }
    document.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen, closeCart])

  const empty = (
    <div className="flex flex-col items-center justify-center gap-6 px-8 py-16 text-center">
      <span className="text-burgundy-300">
        <CartIcon size={44} />
      </span>
      <h2 className="font-display text-2xl font-bold text-ink">Your cart is empty</h2>
      <p className="max-w-sm text-sm text-muted leading-relaxed">
        Add a few beauty essentials and they will show up here, ready to be ordered on WhatsApp.
      </p>
      <Button to="/shop" variant="primary" onClick={closeCart}>
        Continue Shopping
      </Button>
    </div>
  )

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-ink/40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`cart-drawer fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-bone-50 shadow-lift ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <header className="flex items-center justify-between border-b border-line px-5 py-5 sm:px-6">
          <h2 className="font-display text-xl font-bold text-ink">
            Your Cart{totalItems > 0 ? ` (${totalItems})` : ''}
          </h2>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-[2px] border border-line text-ink hover:border-burgundy-500 hover:text-burgundy-700"
            aria-label="Close cart"
            onClick={closeCart}
          >
            <CloseIcon size={18} />
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="flex-1 overflow-y-auto pb-10">{empty}</div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4 sm:px-6">
              <ul className="divide-y-0">
                {lines.flatMap((line) => {
                  const product = getProductById(line.productId)
                  return product ? [<CartItemRow key={line.productId} product={product} quantity={line.quantity} />] : []
                })}
              </ul>
              <button
                type="button"
                className="mt-6 text-[13px] font-sans font-semibold text-burgundy-700 underline-offset-2 underline decoration-burgundy-300 hover:text-burgundy-800"
                onClick={clear}
              >
                Clear cart
              </button>
            </div>

            <footer className="border-t border-line bg-bone-100 px-5 py-5 sm:px-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-sans text-muted">Subtotal</p>
                <p className="font-sans text-lg font-bold text-ink tabular-nums">
                  {formatNaira(subtotal)}
                </p>
              </div>
              <p className="mt-1 text-xs text-muted/80">
                Delivery and payment arrangements are finalised on WhatsApp.
              </p>

              <div className="mt-4 flex flex-col gap-2.5">
                <WhatsAppButton lines={orderLines} label={`Order via WhatsApp · ${formatNaira(subtotal)}`} size="lg" className="w-full" />
                <Button variant="ghost" size="sm" className="w-full" onClick={closeCart}>
                  Continue Shopping
                </Button>
              </div>
            </footer>
          </>
        )}
      </aside>
    </>
  )
}
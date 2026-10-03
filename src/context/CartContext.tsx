import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { CartLine, Product } from '../types'
import { getProductById } from '../data/products'

const STORAGE_KEY = 'ajolad-cart-v1'
const MAX_LINES = 50

export interface CartContextValue {
  lines: CartLine[]
  totalItems: number
  subtotal: number
  isOpen: boolean
  /**
   * Set by `add()` — the most recent "added to cart" event. Consumers
   * (CartToast) render it as a mini cart preview; adding again replaces it
   * (so a run of adds never stacks notifications) and retriggers the
   * animation via `seq`.
   */
  lastAdded: CartAdded | null
  add: (product: Product, quantity?: number) => void
  setQuantity: (productId: string, quantity: number) => void
  remove: (productId: string) => void
  clear: () => void
  openCart: () => void
  closeCart: () => void
  dismissAdded: () => void
}

/** A single "item added" event — seq re-animates the toast for repeat adds. */
export interface CartAdded {
  seq: number
  productId: string
  quantity: number
}

const CartContext = createContext<CartContextValue | null>(null)

function clampQuantity(quantity: number): number {
  return Math.max(1, Math.min(99, Math.round(quantity)))
}

function readStoredLines(): CartLine[] {
  // No window during static prerendering (scripts/prerender.mjs) — start empty.
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []

    const candidates = parsed as Array<{ productId?: unknown; quantity?: unknown }>
    return candidates
      .filter(
        (item) =>
          item !== null &&
          typeof item === 'object' &&
          typeof item.productId === 'string' &&
          typeof item.quantity === 'number' &&
          Number.isFinite(item.quantity) &&
          item.quantity > 0
      )
      .map((item) => ({
        productId: item.productId as string,
        quantity: clampQuantity(item.quantity as number)
      }))
      .slice(0, MAX_LINES)
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(readStoredLines)
  const [isOpen, setIsOpen] = useState(false)
  const [lastAdded, setLastAdded] = useState<CartAdded | null>(null)
  const addedSeq = useRef(0)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
    } catch {
      // Storage unavailable (private mode / quota) — cart still works in memory.
    }
  }, [lines])

  const add = useMemo(
    () =>
      (product: Product, quantity = 1): void => {
        const qty = clampQuantity(quantity)
        setLines((current) => {
          const existing = current.find((line) => line.productId === product.id)
          if (existing) {
            return current.map((line) =>
              line.productId === product.id
                ? { ...line, quantity: clampQuantity(line.quantity + qty) }
                : line
            )
          }
          return [...current, { productId: product.id, quantity: qty }].slice(0, MAX_LINES)
        })
        // Stay on the page: announce the add with a mini cart preview instead
        // of yanking the visitor to the full cart screen (it opens on request
        // via the toast's "View cart" or the navbar cart icon).
        addedSeq.current += 1
        setLastAdded({ seq: addedSeq.current, productId: product.id, quantity: qty })
      },
    []
  )

  const setQuantity = useMemo(
    () =>
      (productId: string, quantity: number): void => {
        const qty = clampQuantity(quantity)
        setLines((current) =>
          current.map((line) => (line.productId === productId ? { ...line, quantity: qty } : line))
        )
      },
    []
  )

  const remove = useMemo(
    () =>
      (productId: string): void => {
        setLines((current) => current.filter((line) => line.productId !== productId))
      },
    []
  )

  const clear = useMemo(() => (): void => setLines([]), [])
  const openCart = useMemo(() => (): void => setIsOpen(true), [])
  const closeCart = useMemo(() => (): void => setIsOpen(false), [])
  const dismissAdded = useMemo(() => (): void => setLastAdded(null), [])

  const totalItems = useMemo(() => lines.reduce((sum, line) => sum + line.quantity, 0), [lines])

  const subtotal = useMemo(
    () =>
      lines.reduce((sum, line) => {
        const product = getProductById(line.productId)
        return product ? sum + product.price * line.quantity : sum
      }, 0),
    [lines]
  )

  const value: CartContextValue = {
    lines,
    totalItems,
    subtotal,
    isOpen,
    lastAdded,
    add,
    setQuantity,
    remove,
    clear,
    openCart,
    closeCart,
    dismissAdded
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const value = useContext(CartContext)
  if (!value) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return value
}
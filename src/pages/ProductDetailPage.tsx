import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getProductById, getRelatedProducts } from '../data/products'
import { formatNaira } from '../utils/formatCurrency'
import Seo from '../components/ui/Seo'
import Button from '../components/ui/Button'
import QuantitySelector from '../components/ui/QuantitySelector'
import ProductImage from '../components/product/ProductImage'
import ProductGrid from '../components/product/ProductGrid'
import WhatsAppButton from '../components/whatsapp/WhatsAppButton'
import Reveal from '../components/ui/Reveal'
import { CartIcon, CheckIcon, SparkleIcon } from '../components/ui/icons'
import { useCart } from '../context/CartContext'

/** How long the button stays on "✓ Added" before reverting. */
const ADDED_STATE_MS = 1600

export default function ProductDetailPage() {
  const params = useParams()
  const product = params.id ? getProductById(params.id) : undefined
  const { add } = useCart()
  const [quantity, setQuantity] = useState(1)

  // Click feedback: spinner → "✓ Added" + floating "+N" over the image.
  const [phase, setPhase] = useState<'idle' | 'loading' | 'added'>('idle')
  const [pulse, setPulse] = useState(0)
  const revertTimer = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (revertTimer.current !== null) window.clearTimeout(revertTimer.current)
    },
    []
  )

  const handleAdd = () => {
    if (phase === 'loading' || !product) return
    setPhase('loading')
    add(product, quantity)
    setPulse((n) => n + 1)
    if (revertTimer.current !== null) window.clearTimeout(revertTimer.current)
    revertTimer.current = window.setTimeout(() => {
      setPhase('added')
      revertTimer.current = window.setTimeout(() => setPhase('idle'), ADDED_STATE_MS)
    }, 350)
  }

  if (!product) {
    return (
      <>
        <Seo />
        <section className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 py-24 text-center">
          <span className="text-burgundy-300">
            <SparkleIcon size={32} />
          </span>
          <h1 className="font-display text-3xl font-bold text-ink">Product not found</h1>
          <p className="max-w-md text-sm text-muted">
            The product you're looking for may have been renamed or removed. Browse the full collection to find your new favourite.
          </p>
          <Button to="/shop" variant="primary" size="lg">
            Browse the Collection
          </Button>
        </section>
      </>
    )
  }

  const related = getRelatedProducts(product, 3)

  return (
    <>
      <Seo path={`/product/${product.id}`} />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <ol className="flex flex-wrap items-center gap-2 text-[13px] font-sans text-muted">
          <li><Link to="/" className="hover:text-burgundy-700">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link to="/shop" className="hover:text-burgundy-700">Shop</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-ink">{product.name}</li>
        </ol>
      </nav>

      <section className="bg-bone-50 py-12 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          {/* Image */}
          <div className="relative lg:sticky lg:top-24">
            <ProductImage
              src={product.image}
              alt={`${product.name} — ${product.category}`}
              aspect="aspect-[4/5]"
              className="rounded-[8px]"
              priority
            />
            {/* Floating "+N" confirmation after adding to cart. */}
            {pulse > 0 ? (
              <span
                key={pulse}
                aria-hidden="true"
                className="plus-one pointer-events-none absolute left-1/2 top-1/2 rounded-full bg-burgundy-700 px-4 py-2 font-sans text-base font-bold text-bone-50 shadow-lift"
              >
                +{quantity}
              </span>
            ) : null}
          </div>

          <div className="max-w-xl">
            <h1 className="font-display text-3xl font-bold leading-tight text-ink min-[400px]:text-4xl">
              {product.name}
            </h1>
            <p className="mt-4 font-sans text-2xl font-semibold text-ink tabular-nums">
              {formatNaira(product.price)}
            </p>

            <p className="mt-6 leading-relaxed text-ink/85">{product.description}</p>

            {product.note ? (
              <p className="mt-5 rounded-[6px] border-l-2 border-burgundy-300 bg-bone-200 px-5 py-4 text-sm leading-relaxed text-muted sm:text-[15px]">
                <strong className="font-bold text-ink">Please note</strong> {product.note}
              </p>
            ) : null}

            {/* Actions */}
            <div className="mt-10 flex flex-col gap-4 min-[480px]:flex-row min-[480px]:items-center min-[480px]:gap-4">
              <QuantitySelector value={quantity} onChange={setQuantity} />
              <Button
                variant="primary"
                size="lg"
                className="w-full justify-center min-[480px]:w-auto"
                loading={phase === 'loading'}
                onClick={handleAdd}
                ariaLabel={`Add ${quantity} of ${product.name} to cart`}
              >
                {phase === 'added' ? (
                  <>
                    <CheckIcon size={18} />
                    Added
                  </>
                ) : (
                  <>
                    <CartIcon size={18} />
                    Add to Cart
                  </>
                )}
              </Button>
            </div>
            <div className="mt-4">
              <WhatsAppButton
                lines={[{ name: product.name, quantity, price: product.price }]}
                label={`Order on WhatsApp · ${formatNaira(product.price * quantity)}`}
                size="lg"
                className="w-full"
              />
            </div>
            <p className="mt-3 text-xs text-muted/80">
              Tap “Order on WhatsApp” to send this item to us as a ready-made order message.
            </p>
          </div>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="bg-bone-100 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">
                  You may also love
                </h2>
              </div>
            </Reveal>
            <div className="mt-12">
              <ProductGrid products={related} />
            </div>
          </div>
        </section>
      ) : null}
    </>
  )
}
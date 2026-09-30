import type { Product } from '../../types'
import ProductCard from './ProductCard'
import Button from '../ui/Button'
import { SparkleIcon } from '../ui/icons'

interface ProductGridProps {
  products: Product[]
  className?: string
}

export default function ProductGrid({ products, className = '' }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 rounded-[8px] border border-dashed border-line bg-bone-200 px-5 py-12 text-center sm:px-8 sm:py-16">
        <span className="text-burgundy-300">
          <SparkleIcon size={28} />
        </span>
        <p className="font-display text-xl font-bold text-ink">No products found</p>
        <p className="max-w-md text-sm text-muted">
          We couldn't find any products matching that filter just yet. Check back soon, or browse the full collection.
        </p>
        <Button to="/shop" variant="primary" size="md">
          Browse all products
        </Button>
      </div>
    )
  }

  // No `items-start` — the default `stretch` makes every card in a row the
  // same height, so the grid stays perfectly even.
  return (
    <div className={`grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 ${className}`.trim()}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
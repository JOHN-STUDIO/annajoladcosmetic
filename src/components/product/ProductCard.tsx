import { Link } from 'react-router-dom'
import type { Product } from '../../types'
import { useCart } from '../../context/CartContext'
import { formatNaira } from '../../utils/formatCurrency'
import Button from '../ui/Button'
import ProductImage from './ProductImage'
import { CartIcon } from '../ui/icons'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { add } = useCart()
  const detailsUrl = `/product/${product.id}`

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[8px] border border-line bg-bone-50 shadow-card transition-shadow duration-300 hover:shadow-lift">
      <div className="relative">
        <Link to={detailsUrl} aria-label={`View ${product.name}`} className="block">
          {/* Fixed 4:5 frame + contain fit → every card image is exactly the same
              height (the whole photo stays visible on a soft background), so
              titles/prices/buttons line up across the whole grid. */}
          <ProductImage
            src={product.image}
            alt={`${product.name} — ${product.category}`}
            aspect="aspect-[4/5]"
            fit="contain"
          />
        </Link>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {/* 2.75em = exactly 2 lines of leading-snug at any breakpoint, so a
            longer name doesn't push its price below the neighbours'. */}
        <h3 className="min-h-[2.75em] font-display text-lg font-bold leading-snug text-ink sm:text-xl">
          <Link to={detailsUrl} className="hover:text-burgundy-700">
            {product.name}
          </Link>
        </h3>
        <p className="mt-2 text-[13px] leading-relaxed text-muted line-clamp-2 sm:text-sm">{product.shortDescription}</p>
        <p className="mt-3 font-sans text-base font-bold text-ink tabular-nums">
          {formatNaira(product.price)}
        </p>

        {/* mt-auto pins the buttons to the bottom of the (equal-height) card,
            pt-* keeps a minimum gap when the card has spare space. */}
        <div className="mt-auto flex flex-col gap-2 pt-4 sm:flex-row sm:gap-2.5 sm:pt-5">
          <Button to={detailsUrl} variant="ghost" size="sm" className="w-full justify-center sm:w-auto sm:flex-1" ariaLabel={`View details for ${product.name}`}>
            View
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="w-full justify-center sm:w-auto sm:flex-1"
            onClick={() => add(product)}
            ariaLabel={`Add ${product.name} to cart`}
          >
            <CartIcon size={16} />
            Add
          </Button>
        </div>
      </div>
    </article>
  )
}
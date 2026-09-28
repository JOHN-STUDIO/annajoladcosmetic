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
    <article className="group flex flex-col overflow-hidden rounded-[8px] border border-line bg-bone-50 shadow-card transition-shadow duration-300 hover:shadow-lift">
      <div className="relative">
        <Link to={detailsUrl} aria-label={`View ${product.name}`} className="block">
          <ProductImage src={product.image} alt={`${product.name} — ${product.category}`} />
        </Link>
      </div>

      <div className="flex flex-col p-4 sm:p-5">
        <h3 className="font-display text-lg font-bold leading-snug text-ink sm:text-xl">
          <Link to={detailsUrl} className="hover:text-burgundy-700">
            {product.name}
          </Link>
        </h3>
        <p className="mt-2 text-[13px] leading-relaxed text-muted line-clamp-2 sm:text-sm">{product.shortDescription}</p>
        <p className="mt-3 font-sans text-base font-bold text-ink tabular-nums">
          {formatNaira(product.price)}
        </p>

        <div className="mt-4 flex flex-col gap-2 sm:mt-5 sm:flex-row sm:gap-2.5">
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
import { Link } from 'react-router-dom'
import type { Product } from '../../types'
import { useCart } from '../../context/CartContext'
import { formatNaira } from '../../utils/formatCurrency'
import QuantitySelector from '../ui/QuantitySelector'
import ProductImage from '../product/ProductImage'
import { TrashIcon } from '../ui/icons'

interface CartItemRowProps {
  product: Product
  quantity: number
}

export default function CartItemRow({ product, quantity }: CartItemRowProps) {
  const { setQuantity, remove } = useCart()
  const lineTotal = product.price * quantity

  return (
    <li className="border-b border-line py-4">
      <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center sm:gap-4">
        {/* Image + info (+ remove button on mobile) */}
        <div className="flex items-start gap-3.5 sm:contents">
          <Link
            to={`/product/${product.id}`}
            className="shrink-0"
            aria-label={`View ${product.name}`}
            tabIndex={-1}
          >
            <ProductImage
              src={product.image}
              alt={product.name}
              aspect="aspect-square"
              fit="contain"
              className="h-20 w-20 rounded-[6px]"
            />
          </Link>

          <div className="min-w-0 flex-1">
            <Link to={`/product/${product.id}`} className="block truncate font-display text-base font-bold text-ink hover:text-burgundy-700">
              {product.name}
            </Link>
            <p className="mt-1 text-sm text-ink tabular-nums">{formatNaira(product.price)} each</p>
          </div>

          <button
            type="button"
            className="grid size-9 shrink-0 place-items-center rounded-[2px] border border-line text-muted hover:border-burgundy-500 hover:text-burgundy-700 sm:hidden"
            aria-label={`Remove ${product.name} from cart`}
            onClick={() => remove(product.id)}
          >
            <TrashIcon size={16} />
          </button>
        </div>

        {/* Quantity + line total (own row on mobile, inline on desktop) */}
        <div className="flex items-center justify-between sm:contents">
          <QuantitySelector value={quantity} onChange={(qty) => setQuantity(product.id, qty)} />
          <p className="font-sans text-sm font-bold text-ink tabular-nums sm:w-20 sm:text-right">
            {formatNaira(lineTotal)}
          </p>
        </div>

        <button
          type="button"
          className="hidden place-items-center rounded-[2px] border border-line text-muted hover:border-burgundy-500 hover:text-burgundy-700 sm:grid sm:size-9"
          aria-label={`Remove ${product.name} from cart`}
          onClick={() => remove(product.id)}
        >
          <TrashIcon size={16} />
        </button>
      </div>
    </li>
  )
}
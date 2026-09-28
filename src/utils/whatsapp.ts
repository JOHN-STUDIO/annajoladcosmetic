import { site } from '../data/site'
import { formatNaira } from './formatCurrency'

export interface OrderLine {
  name: string
  quantity: number
  price: number
}

/**
 * Builds the pre-filled WhatsApp order message.
 *
 * Example:
 *
 *   Hello Anna J'olad Cosmetics,
 *
 *   I would like to place an order:
 *
 *   1. Strawberry Kiss × 2 — ₦20,000
 *   2. Beauty Deep Carrot lotion × 1 — ₦4,500
 *
 *   Total: ₦27,500
 *
 *   Thank you.
 */
export function buildOrderMessage(lines: OrderLine[]): string {
  const numberedLines = lines
    .filter((line) => line.quantity > 0 && line.price >= 0)
    .map((line, index) => {
      const lineTotal = line.price * line.quantity
      return `${index + 1}. ${line.name} × ${line.quantity} — ${formatNaira(lineTotal)}`
    })

  const total = lines
    .filter((line) => line.quantity > 0 && line.price >= 0)
    .reduce((sum, line) => sum + line.price * line.quantity, 0)

  const message = [
    `Hello ${site.brandName},`,
    '',
    'I would like to place an order:',
    '',
    ...numberedLines,
    '',
    `Total: ${formatNaira(total)}`,
    '',
    'Thank you.'
  ].join('\n')

  return message
}

/**
 * Returns a wa.me URL with the order message pre-filled and URL-encoded.
 * The WhatsApp number is defined once in src/data/site.ts (WHATSAPP_NUMBER).
 */
export function buildWhatsAppUrl(lines: OrderLine[]): string {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(buildOrderMessage(lines))}`
}
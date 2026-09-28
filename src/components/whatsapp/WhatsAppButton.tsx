import type { OrderLine } from '../../utils/whatsapp'
import { buildWhatsAppUrl } from '../../utils/whatsapp'
import Button from '../ui/Button'
import type { ButtonSize } from '../ui/Button'
import { WhatsAppIcon } from '../ui/icons'

interface WhatsAppButtonProps {
  lines: OrderLine[]
  label?: string
  size?: ButtonSize
  className?: string
}

/**
 * Opens WhatsApp with the full order pre-filled as a message.
 * The business number is configured once in src/data/site.ts.
 */
export default function WhatsAppButton({
  lines,
  label = 'Order via WhatsApp',
  size = 'md',
  className
}: WhatsAppButtonProps) {
  const url = buildWhatsAppUrl(lines)
  return (
    <Button href={url} variant="whatsapp" size={size} className={className} target="_blank" rel="noreferrer">
      <WhatsAppIcon size={18} />
      {label}
    </Button>
  )
}
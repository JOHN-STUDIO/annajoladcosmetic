/**
 * Formats a whole-naira amount as a Naira price string, e.g. 15000 -> "₦15,000".
 */
export function formatNaira(amount: number): string {
  const rounded = Math.round(amount)
  const grouped = rounded.toLocaleString('en-US')
  return `₦${grouped}`
}
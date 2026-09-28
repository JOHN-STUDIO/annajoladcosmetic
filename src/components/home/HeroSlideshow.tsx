import { useEffect, useState } from 'react'
import ProductImage from '../product/ProductImage'
import { site } from '../../data/site'

/**
 * Auto-rotating hero slideshow for the home page.
 *
 * - Photos are configured in src/data/site.ts → `heroImages` (3 or 4 slots).
 * - Each photo shows for `heroSlideMs` (3 seconds), then crossfades to the
 *   next and keeps looping.
 * - Missing photo files are skipped automatically; if none exist yet the
 *   refined placeholder is shown — never a broken image.
 * - The frame takes the EXACT shape of the photo on screen — every picture
 *   is shown in full, edge to edge, with no cropping and no empty margins.
 *   The frame glides smoothly to the next photo's shape during the crossfade.
 */
export default function HeroSlideshow() {
  const slides = site.heroImages
  const interval = site.heroSlideMs
  const [index, setIndex] = useState(0)
  const [failed, setFailed] = useState<Record<string, boolean>>({})
  // Natural aspect ratio of each photo, recorded the first time it loads.
  const [ratios, setRatios] = useState<Record<string, number>>({})

  // Only rotate photos that actually exist.
  const visible = slides.filter((src) => !failed[src])
  const current = visible.length > 0 ? visible[index % visible.length] : null
  const ratio = current ? ratios[current] : undefined

  // Advance to the next photo every heroSlideMs (paused when < 2 photos).
  useEffect(() => {
    if (visible.length < 2) return
    const id = window.setInterval(() => setIndex((i) => i + 1), interval)
    return () => window.clearInterval(id)
  }, [visible.length, interval])

  // No photos yet (or none readable) — placeholder keeps the layout intact.
  if (!current) {
    return (
      <ProductImage
        src=""
        alt="Anna J'olad Cosmetics — handcrafted lip, body and hair essentials"
        aspect="aspect-[5/4] min-[480px]:aspect-[4/3] lg:aspect-[4/5]"
        className="relative rounded-[6px]"
      />
    )
  }

  // While a photo's ratio is still unknown, keep the classic responsive shape;
  // once known, the frame matches the photo exactly and animates between shapes.
  const frameClass = ratio
    ? 'transition-[aspect-ratio] duration-500 ease-out'
    : 'aspect-[5/4] min-[480px]:aspect-[4/3] lg:aspect-[4/5]'

  return (
    <div
      style={ratio ? { aspectRatio: String(ratio) } : undefined}
      className={`relative w-full overflow-hidden rounded-[6px] bg-bone-200 ${frameClass}`}
    >
      {visible.map((src) => {
        const active = src === current
        return (
          <img
            key={src}
            src={src}
            alt={active ? `${site.brandName} — hero photo` : ''}
            aria-hidden={!active}
            decoding="async"
            onLoad={(e) => {
              const el = e.currentTarget
              setRatios((r) =>
                r[src] ? r : { ...r, [src]: el.naturalWidth / el.naturalHeight }
              )
            }}
            onError={() => setFailed((f) => ({ ...f, [src]: true }))}
            className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ease-out ${
              active ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )
      })}
    </div>
  )
}
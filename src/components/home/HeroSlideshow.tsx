import { useEffect, useState } from 'react'
import ProductImage from '../product/ProductImage'
import { site } from '../../data/site'
import { getImageSize } from '../../data/imageDimensions'

/** The extra slides wait for the browser to go idle (see the effect below). */
type IdleWindow = Window & {
  requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number
  cancelIdleCallback?: (handle: number) => void
}

/**
 * Auto-rotating hero slideshow for the home page.
 *
 * - Photos are configured in src/data/site.ts → `heroImages` (3 or 4 slots).
 * - Each photo shows for `heroSlideMs` (3 seconds), then crossfades to the
 *   next and keeps looping.
 * - Missing photo files are skipped automatically; if none exist yet the
 *   refined placeholder is shown — never a broken image.
 * - The frame takes the EXACT shape of the photo on screen — every picture is
 *   shown in full, edge to edge, with no cropping and no empty margins.
 *
 * PERFORMANCE (Core Web Vitals):
 * - The first photo is the Largest Contentful Paint element on mobile, so it
 *   loads eagerly at high priority and its frame shape comes straight from the
 *   image manifest (no waiting for the file, no layout shift).
 * - The remaining photos are only mounted once the browser is idle, so the
 *   first screen is never delayed by pictures nobody is looking at yet.
 */
export default function HeroSlideshow() {
  const slides = site.heroImages
  const interval = site.heroSlideMs
  const [index, setIndex] = useState(0)
  const [failed, setFailed] = useState<Record<string, boolean>>({})
  // Natural aspect ratio of each photo, recorded when a file isn't catalogued.
  const [ratios, setRatios] = useState<Record<string, number>>({})
  const [allMounted, setAllMounted] = useState(false)

  // Only rotate photos that actually exist.
  const visible = slides.filter((src) => !failed[src])
  const current = visible.length > 0 ? visible[index % visible.length] : null

  // Known straight away for catalogued pictures → the frame never changes shape mid-load.
  const currentSize = current ? getImageSize(current) : undefined
  const ratio = currentSize
    ? currentSize.width / currentSize.height
    : current
      ? ratios[current]
      : undefined

  // Mount the rest of the slideshow when the browser has spare capacity.
  useEffect(() => {
    if (visible.length < 2 || allMounted) return
    const idle = window as IdleWindow
    if (typeof idle.requestIdleCallback === 'function') {
      const handle = idle.requestIdleCallback(() => setAllMounted(true), { timeout: 2500 })
      return () => idle.cancelIdleCallback?.(handle)
    }
    const timer = window.setTimeout(() => setAllMounted(true), 1000)
    return () => window.clearTimeout(timer)
  }, [visible.length, allMounted])

  // Advance to the next photo every heroSlideMs (paused when < 2 photos).
  useEffect(() => {
    if (visible.length < 2 || !allMounted) return
    const id = window.setInterval(() => setIndex((i) => i + 1), interval)
    return () => window.clearInterval(id)
  }, [visible.length, interval, allMounted])

  // No photos yet (or none readable) — placeholder keeps the layout intact.
  if (!current) {
    return (
      <ProductImage
        src=""
        alt={`${site.brandName} — handcrafted lip, body and hair essentials`}
        aspect="aspect-[5/4] min-[480px]:aspect-[4/3] lg:aspect-[4/5]"
        className="relative rounded-[6px]"
      />
    )
  }

  const rendered = allMounted ? visible : visible.slice(0, 1)
  const heroAlt = `${site.brandName} — ${site.tagline}`

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
      {rendered.map((src) => {
        const active = src === current
        const isFirst = src === visible[0]
        const size = getImageSize(src)
        return (
          <img
            key={src}
            src={src}
            alt={active ? heroAlt : ''}
            aria-hidden={!active}
            width={size?.width}
            height={size?.height}
            loading={isFirst ? 'eager' : 'lazy'}
            fetchPriority={isFirst ? 'high' : undefined}
            decoding="async"
            onLoad={(event) => {
              const el = event.currentTarget
              setRatios((r) => (r[src] ? r : { ...r, [src]: el.naturalWidth / el.naturalHeight }))
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

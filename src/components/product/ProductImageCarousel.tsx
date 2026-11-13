import { useState, useRef, useCallback } from 'react'
import { getImageSize } from '../../data/imageDimensions'

interface ProductImageCarouselProps {
  /** All image paths (2 for perfumes – front + back of bottle). */
  images: string[]
  alt: string
  className?: string
  aspect?: string
  /** Set for LCP images: load immediately at high priority. */
  priority?: boolean
}

/**
 * Swipeable image carousel for products with multiple photos (perfumes).
 *
 * - Touch/swipe left → next image, swipe right → previous image.
 * - Taps on either side also cycle (left half = previous, right half = next).
 * - With exactly 2 images it toggles back and forth.
 * - Falls back to an elegant placeholder when an image is missing.
 */
export default function ProductImageCarousel({
  images,
  alt,
  className = '',
  aspect = 'aspect-[4/5]',
  priority = false
}: ProductImageCarouselProps) {
  const [index, setIndex] = useState(0)
  const [failed, setFailed] = useState(false)
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)

  const src = images[index] || ''
  const size = getImageSize(src)
  const sizeAttrs = size ? { width: size.width, height: size.height } : {}
  const loading = priority ? 'eager' : 'lazy'

  const total = images.length

  const next = useCallback(() => setIndex((i) => (i + 1) % total), [total])
  const prev = useCallback(() => setIndex((i) => (i - 1 + total) % total), [total])

  // Swipe handling
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }, [])

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const touchEndX = e.changedTouches[0].clientX
      const touchEndY = e.changedTouches[0].clientY
      const dx = touchEndX - touchStartX.current
      const dy = Math.abs(touchEndY - touchStartY.current)

      // Only treat as a horizontal swipe if vertical movement is small.
      if (Math.abs(dx) > 40 && dy < 60) {
        if (dx > 0) prev()
        else next()
      }
    },
    [next, prev]
  )

  // Missing image → placeholder keeps the layout intact.
  if (failed || !src) {
    return (
      <div
        className={`${aspect} overflow-hidden bg-bone-200 ${className}`.trim()}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={{ touchAction: 'pan-y' }}
      >
        <div className="flex h-full w-full flex-col items-center justify-center gap-4 px-6 text-center">
          <span className="text-burgundy-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-sparkles"
            >
              <path d="M12 3l4 12" />
              <path d="M4.93 9.07l-3.6 3.6" />
              <path d="M19.07 9.07l3.6 3.6" />
              <path d="M12 15v6" />
            </svg>
          </span>
          <p className="text-[11px] font-sans uppercase tracking-[0.24em] text-muted">Product image</p>
          <p className="max-w-40 text-xs text-muted/80 truncate">{alt}</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`relative ${aspect} overflow-hidden bg-bone-200 ${className}`.trim()}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={{ touchAction: 'pan-y' }}
    >
      <img
        src={src}
        alt={alt}
        {...sizeAttrs}
        loading={loading}
        fetchPriority={priority ? 'high' : undefined}
        decoding="async"
        className="size-full object-contain transition-opacity duration-300"
        onError={() => setFailed(true)}
      />

      {/* Image indicators (dots). */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Image ${i + 1}`}
            aria-pressed={i === index}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              i === index ? 'bg-ink' : 'bg-ink/30'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
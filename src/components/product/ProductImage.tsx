import { useState } from 'react'
import { SparkleIcon } from '../ui/icons'

interface ProductImageProps {
  src: string
  alt: string
  className?: string
  /** Frame shape used for the placeholder when the image file is missing. */
  aspect?: string
  /**
   * How the picture meets its frame:
   *  - 'natural' (default) — the frame takes the picture's own proportions, so the
   *    whole picture is always visible. No cropping, no empty bars.
   *  - 'contain' — the picture fits inside a fixed frame supplied via `className`,
   *    with a soft background behind any spare space. Used for the small cart
   *    thumbnails and the circular founder portrait.
   */
  fit?: 'natural' | 'contain'
}

/**
 * Product image that always shows the WHOLE picture.
 *
 * Each product photo has its own proportions (some portrait, some landscape), so
 * the frame is shaped to the picture itself instead of forcing every image into
 * one fixed crop. If a file is missing, a refined placeholder is shown in its
 * place — never a broken image icon.
 */
export default function ProductImage({
  src,
  alt,
  className = '',
  aspect = 'aspect-[3/4]',
  fit = 'natural'
}: ProductImageProps) {
  const [failed, setFailed] = useState(false)

  // Missing or unreadable image → elegant placeholder keeps the layout intact.
  if (failed || !src) {
    return (
      <div className={`${aspect} overflow-hidden bg-bone-200 ${className}`.trim()}>
        <div className="flex h-full w-full flex-col items-center justify-center gap-4 px-6 text-center">
          <span className="text-burgundy-300">
            <SparkleIcon size={30} />
          </span>
          <p className="text-[11px] font-sans uppercase tracking-[0.24em] text-muted">Product image</p>
          <p className="max-w-40 text-xs text-muted/80 truncate">{alt}</p>
        </div>
      </div>
    )
  }

  if (fit === 'contain') {
    return (
      <div className={`flex items-center justify-center overflow-hidden bg-bone-200 ${className}`.trim()}>
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="size-full object-contain"
          onError={() => setFailed(true)}
        />
      </div>
    )
  }

  // Natural framing — the wrapper hugs the picture at its own aspect ratio.
  return (
    <div className={`w-full overflow-hidden ${className}`.trim()}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="block h-auto w-full"
        onError={() => setFailed(true)}
      />
    </div>
  )
}
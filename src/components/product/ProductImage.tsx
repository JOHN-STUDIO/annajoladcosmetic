import { useState } from 'react'
import { SparkleIcon } from '../ui/icons'
import { getImageSize } from '../../data/imageDimensions'

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
  /**
   * Set for pictures that are on screen when the page opens (the LCP image):
   * they load immediately at high priority instead of waiting for the lazy
   * loader. Everything below the fold should stay lazy (the default).
   */
  priority?: boolean
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
  fit = 'natural',
  priority = false
}: ProductImageProps) {
  const [failed, setFailed] = useState(false)
  // Real pixel dimensions (scripts/generate-image-meta.mjs). Passing them to the
  // <img> lets the browser reserve the right space before the file arrives, so
  // the layout never jumps as pictures stream in (CLS = 0 from images).
  const size = getImageSize(src)
  const sizeAttrs = size ? { width: size.width, height: size.height } : {}
  const loading = priority ? 'eager' : 'lazy'

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
          {...sizeAttrs}
          loading={loading}
          fetchPriority={priority ? 'high' : undefined}
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
        {...sizeAttrs}
        loading={loading}
        fetchPriority={priority ? 'high' : undefined}
        decoding="async"
        className="block h-auto w-full"
        onError={() => setFailed(true)}
      />
    </div>
  )
}
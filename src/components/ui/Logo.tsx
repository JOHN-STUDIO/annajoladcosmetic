import { useState } from 'react'
import { site } from '../../data/site'

type LogoProps = {
  /** Tailwind height class for the image version, e.g. 'h-10' or 'h-14'. */
  imgClassName?: string
  /** 'dark' for text on light backgrounds, 'light' for text on dark backgrounds (footer). */
  tone?: 'dark' | 'light'
}

/**
 * Brand logo.
 *
 * Shows `public/images/logo.jpeg` once you drop that file into the project.
 * Until the file exists it falls back to the elegant text wordmark, so the
 * layout never shows a broken image.
 *
 * To swap the file name/format later, change `logo` in `src/data/site.ts`.
 */
export default function Logo({ imgClassName = 'h-11', tone = 'dark' }: LogoProps) {
  const [imageMissing, setImageMissing] = useState(false)

  if (!imageMissing) {
    return (
      <img
        src={site.logo}
        alt={`${site.brandName} logo`}
        className={`w-auto ${imgClassName}`}
        onError={() => setImageMissing(true)}
        loading="eager"
      />
    )
  }

  // Text wordmark fallback (shown until logo.jpeg exists).
  return (
    <span className="inline-flex flex-col leading-none">
      <span
        className={`font-display text-xl font-extrabold tracking-tight ${
          tone === 'dark' ? 'text-ink' : 'text-bone-100'
        }`}
      >
        {site.shortName}
      </span>
      <span
        className={`text-[10px] font-sans uppercase tracking-[0.3em] ${
          tone === 'dark' ? 'text-burgundy-600' : 'text-bone-50/80'
        }`}
      >
        Cosmetics
      </span>
    </span>
  )
}

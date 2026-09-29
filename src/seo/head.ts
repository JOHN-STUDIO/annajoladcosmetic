// ---------------------------------------------------------------------------
// The <head> of every page, built from src/seo/routes.ts.
//
// One builder, two consumers:
//   • scripts/prerender.mjs — writes the tags into each static HTML file, so
//     Google, WhatsApp, Facebook… read them without running JavaScript;
//   • src/components/ui/Seo.tsx — applies the same tags to document.head when
//     the visitor navigates inside the app, so they never go stale.
// ---------------------------------------------------------------------------

import { site } from '../data/site'
import { getImageSize } from '../data/imageDimensions'
import { DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_ALT, absoluteUrl, getRouteSeo, type RouteSeo } from './routes'
import { buildStructuredData } from './jsonLd'

/** A <meta> tag: either `name="…"` or `property="…"` (Open Graph). */
export interface HeadTag {
  attr: 'name' | 'property'
  key: string
  content: string
}

/** A <link> tag (canonical, preload hints…). */
export interface HeadLink {
  rel: string
  href: string
  as?: string
  type?: string
  fetchpriority?: string
}

/**
 * Marks every tag this module manages (values used by both the static HTML and
 * src/components/ui/Seo.tsx, so the two can never disagree).
 */
export const MANAGED = 'managed'
/** id of the JSON-LD <script> — one per page, replaced in place on navigation. */
export const JSON_LD_ID = 'seo-structured-data'

export interface HeadData {
  title: string
  /** Absolute canonical URL — omitted for noindex pages (e.g. the 404 shell). */
  canonical?: string
  tags: HeadTag[]
  links: HeadLink[]
  jsonLd: Record<string, unknown>
}

/** What Google is told for normal pages: index, follow, big image previews. */
const ROBOTS_INDEX = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
const ROBOTS_NOINDEX = 'noindex, follow'

/** Mime type from the file extension (used for og:image:type). */
function imageMime(path: string): string {
  const ext = path.split('.').pop()?.toLowerCase() ?? ''
  if (ext === 'png') return 'image/png'
  if (ext === 'webp') return 'image/webp'
  if (ext === 'svg') return 'image/svg+xml'
  return 'image/jpeg'
}

/** Builds the complete head payload for a router path. */
export function buildHead(path: string): HeadData {
  return buildHeadForSeo(getRouteSeo(path))
}

/** Builds the complete head payload for an already-resolved route. */
export function buildHeadForSeo(seo: RouteSeo): HeadData {
  const isIndexable = !seo.noindex
  const canonical = isIndexable ? absoluteUrl(seo.path) : undefined
  const ogImage = seo.ogImage ?? DEFAULT_OG_IMAGE
  const ogImageAlt = seo.ogImageAlt ?? DEFAULT_OG_IMAGE_ALT
  const ogImageUrl = absoluteUrl(ogImage)
  const size = getImageSize(ogImage)

  const tags: HeadTag[] = [
    { attr: 'name', key: 'description', content: seo.description },
    { attr: 'name', key: 'robots', content: isIndexable ? ROBOTS_INDEX : ROBOTS_NOINDEX },
    { attr: 'name', key: 'author', content: site.brandName }
  ]

  if (canonical) {
    tags.push({ attr: 'property', key: 'og:url', content: canonical })
  }

  // ── Open Graph (WhatsApp, Facebook, LinkedIn…) ─────────────────────────────
  tags.push(
    { attr: 'property', key: 'og:type', content: seo.ogType ?? 'website' },
    { attr: 'property', key: 'og:site_name', content: site.brandName },
    { attr: 'property', key: 'og:title', content: seo.title },
    { attr: 'property', key: 'og:description', content: seo.description },
    { attr: 'property', key: 'og:locale', content: 'en_NG' },
    { attr: 'property', key: 'og:image', content: ogImageUrl },
    { attr: 'property', key: 'og:image:type', content: imageMime(ogImage) },
    { attr: 'property', key: 'og:image:alt', content: ogImageAlt }
  )

  if (size) {
    tags.push(
      { attr: 'property', key: 'og:image:width', content: String(size.width) },
      { attr: 'property', key: 'og:image:height', content: String(size.height) }
    )
  }

  // ── Twitter / X (large card) ───────────────────────────────────────────────
  tags.push(
    { attr: 'name', key: 'twitter:card', content: 'summary_large_image' },
    { attr: 'name', key: 'twitter:title', content: seo.title },
    { attr: 'name', key: 'twitter:description', content: seo.description },
    { attr: 'name', key: 'twitter:image', content: ogImageUrl },
    { attr: 'name', key: 'twitter:image:alt', content: ogImageAlt }
  )

  // Product pages also expose price details that Facebook/WhatsApp can use.
  if (seo.ogType === 'product' && seo.product) {
    tags.push(
      { attr: 'property', key: 'product:price:amount', content: String(seo.product.price) },
      { attr: 'property', key: 'product:price:currency', content: 'NGN' },
      { attr: 'property', key: 'product:availability', content: 'in stock' },
      { attr: 'property', key: 'product:brand', content: site.brandName }
    )
  }

  const links: HeadLink[] = []
  if (canonical) links.push({ rel: 'canonical', href: canonical })
  for (const preload of seo.preload ?? []) {
    links.push({ rel: 'preload', as: 'image', href: preload, fetchpriority: 'high' })
  }

  return { title: seo.title, canonical, tags, links, jsonLd: buildStructuredData(seo) }
}

/** Escapes text for use inside an HTML attribute. */
function escapeAttribute(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/**
 * Serialises the head payload as HTML — this is what ends up inside the
 * `<!--seo:start-->` … `<!--seo:end-->` block of every prerendered page.
 *
 * Every element carries `data-seo="managed"` (and the structured data keeps the
 * id used by the client), so src/components/ui/Seo.tsx can find and replace
 * exactly these tags when the visitor navigates — never leaving a stale
 * canonical, price or schema block behind.
 */
export function headToHtml(head: HeadData): string {
  const lines: string[] = [`<title>${escapeAttribute(head.title)}</title>`]

  for (const link of head.links) {
    const attrs = [
      `rel="${link.rel}"`,
      `href="${escapeAttribute(link.href)}"`,
      link.as ? `as="${link.as}"` : '',
      link.type ? `type="${link.type}"` : '',
      link.fetchpriority ? `fetchpriority="${link.fetchpriority}"` : '',
      `data-seo="${MANAGED}"`
    ].filter(Boolean)
    lines.push(`<link ${attrs.join(' ')} />`)
  }

  for (const tag of head.tags) {
    lines.push(
      `<meta ${tag.attr}="${tag.key}" content="${escapeAttribute(tag.content)}" data-seo="${MANAGED}" />`
    )
  }

  // Structured data — "<" is escaped so no JSON string can close the script.
  const json = JSON.stringify(head.jsonLd, null, 2).replace(/</g, '\\u003c')
  lines.push(
    `<script type="application/ld+json" id="${JSON_LD_ID}" data-seo="${MANAGED}">\n${json}\n</script>`
  )

  return lines.map((line) => `    ${line}`).join('\n')
}

// ---------------------------------------------------------------------------
// SEO — SINGLE SOURCE OF TRUTH for every indexable URL.
//
// The same data drives:
//   1. the static HTML that `npm run build` writes for each route
//      (scripts/prerender.mjs → dist/<route>/index.html), so crawlers and
//      social scrapers get real, unique head tags without running JavaScript;
//   2. the client-side <Seo> component, which keeps those tags in sync while
//      the visitor navigates inside the app;
//   3. dist/sitemap.xml and the JSON-LD structured data.
//
// ALL copy here is derived from the real site content (src/data/*) — product
// names, prices, sizes, categories, FAQ and the brand write-up. Edit content
// there; the titles/descriptions below pick it up automatically.
//
// ── If the domain ever changes, edit SITE_URL (and public/robots.txt). ──────
// ---------------------------------------------------------------------------

import { products } from '../data/products'
import { site } from '../data/site'
import type { Product } from '../types'
import { formatNaira } from '../utils/formatCurrency'

/** Canonical production origin — no trailing slash. */
export const SITE_URL = 'https://www.annajoladcosmetics.app'

/** Site-wide social preview picture (1200×630, see public/images/README.md). */
export const DEFAULT_OG_IMAGE = '/images/metatag.jpg'

export const DEFAULT_OG_IMAGE_ALT = `${site.brandName} — handcrafted lip, body and hair care`

/** Absolute URL for a router path (`/` → `https://…/`). */
export function absoluteUrl(path: string): string {
  if (path === '/' || path === '') return `${SITE_URL}/`
  return `${SITE_URL}${path}`
}

/** Normalises a URL path: no trailing slash, no query/hash, always leading "/". */
export function normalisePath(path: string): string {
  const withoutQuery = path.split('?')[0].split('#')[0]
  const withSlash = withoutQuery.startsWith('/') ? withoutQuery : `/${withoutQuery}`
  return withSlash.length > 1 ? withSlash.replace(/\/+$/, '') : '/'
}

/**
 * Trims text to a meta-description-friendly length (≈155 characters, which is
 * what Google shows) without slicing a word in half.
 */
export function clampDescription(text: string, max = 155): string {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  const cut = clean.slice(0, max - 1)
  const lastSpace = cut.lastIndexOf(' ')
  const clipped = lastSpace > max * 0.5 ? cut.slice(0, lastSpace) : cut
  return `${clipped.replace(/[,;:.\u2013\u2014-]+$/, '')}\u2026`
}

export interface RouteSeo {
  /** Router path — also the canonical path, e.g. "/shop" or "/product/beauty-deep". */
  path: string
  /** <title> — unique per route, written for humans first. */
  title: string
  /** <meta name="description"> — unique per route, ≤ ~155 characters. */
  description: string
  /** Social preview picture (absolute URL or site-relative path). */
  ogImage?: string
  ogImageAlt?: string
  /** Open Graph object type. */
  ogType?: 'website' | 'product'
  /** Structured-data "page type" for interior pages. */
  pageType?: 'WebPage' | 'CollectionPage' | 'AboutPage' | 'ContactPage' | 'FAQPage'
  /** Product behind this route, when it is a product page. */
  product?: Product
  /** Higher = more important (drives sitemap priority). */
  priority: number
  changefreq: 'weekly' | 'monthly' | 'yearly'
  /** Pictures this route should preload (LCP hint). */
  preload?: string[]
  /** Excluded from search results (still crawlable). */
  noindex?: boolean
}

// ── Live counts, so the copy never claims something the shop doesn't have ────
const TOTAL = products.length
const GLOSSES = products.filter((product) => product.subcategory === 'Lipglosses').length
const SCRUBS = products.filter((product) => product.subcategory === 'Lip scrubs').length
const SOAPS = products.filter((product) => product.category === 'Soaps').length
const CREAMS = products.filter((product) => product.category === 'Creams').length

/** Pretty-prints the WhatsApp number for human-readable copy: +234 803 232 4015 */
export const BUSINESS_PHONE = `+${site.whatsappNumber.replace(
  /(\d{3})(\d{3})(\d{3})(\d{4})/,
  '$1 $2 $3 $4'
)}`

// ── Page metadata (content-derived, unique per page) ─────────────────────────

const STATIC_ROUTES: RouteSeo[] = [
  {
    path: '/',
    title: `${site.brandName} | Handcrafted Lip, Body & Hair Care`,
    description: clampDescription(
      `Handcrafted lip glosses, soaps, body lotions and hair creams made with care. Order on WhatsApp — delivery in 24–72 hrs across Nigeria.`
    ),
    ogImage: DEFAULT_OG_IMAGE,
    ogImageAlt: DEFAULT_OG_IMAGE_ALT,
    ogType: 'website',
    pageType: 'WebPage',
    priority: 1,
    changefreq: 'weekly',
    preload: site.heroImages.length > 0 ? [site.heroImages[0]] : undefined
  },
  {
    path: '/shop',
    title: `Shop All Products | ${site.brandName}`,
    description: clampDescription(
      `All ${TOTAL} handcrafted products: ${GLOSSES} Sweetlips lip glosses, ${SCRUBS} lip scrubs, lip balm, ${CREAMS} creams and ${SOAPS} Jewel Luxury soaps. Prices in Naira — order on WhatsApp.`
    ),
    ogImage: DEFAULT_OG_IMAGE,
    ogImageAlt: DEFAULT_OG_IMAGE_ALT,
    ogType: 'website',
    pageType: 'CollectionPage',
    priority: 0.9,
    changefreq: 'weekly'
  },
  {
    path: '/about',
    title: `About ${site.brandName} — Our Story & Ingredients`,
    description: clampDescription(
      `${site.brandName} makes safe, natural, non-harmful products for skin, body and hair — handcrafted with care and never animal-tested.`
    ),
    ogImage: '/images/founder.jpeg',
    ogImageAlt: `The founder of ${site.brandName}`,
    ogType: 'website',
    pageType: 'AboutPage',
    priority: 0.7,
    changefreq: 'monthly',
    preload: [site.founder.image]
  },
  {
    path: '/faq',
    title: `FAQ | Ordering, Delivery & Ingredients | ${site.brandName}`,
    description: clampDescription(
      `How WhatsApp ordering works, delivery times (24–72 hrs after production), ingredients, and how to contact us — the questions we get asked most.`
    ),
    ogImage: DEFAULT_OG_IMAGE,
    ogImageAlt: DEFAULT_OG_IMAGE_ALT,
    ogType: 'website',
    pageType: 'FAQPage',
    priority: 0.7,
    changefreq: 'monthly'
  },
  {
    path: '/contact',
    title: `Contact Us | WhatsApp, Instagram & Email | ${site.brandName}`,
    description: clampDescription(
      `Chat with us on WhatsApp (${BUSINESS_PHONE}) for the fastest reply, follow @${site.instagram.handle} on Instagram and TikTok for new drops and restocks, or email ${site.email}.`
    ),
    ogImage: DEFAULT_OG_IMAGE,
    ogImageAlt: DEFAULT_OG_IMAGE_ALT,
    ogType: 'website',
    pageType: 'ContactPage',
    priority: 0.7,
    changefreq: 'monthly'
  }
]

/** SEO for a single product page — its own name, price, size and photo. */
function productRoute(product: Product): RouteSeo {
  return {
    path: `/product/${product.id}`,
    title: `${product.name} – ${formatNaira(product.price)} | ${site.brandName}`,
    // The product's own words: Google shows ~155 characters, so the copy is
    // trimmed at a word boundary rather than padded with filler.
    description: clampDescription(product.shortDescription, 155),
    ogImage: product.image,
    ogImageAlt: `${product.name} — ${product.subcategory ?? product.category} by ${site.brandName}`,
    ogType: 'product',
    pageType: 'WebPage',
    product,
    priority: 0.8,
    changefreq: 'weekly',
    preload: [product.image]
  }
}

const PRODUCT_ROUTES: RouteSeo[] = products.map(productRoute)

/** Every route that should appear in search + the sitemap, in priority order. */
export const INDEXABLE_ROUTES: RouteSeo[] = [...STATIC_ROUTES, ...PRODUCT_ROUTES]

/** The 404 shell — crawlable, but kept out of the index. */
export const NOT_FOUND_SEO: RouteSeo = {
  path: '/404',
  title: `Page not found | ${site.brandName}`,
  description: `That page doesn't exist on ${site.brandName}. Browse the shop for handcrafted lip glosses, soaps, body lotions and hair creams instead.`,
  ogType: 'website',
  pageType: 'WebPage',
  priority: 0,
  changefreq: 'yearly',
  noindex: true
}

/**
 * SEO for a router path. Unknown paths fall back to the 404 entry with
 * `noindex`, so a mistyped URL can never be indexed as real content.
 *
 * `/shop?category=Soaps` is the same page with a client-side filter, so it
 * canonicalises to `/shop` instead of competing with it for the same results.
 */
export function getRouteSeo(path: string): RouteSeo {
  const normalised = normalisePath(path)
  const match = INDEXABLE_ROUTES.find((route) => route.path === normalised)
  return match ?? NOT_FOUND_SEO
}

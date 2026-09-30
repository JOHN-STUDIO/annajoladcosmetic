// ---------------------------------------------------------------------------
// Structured data (schema.org / JSON-LD).
//
// Everything here is built from the real site data — brand identity from
// src/data/site.ts, products/prices from src/data/products.ts and the real
// FAQ from src/data/faq.ts. Nothing is invented: we only emit properties whose
// values genuinely exist (no made-up addresses, ratings or review counts —
// fabricated markup is both against Google's guidelines and unhelpful).
//
// Each page emits ONE <script type="application/ld+json"> containing a @graph
// of connected nodes (Organization + WebSite + the page + its breadcrumbs).
// ---------------------------------------------------------------------------

import { site } from '../data/site'
import { products } from '../data/products'
import { faqItems } from '../data/faq'
import type { Product } from '../types'
import { SITE_URL, absoluteUrl, BUSINESS_PHONE, type RouteSeo } from './routes'

type Json = Record<string, unknown>

const ORGANIZATION_ID = `${SITE_URL}/#organization`
const WEBSITE_ID = `${SITE_URL}/#website`

/** The brand as a schema.org Organization (used on every page). */
export function organizationNode(): Json {
  return {
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: site.brandName,
    alternateName: site.shortName,
    url: `${SITE_URL}/`,
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl(site.logo),
      caption: `${site.brandName} logo`
    },
    image: absoluteUrl('/images/metatag.jpg'),
    description:
      'Handcrafted lip, body and hair care: Sweetlips lip glosses, Jewel Luxury soaps, body lotions and hair creams.',
    slogan: site.tagline,
    email: site.email,
    sameAs: [site.instagram.url, site.tiktok.url],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        telephone: BUSINESS_PHONE,
        email: site.email,
        url: `https://wa.me/${site.whatsappNumber}`,
        areaServed: 'NG',
        availableLanguage: 'en'
      }
    ]
  }
}

/** The site itself (helps Google understand the brand + canonical origin). */
export function websiteNode(): Json {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: `${SITE_URL}/`,
    name: site.brandName,
    description: site.tagline,
    inLanguage: 'en',
    publisher: { '@id': ORGANIZATION_ID }
  }
}

/** Breadcrumb trail for a page: Home → (Shop) → Page. */
export function breadcrumbNode(trail: Array<{ name: string; path: string }>): Json {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path)
    }))
  }
}

/** A single product with its real price and availability. */
export function productNode(product: Product, path: string): Json {
  return {
    '@type': 'Product',
    '@id': `${absoluteUrl(path)}#product`,
    name: product.name,
    description: product.description,
    image: [absoluteUrl(product.image)],
    url: absoluteUrl(path),
    category: product.subcategory ? `${product.category} — ${product.subcategory}` : product.category,
    size: product.size,
    brand: { '@type': 'Brand', name: site.brandName },
    manufacturer: { '@id': ORGANIZATION_ID },
    offers: {
      '@type': 'Offer',
      url: absoluteUrl(path),
      price: product.price,
      priceCurrency: 'NGN',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@id': ORGANIZATION_ID },
      // Orders are confirmed on WhatsApp — this is what the price covers.
      priceSpecification: {
        '@type': 'PriceSpecification',
        price: product.price,
        priceCurrency: 'NGN',
        valueAddedTaxIncluded: true
      }
    }
  }
}

/** The full catalogue as an ordered list (Shop page). */
export function itemListNode(): Json {
  return {
    '@type': 'ItemList',
    name: `All ${products.length} ${site.brandName} products`,
    numberOfItems: products.length,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: product.name,
      url: absoluteUrl(`/product/${product.id}`)
    }))
  }
}

/** The real FAQ, so Google can read the questions and answers. */
export function faqNode(): Json {
  return {
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer }
    }))
  }
}

/** The page node itself (WebPage / CollectionPage / AboutPage / …). */
function pageNode(seo: RouteSeo): Json {
  return {
    '@type': seo.pageType ?? 'WebPage',
    '@id': `${absoluteUrl(seo.path)}#page`,
    url: absoluteUrl(seo.path),
    name: seo.title,
    description: seo.description,
    inLanguage: 'en',
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORGANIZATION_ID },
    publisher: { '@id': ORGANIZATION_ID },
    primaryImageOfPage: seo.ogImage
      ? { '@type': 'ImageObject', url: absoluteUrl(seo.ogImage) }
      : undefined
  }
}

/** Home → (Shop) → page, for the breadcrumb trail. */
function breadcrumbTrail(seo: RouteSeo): Array<{ name: string; path: string }> {
  if (seo.path === '/' || seo.noindex) return []
  if (seo.product) {
    return [
      { name: 'Home', path: '/' },
      { name: 'Shop', path: '/shop' },
      { name: seo.product.name, path: seo.path }
    ]
  }
  const names: Record<string, string> = {
    '/shop': 'Shop',
    '/about': 'About',
    '/faq': 'FAQ',
    '/contact': 'Contact'
  }
  return [
    { name: 'Home', path: '/' },
    { name: names[seo.path] ?? seo.title, path: seo.path }
  ]
}

/**
 * The @graph emitted for a route: brand + site on every page, then the page
 * node and only the extra types that genuinely apply to it.
 */
export function buildStructuredData(seo: RouteSeo): Json {
  const graph: Json[] = [organizationNode(), websiteNode(), pageNode(seo)]

  const trail = breadcrumbTrail(seo)
  if (trail.length > 1) graph.push(breadcrumbNode(trail))

  if (seo.product) graph.push(productNode(seo.product, seo.path))
  if (seo.path === '/shop') graph.push(itemListNode())
  if (seo.path === '/faq') graph.push(faqNode())

  return { '@context': 'https://schema.org', '@graph': graph }
}

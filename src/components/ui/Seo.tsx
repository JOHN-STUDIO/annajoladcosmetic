import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import {
  buildHead,
  JSON_LD_ID,
  MANAGED,
  type HeadData,
  type HeadLink,
  type HeadTag
} from '../../seo/head'

/**
 * Per-page SEO.
 *
 * The same payload that scripts/prerender.mjs bakes into each static HTML file
 * is re-applied here whenever the visitor navigates inside the app — otherwise
 * the tags would keep describing whichever page was loaded first.
 *
 * Managed elements carry data-seo="managed", so the previous route's tags
 * (canonical, og:*, twitter:*, product:*…) are replaced cleanly instead of
 * piling up.
 */
interface SeoProps {
  /**
   * Router path this page describes. Pass it explicitly when the SEO belongs
   * to something more specific than the bare URL (e.g. a product id).
   */
  path?: string
}

function marker(element: Element): void {
  element.setAttribute('data-seo', MANAGED)
}

function upsertMeta(tag: HeadTag): void {
  const selector = `meta[${tag.attr}="${tag.key}"]`
  let element = document.head.querySelector<HTMLMetaElement>(selector)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(tag.attr, tag.key)
    document.head.appendChild(element)
  }
  element.setAttribute('content', tag.content)
  marker(element)
}

function upsertLink(link: HeadLink): void {
  const selector = link.as ? `link[rel="${link.rel}"][as="${link.as}"]` : `link[rel="${link.rel}"]`
  let element = document.head.querySelector<HTMLLinkElement>(selector)
  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', link.rel)
    document.head.appendChild(element)
  }
  element.setAttribute('href', link.href)
  if (link.as) element.setAttribute('as', link.as)
  if (link.fetchpriority) element.setAttribute('fetchpriority', link.fetchpriority)
  marker(element)
}

/** Applies a head payload to the live document. */
export function applyHead(head: HeadData): void {
  document.title = head.title

  // Drop the previous page's tags before writing the new ones — a stale
  // canonical or og:image is worse than none at all. Preload hints are kept,
  // since re-requesting the same picture would only cost time.
  document.head.querySelectorAll('[data-seo="managed"]').forEach((element) => {
    if (element.tagName !== 'LINK' || element.getAttribute('rel') !== 'preload') {
      element.remove()
    }
  })

  for (const link of head.links) upsertLink(link)
  for (const tag of head.tags) upsertMeta(tag)

  let script = document.getElementById(JSON_LD_ID) as HTMLScriptElement | null
  if (!script) {
    script = document.createElement('script')
    script.type = 'application/ld+json'
    script.id = JSON_LD_ID
    document.head.appendChild(script)
  }
  script.textContent = JSON.stringify(head.jsonLd)
  marker(script)
}

export default function Seo({ path }: SeoProps) {
  const location = useLocation()
  const target = path ?? location.pathname

  useEffect(() => {
    applyHead(buildHead(target))
  }, [target])

  return null
}

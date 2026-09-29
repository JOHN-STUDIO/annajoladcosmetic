// ---------------------------------------------------------------------------
// SEO check — validates the BUILT site in dist/ (run by `npm run seo:check`).
//
// This is the safety net behind the SEO work: it re-reads the prerendered HTML
// exactly like a crawler would and fails loudly if anything drifts — duplicate
// or missing titles, a wrong canonical, a broken sitemap entry, unparsable
// structured data, an image without alt text, and so on.
//
// Run it after `npm run build`, before submitting to Google Search Console.
// ---------------------------------------------------------------------------

import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const dist = join(root, 'dist')

const checks = []
function check(name, ok, detail = '') {
  checks.push({ name, ok, detail })
}
const read = (file) => readFileSync(file, 'utf8')
const countMatches = (text, pattern) => (text.match(pattern) ?? []).length
const attr = (html, pattern) => {
  const match = html.match(pattern)
  return match ? match[1] : ''
}
/** What a crawler displays: entities such as &amp; count as one character. */
const decoded = (text) =>
  text
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')

if (!existsSync(join(dist, 'index.html'))) {
  console.error('x dist/index.html not found — run `npm run build` first.')
  process.exit(1)
}

// ── sitemap + robots ────────────────────────────────────────────────────────
const sitemapFile = join(dist, 'sitemap.xml')
const robotsFile = join(dist, 'robots.txt')
check('sitemap.xml exists', existsSync(sitemapFile))
check('robots.txt exists', existsSync(robotsFile))

const sitemap = existsSync(sitemapFile) ? read(sitemapFile) : ''
const robots = existsSync(robotsFile) ? read(robotsFile) : ''

const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1])
check('sitemap lists URLs', urls.length > 0, `${urls.length} URLs`)
check(
  'sitemap entries are absolute https URLs',
  urls.every((url) => url.startsWith('https://')),
  urls.find((url) => !url.startsWith('https://')) ?? ''
)
check('sitemap entries are unique', new Set(urls).size === urls.length)
check('sitemap entries have lastmod', countMatches(sitemap, /<lastmod>/g) === urls.length)
check('robots.txt points at the sitemap', /Sitemap:\s*https:\/\/\S+sitemap\.xml/.test(robots))
check('robots.txt does not block the site', !/^Disallow:\s*\/\s*$/m.test(robots))

const sitemapUrl = attr(robots, /Sitemap:\s*(\S+)/)
const origin = sitemapUrl ? sitemapUrl.replace(/\/sitemap\.xml$/, '') : ''

/** dist path for a canonical URL. */
function fileFor(url) {
  const path = url.replace(origin, '') || '/'
  return path === '/' ? join(dist, 'index.html') : join(dist, path, 'index.html')
}

// ── per page ────────────────────────────────────────────────────────────────
const titles = new Map()
const descriptions = new Map()
const pages = [...urls, `${origin}/404.html`]

for (const url of pages) {
  const isNotFound = url.endsWith('404.html')
  const file = isNotFound ? join(dist, '404.html') : fileFor(url)
  const label = isNotFound ? '404' : url.replace(origin, '') || '/'

  if (!existsSync(file)) {
    check(`${label} was prerendered`, false, file)
    continue
  }
  const html = read(file)

  const title = decoded(attr(html, /<title>(.*?)<\/title>/))
  const description = decoded(attr(html, /name="description"[\s\S]{0,4}content="(.*?)"/))
  const canonical = attr(html, /rel="canonical"\s+href="(.*?)"/)
  const robotsMeta = attr(html, /name="robots"[\s\S]{0,4}content="(.*?)"/)
  // Tolerates the id / data-seo attributes headToHtml writes on the script.
  const jsonLd = attr(html, /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/)
  const h1Count = countMatches(html, /<h1[\s>]/g)

  check(`${label}: single <title>`, countMatches(html, /<title>/g) === 1)
  check(`${label}: title present`, title.length > 0)
  check(`${label}: title at most 65 chars`, title.length <= 65, `${title.length}`)
  check(`${label}: single description`, countMatches(html, /name="description"/g) === 1)
  check(`${label}: description present`, description.length > 0)
  check(
    `${label}: description 70-160 chars`,
    description.length >= 70 && description.length <= 160,
    `${description.length}`
  )
  check(`${label}: robots meta present`, robotsMeta.length > 0)
  check(`${label}: exactly one <h1>`, h1Count === 1, `${h1Count}`)
  check(`${label}: html lang set`, /<html lang="en"/.test(html))
  check(`${label}: og:title present`, /property="og:title"/.test(html))
  check(`${label}: og:description present`, /property="og:description"/.test(html))
  check(
    `${label}: og:url matches the canonical`,
    canonical === '' ? !/property="og:url"/.test(html) : html.includes(`property="og:url" content="${canonical}"`)
  )
  check(`${label}: og:type present`, /property="og:type"/.test(html))
  check(`${label}: og:site_name present`, /property="og:site_name"/.test(html))
  check(`${label}: og:image is absolute`, /property="og:image"[\s\S]{0,4}content="https:\/\//.test(html))
  check(`${label}: og:image:alt present`, /property="og:image:alt"/.test(html))
  check(`${label}: twitter card is large`, /twitter:card"[\s\S]{0,4}content="summary_large_image"/.test(html))
  check(`${label}: twitter:title present`, /name="twitter:title"/.test(html))
  check(`${label}: twitter:image present`, /name="twitter:image"/.test(html))
  check(`${label}: exactly one JSON-LD block`, countMatches(html, /application\/ld\+json/g) === 1)

  let structured = null
  try {
    structured = JSON.parse(jsonLd)
  } catch {
    structured = null
  }
  const graph = structured ? JSON.stringify(structured) : ''
  check(`${label}: JSON-LD parses`, structured !== null)
  check(`${label}: JSON-LD uses schema.org`, structured !== null && structured['@context'] === 'https://schema.org')
  check(
    `${label}: JSON-LD has Organization + WebSite`,
    graph.includes('"Organization"') && graph.includes('"WebSite"')
  )

  // Every picture must carry alt text (accessibility + image SEO).
  const imgTags = [...html.matchAll(/<img\b[^>]*>/g)].map((match) => match[0])
  check(
    `${label}: all ${imgTags.length} images have alt`,
    imgTags.every((tag) => /\salt="/.test(tag)),
    imgTags.find((tag) => !/\salt="/.test(tag)) ?? ''
  )

  if (isNotFound) {
    check(`${label}: is noindex`, /noindex/.test(robotsMeta))
    check(`${label}: has no canonical`, canonical === '')
    continue
  }

  // The canonical must point at the URL the sitemap advertises.
  check(`${label}: canonical matches sitemap URL`, canonical === url, canonical)
  check(`${label}: is indexable`, /^index/.test(robotsMeta))
  check(`${label}: prerendered real content`, /<div id="root">\s*<[^>]+>/.test(html))

  if (canonical.includes('/product/')) {
    check(`${label}: og:type is product`, /property="og:type"[\s\S]{0,4}content="product"/.test(html))
    check(`${label}: price in og tags`, /property="product:price:amount"[\s\S]{0,4}content="\d+"/.test(html))
    check(`${label}: Product schema`, graph.includes('"Product"'))
    check(`${label}: Offer schema`, graph.includes('"Offer"'))
  }

  titles.set(title, (titles.get(title) ?? 0) + 1)
  descriptions.set(description, (descriptions.get(description) ?? 0) + 1)
}

// ── cross-page ──────────────────────────────────────────────────────────────
const duplicateTitles = [...titles.entries()].filter(([, count]) => count > 1).map(([title]) => title)
const duplicateDescriptions = [...descriptions.entries()]
  .filter(([, count]) => count > 1)
  .map(([description]) => description)

check('titles are unique across pages', duplicateTitles.length === 0, duplicateTitles.join(' | '))
check(
  'descriptions are unique across pages',
  duplicateDescriptions.length === 0,
  duplicateDescriptions.join(' | ')
)

const shopHtml = read(join(dist, 'shop', 'index.html'))
const faqHtml = read(join(dist, 'faq', 'index.html'))
const productHtml = read(join(dist, 'product', 'beauty-deep', 'index.html'))
const homeHtml = read(join(dist, 'index.html'))

check('ItemList schema on /shop', shopHtml.includes('"ItemList"'))
check('all products listed on /shop', countMatches(shopHtml, /\/product\//g) >= 17 * 2 - 1)
check('FAQ schema on /faq', faqHtml.includes('"FAQPage"'))
check('BreadcrumbList on product pages', productHtml.includes('"BreadcrumbList"'))
check('product page is self-canonical', productHtml.includes('rel="canonical" href="https://www.annajoladcosmetics.app/product/beauty-deep"'))
// Attribute order differs between the managed head tag (rel, href, as) and the
// one React's renderer emits for the LCP image, so match on rel + href only.
check('home page preloads its hero image', /rel="preload"[^>]*href="\/images\/hero-1\.jpeg"/.test(homeHtml))
check('LCP hero image is marked high priority', /fetchpriority="high"/.test(homeHtml))
check(
  'hero image carries real alt text',
  /alt="Anna J(&#x27;|')olad Cosmetics — Beauty Essentials Made for Your Everyday Glow"/.test(homeHtml)
)
check('images declare width and height (no layout shift)', /width="1014" height="1080"/.test(homeHtml))
check('client bundle is loaded', /<script type="module"[^>]+src="\/assets\/index-[\w-]+\.js"/.test(homeHtml))
check('developer docs are not deployed', !existsSync(join(dist, 'images', 'README.md')))

// Every og:image used in the build must actually exist in dist.
const ogImages = new Set()
for (const url of pages) {
  const file = url.endsWith('404.html') ? join(dist, '404.html') : fileFor(url)
  if (!existsSync(file)) continue
  for (const match of read(file).matchAll(/property="og:image"[\s\S]{0,4}content="(.*?)"/g)) {
    if (match[1].startsWith(origin)) ogImages.add(match[1].replace(origin, ''))
  }
}
const missingImages = [...ogImages].filter((path) => !existsSync(join(dist, path)))
check('every og:image exists in the build', missingImages.length === 0, missingImages.join(', '))

// ── report ──────────────────────────────────────────────────────────────────
const failed = checks.filter((entry) => !entry.ok)
for (const entry of failed) {
  console.log(`FAIL  ${entry.name}${entry.detail ? ` — ${entry.detail}` : ''}`)
}
console.log(`${checks.length - failed.length}/${checks.length} SEO checks passed across ${pages.length - 1} pages`)
console.log(failed.length === 0 ? 'ALL-OK: the built site is crawler- and search-ready.' : `x ${failed.length} problem(s) above`)
process.exit(failed.length === 0 ? 0 : 1)

// ---------------------------------------------------------------------------
// Build step 3 of 3 — static rendering.
//
// Turns the single-page bundle into a set of real static pages:
//
//   dist/index.html                     →  /            (prerendered home)
//   dist/shop/index.html                →  /shop        (prerendered shop)
//   dist/product/<id>/index.html        →  /product/<id>
//   dist/about|faq|contact/index.html   →  those routes
//   dist/404.html                       →  served by Vercel for unknown URLs
//   dist/sitemap.xml                    →  every indexable URL
//
// Each file carries the route's own <title>, description, canonical, Open
// Graph / Twitter tags, structured data and its real page content, so Google
// and social scrapers see a complete page without executing JavaScript.
//
// Run automatically by `npm run build`; requires the client build (dist/) and
// the SSR bundle (.ssr-build/) to exist.
// ---------------------------------------------------------------------------

import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const dist = join(root, 'dist')
const ssrEntry = join(root, '.ssr-build', 'entry-server.js')
const templateFile = join(dist, 'index.html')

const SEO_START = '<!--seo:start-->'
const SEO_END = '<!--seo:end-->'
/** Everything between the markers (template defaults) is replaced per route. */
const SEO_BLOCK = /<!--seo:start-->[\s\S]*?<!--seo:end-->/
const ROOT_EMPTY = '<div id="root"></div>'

/** Which source file "owns" each route — used for sitemap lastmod dates. */
const ROUTE_SOURCES = {
  '/': 'src/pages/HomePage.tsx',
  '/shop': 'src/pages/ShopPage.tsx',
  '/about': 'src/pages/AboutPage.tsx',
  '/faq': 'src/pages/FAQPage.tsx',
  '/contact': 'src/pages/ContactPage.tsx'
}
const PRODUCT_SOURCE = 'src/data/products.ts'

/** Last commit date for a file, so lastmod reflects real content changes. */
function gitDate(file) {
  try {
    const iso = execFileSync('git', ['log', '-1', '--format=%cI', '--', file], {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim()
    return iso ? iso.slice(0, 10) : null
  } catch {
    return null
  }
}

const buildDate = new Date().toISOString().slice(0, 10)
const dateCache = new Map()
function lastmod(file) {
  if (!dateCache.has(file)) dateCache.set(file, gitDate(file) ?? buildDate)
  return dateCache.get(file)
}

function fail(message) {
  console.error(`\n✗ prerender: ${message}\n`)
  process.exit(1)
}

if (!existsSync(templateFile)) fail('dist/index.html is missing — run the client build first.')
if (!existsSync(ssrEntry)) fail('.ssr-build/entry-server.js is missing — run the SSR build first.')

const template = readFileSync(templateFile, 'utf8')
if (!template.includes(SEO_START) || !template.includes(SEO_END)) {
  fail(`dist/index.html has no ${SEO_START} / ${SEO_END} markers to replace.`)
}
if (!template.includes(ROOT_EMPTY)) {
  fail(`dist/index.html has no empty ${ROOT_EMPTY} element to fill.`)
}

const { render, INDEXABLE_ROUTES, NOT_FOUND_SEO, buildHeadForSeo, headToHtml, SITE_URL } = await import(
  pathToFileURL(ssrEntry).href
)

/** One complete static page: template + this route's head + its markup. */
function page({ path, seo }) {
  const head = buildHeadForSeo(seo)
  const markup = render(path)
  const headBlock = `${SEO_START}\n${headToHtml(head)}\n    ${SEO_END}`
  if (!SEO_BLOCK.test(template)) fail('the SEO marker block in dist/index.html is malformed.')
  return template
    .replace(SEO_BLOCK, headBlock)
    .replace(ROOT_EMPTY, `<div id="root">${markup}</div>`)
}

const written = []

for (const route of INDEXABLE_ROUTES) {
  const target = route.path === '/' ? templateFile : join(dist, route.path.slice(1), 'index.html')
  mkdirSync(dirname(target), { recursive: true })
  writeFileSync(target, page({ path: route.path, seo: route }), 'utf8')
  written.push(route.path)
}

// The 404 shell (Vercel serves dist/404.html with a real 404 status).
writeFileSync(join(dist, '404.html'), page({ path: '/404', seo: NOT_FOUND_SEO }), 'utf8')

// ── sitemap.xml ─────────────────────────────────────────────────────────────
function xmlEscape(value) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

const indexable = INDEXABLE_ROUTES.filter((route) => !route.noindex)
const sitemapEntries = indexable
  .map((route) => {
    const source = route.product ? PRODUCT_SOURCE : ROUTE_SOURCES[route.path] ?? PRODUCT_SOURCE
    const loc = route.path === '/' ? `${SITE_URL}/` : `${SITE_URL}${route.path}`
    return `  <url>
    <loc>${xmlEscape(loc)}</loc>
    <lastmod>${lastmod(source)}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority.toFixed(1)}</priority>
  </url>`
  })
  .join('\n')

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</urlset>
`

writeFileSync(join(dist, 'sitemap.xml'), sitemap, 'utf8')

// ── Keep documentation out of the deployed output ───────────────────────────
// public/images/README.md (and similar) are for developers, not visitors —
// shipping them would put stray files on the live site.
const IMAGE_FILES = /\.(jpe?g|png|gif|webp|avif|svg|ico)$/i
const stripped = []

function stripNonImages(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      stripNonImages(full)
    } else if (!IMAGE_FILES.test(entry)) {
      rmSync(full)
      stripped.push(full.slice(dist.length).replace(/\\/g, '/'))
    }
  }
}

const imagesOut = join(dist, 'images')
if (existsSync(imagesOut)) stripNonImages(imagesOut)

// ── Report ──────────────────────────────────────────────────────────────────
console.log(`\n✓ ${written.length} pages prerendered to static HTML`)
for (const route of indexable) {
  const file = route.path === '/' ? 'index.html' : `${route.path.slice(1)}/index.html`
  console.log(`    ${route.path.padEnd(42)} → dist/${file}`)
}
console.log(`    404.html${' '.repeat(32)} → dist/404.html (noindex, 404 status)`)
console.log(`✓ sitemap.xml — ${indexable.length} URLs submitted by robots.txt`)
if (stripped.length > 0) console.log(`✓ kept out of the deploy: ${stripped.join(', ')}`)

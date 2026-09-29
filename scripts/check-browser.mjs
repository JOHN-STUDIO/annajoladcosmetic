// ---------------------------------------------------------------------------
// Browser-level SEO verification (npm run seo:browser).
//
// check-seo.mjs only reads the static files; this script additionally boots the
// built site in headless Chrome to prove what a visitor/crawler that DOES run
// JavaScript actually ends up with:
//
//   * the prerendered page is served with the right status for every URL,
//   * the SPA takes over WITHOUT duplicating the prerendered markup,
//   * exactly one of every head tag remains after the client app boots
//     (the bug that spawned this script: two JSON-LD blocks, one static and one
//     added by <Seo>, because the static tags were not marked as managed),
//   * clicking around inside the app rewrites the head for each route and never
//     accumulates stale og:*, canonical, robots or schema tags.
//
// Skips (exit 0) when no Chrome/Edge is installed.
// ---------------------------------------------------------------------------
import { execFile } from 'node:child_process'
import { createReadStream, existsSync, mkdirSync, readFileSync, statSync, unlinkSync, writeFileSync } from 'node:fs'
import { createServer } from 'node:http'
import { join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)

const root = fileURLToPath(new URL('..', import.meta.url))
const dist = join(root, 'dist')
const PORT = 4173
const ORIGIN = 'https://www.annajoladcosmetics.app'

const CHROME = [
  join(process.env['ProgramFiles'] ?? 'C:\\Program Files', 'Google', 'Chrome', 'Application', 'chrome.exe'),
  join(process.env['ProgramFiles'] ?? 'C:\\Program Files', 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
  join(process.env['ProgramFiles(x86)'] ?? 'C:\\Program Files (x86)', 'Microsoft', 'Edge', 'Application', 'msedge.exe')
].find((path) => existsSync(path))

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8'
}

/** Vercel-style resolution: exact file → <path>/index.html → 404.html (404). */
function resolveFile(pathname) {
  const clean = normalize(decodeURIComponent(pathname)).replace(/^([/\\])+/, '')
  const candidates = clean === '' ? ['index.html'] : [clean, join(clean, 'index.html')]
  for (const candidate of candidates) {
    const full = join(dist, candidate)
    if (full.startsWith(dist) && existsSync(full) && statSync(full).isFile()) return { file: full, status: 200 }
  }
  const notFound = join(dist, '404.html')
  return { file: existsSync(notFound) ? notFound : null, status: 404 }
}

const results = []
const check = (name, ok, detail = '') => results.push({ name, ok, detail })
const count = (haystack, needle) => haystack.split(needle).length - 1
const decode = (text) =>
  text.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>')

/** Element count inside a --dump-dom document (tags may be written bare or spaced). */
function countTags(dom, tag) {
  return count(dom, `<${tag}>`) + count(dom, `<${tag} `)
}

function dumpDom(url, budget) {
  // Must be ASYNC: the HTTP server runs in this same process, so blocking the
  // event loop here would stop us from answering Chrome's requests.
  return execFileAsync(
    CHROME,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-extensions',
      `--virtual-time-budget=${budget}`,
      '--dump-dom',
      url
    ],
    { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }
  )
    .then((result) => result.stdout)
    // A non-zero exit still carries the DOM we asked for; only a hard failure
    // returns an empty string, which then shows up as failing checks below.
    .catch((error) => error.stdout ?? '')
}

if (!existsSync(dist)) {
  console.log('SKIP: dist/ not found — run `npm run build` first.')
  process.exit(0)
}
if (!CHROME) {
  console.log('SKIP: no Chrome/Edge found — static checks only (`npm run seo:check`).')
  process.exit(0)
}

const server = createServer((request, response) => {
  const url = new URL(request.url, `http://127.0.0.1:${PORT}`)
  const { file, status } = resolveFile(url.pathname)
  if (!file) {
    response.writeHead(404, { 'content-type': 'text/plain' })
    response.end('not found')
    return
  }
  response.writeHead(status, { 'content-type': TYPES[file.slice(file.lastIndexOf('.'))] ?? 'application/octet-stream' })
  createReadStream(file).pipe(response)
})
await new Promise((resolve) => server.listen(PORT, '127.0.0.1', resolve))

const base = `http://127.0.0.1:${PORT}`

try {
  // ── 1. what a crawler sees without running any JavaScript ────────────────
  const raw = await (await fetch(`${base}/shop`)).text()
  check('/shop is prerendered without JS', raw.includes('<title>Shop All Products') && raw.includes('Shop Our Collection'))
  const raw404 = await fetch(`${base}/does-not-exist`)
  check('unknown URL answers HTTP 404', raw404.status === 404, String(raw404.status))
  check('404 page is noindex', (await raw404.text()).includes('noindex'))

  // ── 2. full page loads: prerender + client takeover ──────────────────────
  const pages = [
    { url: '/', title: "Anna J'olad Cosmetics | Handcrafted Lip, Body & Hair Care", bodyOnly: 'Discover Our Story' },
    { url: '/shop', title: 'Shop All Products', bodyOnly: 'Shop Our Collection' },
    { url: '/product/beauty-deep', title: 'Beauty Deep Carrot lotion', bodyOnly: 'Add to Cart' },
    { url: '/about', title: 'About Anna J', bodyOnly: 'Our goal is to make our clients' },
    { url: '/faq', title: 'FAQ |', bodyOnly: 'Frequently Asked Questions' },
    { url: '/contact', title: 'Contact Us', bodyOnly: 'Fastest way to reach us' },
    { url: '/shop?category=Soaps', title: 'Shop All Products', bodyOnly: 'Shop Our Collection' },
    { url: '/does-not-exist', title: 'Page not found', bodyOnly: 'Back home' }
  ]

  for (const page of pages) {
    const is404 = page.url === '/does-not-exist'
    const dom = await dumpDom(`${base}${page.url}`, 6000)
    const title = decode(dom.match(/<title>([^<]*)</)?.[1] ?? '')

    check(`${page.url}: <title> after the SPA boots`, title.startsWith(page.title), title)
    check(`${page.url}: exactly one <h1>`, countTags(dom, 'h1') === 1, `${countTags(dom, 'h1')}`)
    check(`${page.url}: single #root`, count(dom, 'id="root"') === 1, `${count(dom, 'id="root"')}`)
    // Body-only string: proves the live app REPLACED the prerendered markup
    // instead of stacking a second copy on top of it.
    check(
      `${page.url}: prerendered body not duplicated`,
      count(dom, page.bodyOnly) === 1,
      `${count(dom, page.bodyOnly)}x "${page.bodyOnly}"`
    )
    check(
      `${page.url}: single canonical`,
      count(dom, 'rel="canonical"') === (is404 ? 0 : 1),
      `${count(dom, 'rel="canonical"')}`
    )
    check(`${page.url}: single description`, count(dom, 'name="description"') === 1, `${count(dom, 'name="description"')}`)
    check(`${page.url}: single JSON-LD`, count(dom, 'application/ld+json') === 1, `${count(dom, 'application/ld+json')}`)
    check(`${page.url}: single og:title`, count(dom, 'property="og:title"') === 1, `${count(dom, 'property="og:title"')}`)
    check(`${page.url}: single og:image`, count(dom, 'property="og:image"') === 1, `${count(dom, 'property="og:image"')}`)
    check(`${page.url}: single twitter:card`, count(dom, 'name="twitter:card"') === 1, `${count(dom, 'name="twitter:card"')}`)
  }

  const shopDom = await dumpDom(`${base}/shop`, 6000)
  check('/shop links every product', count(shopDom, 'href="/product/') >= 17, `${count(shopDom, 'href="/product/')}`)
  check('/shop filters are real links', shopDom.includes('href="/shop?category=Soaps"'))

  const homeDom = await dumpDom(`${base}/`, 6000)
  check('/: hero picture is preloaded', /rel="preload"[^>]*href="\/images\/hero-1\.jpeg"/.test(homeDom))
  check('/: LCP image is fetchpriority=high', /fetchpriority="high"/.test(homeDom))
  check('/: images declare width and height', /width="1014" height="1080"/.test(homeDom))

  // ── 3. client-side navigation rewrites the head in place ─────────────────
  // A copy of the home page that clicks through the app and records the state
  // of <head> after each hop — deleted again right after the test.
  const navPage = join(dist, '_nav-test.html')
  const navScript = `<script>
window.addEventListener('load', () => {
  setTimeout(async () => {
    const wait = (ms) => new Promise((r) => setTimeout(r, ms))
    const snap = () => ({
      title: document.title,
      canonical: [...document.querySelectorAll('link[rel="canonical"]')].map((el) => el.href),
      ogUrl: [...document.querySelectorAll('meta[property="og:url"]')].map((el) => el.content),
      ogType: [...document.querySelectorAll('meta[property="og:type"]')].map((el) => el.content),
      price: document.querySelectorAll('meta[property="product:price:amount"]').length,
      robots: [...document.querySelectorAll('meta[name="robots"]')].map((el) => el.content),
      jsonLd: document.querySelectorAll('script[type="application/ld+json"]').length,
      jsonLdText: [...document.querySelectorAll('script[type="application/ld+json"]')].map((el) => el.textContent),
      h1: document.querySelectorAll('h1').length
    })
    const out = {}
    document.querySelector('a[href="/shop"]').click()               // → /shop
    await wait(1200)
    out.shop = snap()
    document.querySelector('a[href="/product/beauty-deep"]').click() // → product
    await wait(1200)
    out.product = snap()
    history.pushState({}, '', '/does-not-exist')                    // → in-app 404
    window.dispatchEvent(new PopStateEvent('popstate'))
    await wait(1200)
    out.notFound = snap()
    document.documentElement.setAttribute('data-nav-test', JSON.stringify(out))
  }, 1500)
})
</script>`

  const navPageHtml = readFileSync(join(dist, 'index.html'), 'utf8').replace('</body>', `${navScript}</body>`)
  mkdirSync(dist, { recursive: true })
  writeFileSync(navPage, navPageHtml, 'utf8')

  let nav = null
  try {
    const dom = await dumpDom(`${base}/_nav-test.html`, 20000)
    const match = dom.match(/data-nav-test="([^"]*)"/)
    nav = match ? JSON.parse(decode(match[1])) : null
  } finally {
    unlinkSync(navPage)
  }

  check('navigation test ran', nav !== null, nav === null ? 'no data-nav-test attribute' : '')
  if (nav) {
    check('nav → /shop: title updated', nav.shop.title.startsWith('Shop All Products'), nav.shop.title)
    check('nav → /shop: canonical moved', nav.shop.canonical[0] === `${ORIGIN}/shop`, nav.shop.canonical.join())
    check('nav → /shop: og:url moved', nav.shop.ogUrl.length === 1 && nav.shop.ogUrl[0] === `${ORIGIN}/shop`, nav.shop.ogUrl.join())
    check('nav → /shop: one JSON-LD', nav.shop.jsonLd === 1, `${nav.shop.jsonLd}`)
    check('nav → /shop: schema is an ItemList', nav.shop.jsonLdText.join().includes('ItemList'))
    check('nav → /shop: still exactly one h1', nav.shop.h1 === 1, `${nav.shop.h1}`)

    check(
      'nav → product: og:type is product',
      nav.product.ogType.length === 1 && nav.product.ogType[0] === 'product',
      nav.product.ogType.join()
    )
    check('nav → product: price tag present', nav.product.price === 1, `${nav.product.price}`)
    check('nav → product: canonical moved', nav.product.canonical[0] === `${ORIGIN}/product/beauty-deep`, nav.product.canonical.join())
    check('nav → product: one JSON-LD with Product', nav.product.jsonLd === 1 && nav.product.jsonLdText.join().includes('"Product"'), `${nav.product.jsonLd}`)
    check('nav → product: exactly one h1', nav.product.h1 === 1, `${nav.product.h1}`)

    check('nav → unknown: title becomes 404', nav.notFound.title.startsWith('Page not found'), nav.notFound.title)
    check(
      'nav → unknown: robots is noindex',
      nav.notFound.robots.length === 1 && /noindex/.test(nav.notFound.robots[0]),
      nav.notFound.robots.join()
    )
    check('nav → unknown: canonical removed', nav.notFound.canonical.length === 0, nav.notFound.canonical.join())
    check('nav → unknown: one JSON-LD', nav.notFound.jsonLd === 1, `${nav.notFound.jsonLd}`)
  }
} finally {
  server.close()
}

const failed = results.filter((entry) => !entry.ok)
for (const entry of failed) console.log(`FAIL  ${entry.name}${entry.detail ? ` — ${entry.detail}` : ''}`)
console.log(`${results.length - failed.length}/${results.length} browser checks passed`)
console.log(
  failed.length === 0
    ? 'ALL-OK: prerender + SPA takeover verified in a real browser.'
    : `x ${failed.length} problem(s)`
)
process.exit(failed.length === 0 ? 0 : 1)



// ---------------------------------------------------------------------------
// Static-rendering entry (used only by scripts/prerender.mjs at build time).
//
// `npm run build` renders every indexable route through this file and writes
// the result into dist/<route>/index.html, so each URL ships with its own real
// <head> AND its real page content — crawlers and social scrapers never have to
// run JavaScript.
//
// The browser app is unchanged: main.tsx still mounts the same <App /> and the
// live page takes over as soon as the bundle loads.
// ---------------------------------------------------------------------------

import { renderToStaticMarkup } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import App from './App'
import { INDEXABLE_ROUTES, NOT_FOUND_SEO, getRouteSeo, SITE_URL } from './seo/routes'
import { buildHead, buildHeadForSeo, headToHtml } from './seo/head'
import { site } from './data/site'

/** Markup for one route, as a static HTML string. */
export function render(path: string): string {
  return renderToStaticMarkup(
    <StaticRouter location={path}>
      <App />
    </StaticRouter>
  )
}

/** Everything the prerender script needs, exported from one place. */
export { INDEXABLE_ROUTES, NOT_FOUND_SEO, getRouteSeo, SITE_URL, buildHead, buildHeadForSeo, headToHtml, site }

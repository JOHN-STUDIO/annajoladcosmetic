# Anna J'olad Cosmetics — Website

Official website for **Anna J'olad Cosmetics**, built with **React 19 · Vite 8 ·
TypeScript · Tailwind CSS v4 · React Router v7**.

A product showcase with a fully working cart and **WhatsApp ordering** — no
online payment system needed.

---

## Quick start

```bash
npm install      # install dependencies
npm run dev      # local dev server  ->  http://localhost:5173
npm run build    # typecheck + production build  ->  dist/
npm run preview  # preview the production build
```

> **Windows note:** if PowerShell blocks `npm` (execution-policy error about
> `npm.ps1`), use `npm.cmd run dev` instead, or set your user policy once with
> `Set-ExecutionPolicy -Scope User Bypass`.

---

## Pages & routes

| Route            | Page                          |
| ---------------- | ----------------------------- |
| `/`              | Home                          |
| `/shop`          | Shop (with category filters)  |
| `/product/:id`   | Product details               |
| `/about`         | About the brand               |
| `/faq`           | FAQ (accordion)               |
| `/contact`       | Contact                       |
| `*`              | 404 page                      |

---

## Where to edit content

All content is centralised — edit data, not components:

| Content | File |
| ------- | ---- |
| Brand name, hero copy, WhatsApp number, email, Instagram, address, hours | `src/data/site.ts` |
| Products, prices, descriptions, images | `src/data/products.ts` |
| Testimonials | `src/data/testimonials.ts` |
| FAQ questions/answers | `src/data/faq.ts` |
| Colours & fonts | `tailwind.config.ts` |

### WhatsApp number (IMPORTANT)

Change **one value** in `src/data/site.ts`:

```ts
whatsappNumber: '2348000000000', // ← your real number, digits only
```

### Products & images

- Product catalogue: `src/data/products.ts`
- Drop photos in `public/images/products/<id>.jpg` (see `public/images/README.md`).
- Missing images show an elegant placeholder automatically.

### Link preview (WhatsApp / social shares)

When your link is pasted anywhere, the preview picture comes from
`public/images/metatag.jpg` (swap the file anytime — same name, no code edits).
The meta tags live at the top of `index.html` (there is a comment block there
with full instructions).

**Moving to a real custom domain later?** The preview picture keeps working
automatically (it's served by Vercel, which stays live next to your domain).
To also show *your* domain in the shared link, update these **three** meta tags
in `index.html` (`og:url`, `og:image`, `twitter:image` — the only three URLs in
that file):

1. `og:url` → `https://your-domain.com/`
2. `og:image` → `https://your-domain.com/images/metatag.jpg`
3. `twitter:image` → `https://your-domain.com/images/metatag.jpg`

Then redeploy, and clear the cached preview once at
<https://developers.facebook.com/tools/debug/> (this also refreshes WhatsApp).

---

## Architecture

```
src/
├── main.tsx                  # entry (BrowserRouter bootstraps the app)
├── App.tsx                   # routes, layout, page-fade transition
├── index.css                 # Tailwind import + custom animation/a11y layers
├── types/index.ts            # Product, CartLine, Testimonial, FaqItem, …
├── data/                     # site, products, testimonials, faq (editable)
├── utils/                    # formatCurrency, whatsapp (order message builder)
├── context/CartContext.tsx   # working cart state (context + localStorage)
├── components/
│   ├── layout/               # Navbar, Footer, ScrollToTop
│   ├── ui/                   # Button, SectionHeading, PageHeader, Seo, Reveal, icons…
│   ├── product/              # ProductCard, ProductGrid, ProductImage
│   ├── cart/                 # CartDrawer, CartItemRow
│   ├── whatsapp/WhatsAppButton.tsx
│   ├── faq/FAQItem.tsx
│   ├── home/                 # Hero, HowItWorks, FeaturedProducts, …
│   └── testimonials/TestimonialCard.tsx
└── pages/                    # Home, Shop, ProductDetails, About, FAQ, Contact, 404
```

---

## Features

- **Working cart** — add, update quantities, remove, clear, subtotals, persisted
  to localStorage, accessible from the navbar on every page.
- **WhatsApp ordering** — cart and product pages build a pre-filled, URL-encoded
  order message (items, quantities, line totals, grand total) and open
  `https://wa.me/<number>?text=…`.
- **Responsive** — designed for 320px → 1440px+ (mobile menu, adaptive grids,
  reflowing product layouts).
- **Accessible** — semantic HTML, labelled buttons, keyboard navigation, focus
  rings, ARIA accordion/dialog, `prefers-reduced-motion` support.
- **SEO** — per-page titles and meta descriptions via `Seo`.
- **Performance** — lazy-loaded images, no icon/CDN dependencies, small custom
  utilities only.
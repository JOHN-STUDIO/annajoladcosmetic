// ---------------------------------------------------------------------------
// SINGLE SOURCE OF TRUTH for business identity, contact info and hero copy.
//
// Replace the TODO placeholders with the brand's real details before launch.
// ---------------------------------------------------------------------------

export const site = {
  brandName: "Anna J'olad Cosmetics",
  shortName: "Anna J'olad",

  // Brand logo — drop the file at:  public/images/logo.jpeg
  // Until the file exists, the site shows the text wordmark instead (no broken image).
  logo: '/images/logo.png',

  tagline: 'Beauty Essentials Made for Your Everyday Glow',

  // Business WhatsApp number for ordering — digits only (country code + number, no "+").
  // Update here if it ever changes; the whole site references this one value.
  whatsappNumber: '2348032324015',

  // TODO: Replace contact placeholders.
  email: 'annajoladcosmetics@gmail.com',
  instagram: {
    handle: 'annajoladcosmetics',
    url: 'https://www.instagram.com/annajoladcosmetics'
  },
  tiktok: {
    handle: 'annajoladcosmetics',
    url: 'https://www.tiktok.com/@annajoladcosmetics'
  },

  hero: {
    headline: 'Beauty Essentials Made for Your Everyday Glow'
  },

  // Hero slideshow (home page) — 3 or 4 photos, each shown for `heroSlideMs`,
  // then it crossfades to the next and keeps looping.
  // Drop the photos into public/images/ using these exact names:
  //   hero-1.jpeg  hero-2.jpeg  hero-3.jpeg  hero-4.jpeg
  // Using only 3 photos? Delete the 4th line. Missing files are skipped
  // automatically — if none exist yet, the placeholder box is shown.
  heroImages: [
    '/images/hero-1.jpeg',
    '/images/hero-2.jpeg',
    '/images/hero-3.jpeg',
    '/images/hero-4.jpeg'
  ],
  heroSlideMs: 3000,

  // Founder photo + About-the-brand writeup (About page).
  // Drop the founder photo at: public/images/founder.jpeg
  founder: {
    image: '/images/founder.jpeg',
    name: "Anna J'olad", // ← placeholder — replace with the founder's real name
    role: 'Founder, Anna J\'olad Cosmetics'
  },

  // About-the-brand writeup (About page) — edit the paragraphs here.
  aboutBrand: [
    "Anna J'olad Cosmetics is a company that makes products for the skin, body, and hair. This company was birthed out of the need to make products, but not any products, ones that are very safe to use, non harmful, and best of all. Natural!",
    'Recognising the need to treat our bodies with tender loving care, we as a company want to champion this cause with the great assist of nature and Natural science to obtain the best products by formulating them to be good, eco friendly, durable and efficient with no side effects.',
    'Our goal is to make our clients/customers trust in our products enough to pass this trust further down to many generations.'
  ]
} as const
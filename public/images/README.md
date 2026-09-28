# Product & brand images

Drop the real images here and the site picks them up automatically. The
`/public` folder is served at the site root, so file `public/images/hero.jpeg`
appears at `/images/hero.jpeg` — exactly where each component already looks for it.

## Files expected by the site

| Place in this folder             | Used by              |
| -------------------------------- | -------------------- |
| `logo.png`                       | Navbar, mobile menu, footer (brand logo) |
| `hero-1.jpeg` … `hero-4.jpeg` | Home hero slideshow (3–4 photos, 3s each) |
| `founder.jpeg`                   | About page — founder circle |
| `metatag.jpg`                    | Link previews (WhatsApp / Facebook / X) — must stay **1200×630** |

> `metatag.jpg` is the link-preview banner. Keep the 1200×630 (1.91:1) shape:
> that ratio is what makes WhatsApp show the big picture *above* the text, and
> the banner must be the picture itself — cropped to that shape, with no
> blurred/letterboxed background filling the gaps.
> Regenerate it from the master photo with
> `powershell -ExecutionPolicy Bypass -File scripts\make-og-image.ps1`
> (master stays in `scripts/metatag-source.jpg`, outside the deployed folder).
> Add `-Top <row>` to choose which horizontal slice of the photo the crop keeps
> (default `25` = keep the subject's whole head, product row running off the
> bottom; `-Top 110` shows more of the product row and trims the crown).


Product image filenames match each product's `id` field in `src/data/products.ts`:

**Creams — Hair Cream**
- `Hair beauty natural cosmetics.jpg` — Hair Bestie hair cream

**Creams — Body lotion**
- `Beauty Deep.jpeg` — Beauty Deep Carrot lotion

**Lip Care — Lipglosses**
- `cherry-my-love.jpeg` — Cherry my love
- `yummy-brownie.jpeg` — Yummy Brownie
- `strawberry-kiss.jpeg` — Strawberry Kiss
- `berry-purple.jpeg` — Berry purple
- `orange-squash.jpeg` — Orange Squash
- `peachy-gum-gum.jpeg` — Peachy gum gum
- `sugar-rush.jpeg` — Sugar Rush

**Lip Care — Lip scrubs**
- `plain-lip-scrub.jpeg` — Plain
- `pink-tinted-lip-scrub.jpeg` — Tinted

**Lip Care — Lip balm**
- `Lip balm.jpeg` — Lip balm

**Soaps**
- `papaya-leaf-soap.jpeg` — Papaya leaf
- `coffee-cocoa-goat-milk-soap.jpeg` — Coffee, cocoa, and goat milk
- `turmeric-goat-milk-soap.jpeg` — Turmeric and goat milk soap
- `fresh-glow-soap.jpeg` — Fresh glow
- `Mango and orange peel soap.jpeg` — Mango and orange peel soap

**Site-wide banner**
- `products/products in the pipeline.jpeg` — "Products in the pipeline" banner (shown above the footer on every page)

A 4:5 (portrait) crop works best for product photos. While a file is missing,
the site displays an elegant built-in placeholder — no broken images.

> To point a product at a different file (e.g. a webp), change the `image`
> field on that product in `src/data/products.ts`.
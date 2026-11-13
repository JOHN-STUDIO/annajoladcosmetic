// ---------------------------------------------------------------------------
// GENERATED FILE — do not edit by hand.
//
// Real pixel dimensions of every picture in public/images, read straight from
// the image headers by scripts/generate-image-meta.mjs (runs automatically as
// part of `npm run build`; refresh on demand with `npm run images:meta`).
//
// Why it exists: an <img> with width/height lets the browser reserve the right
// space before the file arrives, which removes the layout shift (CLS) that
// hurts Core Web Vitals. The same numbers feed og:image:width/height so social
// previews are rendered at the correct size instead of being guessed.
// ---------------------------------------------------------------------------

export interface ImageSize {
  width: number
  height: number
}

export const imageDimensions: Record<string, ImageSize> = {
  "/images/founder.jpeg": { width: 1040, height: 1080 },
  "/images/hero-1.jpeg": { width: 1014, height: 1080 },
  "/images/hero-2.jpeg": { width: 1080, height: 1080 },
  "/images/hero-3.jpeg": { width: 1080, height: 796 },
  "/images/hero-4.jpeg": { width: 1024, height: 572 },
  "/images/logo.png": { width: 1700, height: 925 },
  "/images/metatag.jpg": { width: 1200, height: 630 },
  "/images/products/Beauty Deep.jpeg": { width: 1080, height: 796 },
  "/images/products/Blue Dream.jpeg": { width: 1024, height: 1024 },
  "/images/products/Daisy Marc Jacobs- 1.jpeg": { width: 500, height: 500 },
  "/images/products/Hair beauty natural cosmetics.jpg": { width: 1299, height: 1211 },
  "/images/products/Lip balm.jpeg": { width: 1080, height: 1080 },
  "/images/products/Mango and orange peel soap.jpeg": { width: 1080, height: 809 },
  "/images/products/Ophylia perfume.jpeg": { width: 1024, height: 1024 },
  "/images/products/Supremacy Collector's Edition Pour Homme- 1.jpeg": { width: 1080, height: 1080 },
  "/images/products/Supremacy Collector's Edition Pour Homme- 2.jpeg": { width: 1200, height: 790 },
  "/images/products/Yara Candy by Lattafa.jpeg": { width: 1127, height: 1024 },
  "/images/products/berry-purple.jpeg": { width: 809, height: 1080 },
  "/images/products/cherry-my-love.jpeg": { width: 681, height: 1080 },
  "/images/products/coffee-cocoa-goat-milk-soap.jpeg": { width: 1012, height: 1080 },
  "/images/products/delina-exclusif-1.jpeg": { width: 500, height: 500 },
  "/images/products/delina-exclusif-2.jpeg": { width: 1186, height: 737 },
  "/images/products/fresh-glow-soap.jpeg": { width: 1024, height: 572 },
  "/images/products/lattafa-dukhan-1.jpeg": { width: 1024, height: 1024 },
  "/images/products/lattafa-dukhan-2.jpeg": { width: 1200, height: 725 },
  "/images/products/lovely-by-sjp-1.jpeg": { width: 447, height: 447 },
  "/images/products/lovely-by-sjp-2.jpeg": { width: 1197, height: 744 },
  "/images/products/mousuf-1.jpeg": { width: 1080, height: 1080 },
  "/images/products/orange-squash.jpeg": { width: 1024, height: 768 },
  "/images/products/papaya-leaf-soap.jpeg": { width: 899, height: 1080 },
  "/images/products/peachy-gum-gum.jpeg": { width: 809, height: 1080 },
  "/images/products/pink-tinted-lip-scrub.jpeg": { width: 1008, height: 756 },
  "/images/products/plain-lip-scrub.jpeg": { width: 1008, height: 756 },
  "/images/products/portrait-cafe-noir-1.jpeg": { width: 1024, height: 1024 },
  "/images/products/portrait-cafe-noir-2.jpeg": { width: 1200, height: 739 },
  "/images/products/products in the pipeline.jpeg": { width: 1080, height: 864 },
  "/images/products/strawberry-kiss.jpeg": { width: 621, height: 953 },
  "/images/products/sugar-rush.jpeg": { width: 1080, height: 810 },
  "/images/products/turmeric-goat-milk-soap.jpeg": { width: 1080, height: 728 },
  "/images/products/yummy-brownie.jpeg": { width: 767, height: 864 },
}

/** Dimensions of a picture in /public, or undefined if it isn't catalogued. */
export function getImageSize(src: string): ImageSize | undefined {
  return imageDimensions[src]
}

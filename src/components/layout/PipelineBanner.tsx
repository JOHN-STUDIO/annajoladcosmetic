import ProductImage from '../product/ProductImage'
import Reveal from '../ui/Reveal'

/**
 * Site-wide "Products in the pipeline" banner, shown just above the footer on
 * every page. Contains only the picture and the write-up — no product listings.
 * The write-up sits above the picture on mobile; on desktop they sit side by
 * side (picture left, write-up right).
 *
 * Image: drop /public/images/products/products in the pipeline.jpeg
 */
export default function PipelineBanner() {
  return (
    <section aria-labelledby="pipeline-title" className="border-t border-line bg-bone-50">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <Reveal>
          <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
            {/* Write-up — first in the DOM so it sits above the picture on mobile */}
            <div className="text-center lg:order-2 lg:text-left">
              <h2
                id="pipeline-title"
                className="font-display text-3xl font-bold leading-tight text-ink sm:text-4xl"
              >
                Products in the pipeline
              </h2>
            </div>

            {/* Picture — natural framing, so the whole image shows on every screen */}
            <div className="overflow-hidden rounded-[8px] border border-line shadow-card lg:order-1">
              <ProductImage
                src="/images/products/products in the pipeline.jpeg"
                alt="Products in the pipeline"
                aspect="aspect-[5/4]"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
import Button from '../ui/Button'
import HeroSlideshow from './HeroSlideshow'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-bone-50">
      <div className="mx-auto grid max-w-7xl items-center gap-7 px-4 py-7 min-[400px]:gap-8 min-[400px]:py-9 min-[480px]:py-14 sm:px-6 lg:grid-cols-2 lg:gap-10 lg:px-8 lg:py-24">
        {/* Image area — auto-rotating slideshow of 3–4 photos (3s each).
            Photos are configured in src/data/site.ts → heroImages and live in
            /public/images/ as hero-1.jpeg … hero-4.jpeg. */}
        <div className="relative order-1 lg:order-2 lg:pl-4">
          <div
            aria-hidden="true"
            className="absolute inset-[-0.75rem] rounded-[16px] bg-blush-100 min-[480px]:inset-[-1.25rem] min-[480px]:rounded-[24px]"
          />
          <HeroSlideshow />
        </div>

        {/* Copy — below the image on mobile */}
        <div className="order-2 max-w-xl lg:order-1">
          <h1
            className="hero-enter font-display text-[1.625rem] font-bold leading-[1.15] text-ink min-[400px]:text-[1.875rem] min-[480px]:text-4xl sm:text-5xl sm:leading-tight"
            style={{ animationDelay: '40ms' }}
          >
            Beauty Essentials Made for Your <em className="italic text-burgundy-700">Everyday Glow</em>
          </h1>

          <div
            className="hero-enter mt-6 flex flex-col gap-3 min-[480px]:mt-9 min-[480px]:flex-row min-[480px]:flex-wrap"
            style={{ animationDelay: '130ms' }}
          >
            <Button to="/shop" variant="primary" size="lg" className="w-full justify-center min-[480px]:w-auto">
              Shop Collection
            </Button>
            <Button to="/about" variant="outline" size="lg" className="w-full justify-center min-[480px]:w-auto">
              Discover Our Story
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
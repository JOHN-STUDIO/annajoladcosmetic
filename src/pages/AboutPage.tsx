import { site } from '../data/site'
import Seo from '../components/ui/Seo'
import PageHeader from '../components/ui/PageHeader'
import Reveal from '../components/ui/Reveal'
import ProductImage from '../components/product/ProductImage'
import TestimonialsSection from '../components/home/TestimonialsSection'

export default function AboutPage() {
  return (
    <>
      <Seo
        title="About | Anna J'olad Cosmetics"
        description="Anna J'olad Cosmetics makes safe, natural, non-harmful products for the skin, body and hair — formulated with nature and natural science."
      />
      <PageHeader title={`Welcome to ${site.brandName}`} />

      {/* About the brand — founder portrait + speech */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 lg:grid-cols-2 lg:px-8">
          <Reveal>
            <div className="relative mx-auto w-60 sm:w-72 lg:w-80">
              <div
                aria-hidden="true"
                className="absolute inset-[-1.25rem] rounded-full border-2 border-burgundy-300"
              />
              <ProductImage
                src={site.founder.image}
                alt="The founder of Anna J'olad Cosmetics"
                aspect="aspect-square"
                fit="contain"
                className="relative aspect-square rounded-full border border-line shadow-card"
              />
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="max-w-xl">
              <div className="space-y-5 border-l-2 border-burgundy-200 pl-6 sm:pl-8">
                {site.aboutBrand.map((paragraph) => (
                  <p key={paragraph.slice(0, 32)} className="leading-relaxed text-ink/85">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <TestimonialsSection />
    </>
  )
}
import { getCategories, products } from '../../data/products'
import Button from '../ui/Button'
import Reveal from '../ui/Reveal'

/** Home-page section presenting the three product categories. */
export default function CategoryShowcase() {
  const categories = getCategories()

  return (
    <section className="bg-bone-100 py-14 min-[480px]:py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">
              Our Collections
            </h2>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-5 min-[480px]:mt-14 min-[480px]:gap-8 md:grid-cols-3">
          {categories.map((category, index) => {
            const count = products.filter((product) => product.category === category).length
            return (
              <Reveal key={category} delay={index * 80}>
                <article className="flex h-full flex-col rounded-[8px] border border-line bg-bone-50 p-8 shadow-card transition-shadow duration-300 hover:shadow-lift">
                  <h3 className="font-display text-2xl font-bold text-ink sm:text-3xl">
                    {category}
                  </h3>
                  <p className="mt-2 text-sm text-muted">
                    {count} product{count === 1 ? '' : 's'}
                  </p>
                  <div className="mt-auto pt-8">
                    <Button
                      to={`/shop?category=${encodeURIComponent(category)}`}
                      variant="primary"
                      className="w-full justify-center"
                      ariaLabel={`View products in ${category}`}
                    >
                      View Products
                    </Button>
                  </div>
                </article>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
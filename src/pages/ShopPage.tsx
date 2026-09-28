import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import type { Category } from '../types'
import { products, getCategories, getSections } from '../data/products'
import { collectionIntros } from '../data/collections'
import Seo from '../components/ui/Seo'
import PageHeader from '../components/ui/PageHeader'
import ProductGrid from '../components/product/ProductGrid'
import CollectionIntro from '../components/product/CollectionIntro'
import Reveal from '../components/ui/Reveal'

export default function ShopPage() {
  const categories = getCategories()
  const location = useLocation()
  const requested = new URLSearchParams(location.search).get('category')

  const initialActive: string =
    requested && categories.includes(requested as Category) ? requested : 'All'

  const [active, setActive] = useState<string>(initialActive)

  // Keep the filter in sync when arriving via /shop?category=… links.
  useEffect(() => {
    setActive(initialActive)
  }, [requested])

  const visible = active === 'All' ? products : products.filter((product) => product.category === active)

  return (
    <>
      <Seo
        title="Shop | Anna J'olad Cosmetics"
        description="Browse lip glosses, soaps, body crèmes, hair crèmes, lip scrubs and balms from Anna J'olad Cosmetics. Order easily on WhatsApp."
      />
      <PageHeader title="Shop Our Collection" />

      <section className="bg-bone-50 py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2.5" role="group" aria-label="Filter products by category">
            {['All', ...categories].map((category) => (
              <button
                key={category}
                type="button"
                aria-pressed={active === category}
                onClick={() => setActive(category)}
                className={`rounded-[2px] border px-4.5 py-2.5 font-sans text-[13px] font-semibold uppercase tracking-[0.06em] transition-colors ${
                  active === category
                    ? 'border-burgundy-700 bg-burgundy-700 text-bone-100'
                    : 'border-line bg-bone-50 text-ink hover:border-burgundy-400 hover:text-burgundy-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <p className="mt-6 text-sm text-muted" aria-live="polite">
            {visible.length} product{visible.length === 1 ? '' : 's'}
            {active !== 'All' ? ` in ${active}` : ''}
          </p>

          {active === 'Creams' || active === 'Lip Care' ? (
            // Creams & Lip Care are presented in their sub-sections, in order.
            <div className="mt-10 space-y-14">
              {getSections(active).map((section) => {
                const headingId = `${active === 'Creams' ? 'cream' : 'lip'}-section-${section.title
                  .toLowerCase()
                  .replace(/\s+/g, '-')}`
                return (
                  <section key={section.title} aria-labelledby={headingId}>
                    <h2 id={headingId} className="font-display text-2xl font-bold text-ink sm:text-3xl">
                      {section.title}
                    </h2>
                    {section.title === 'Lipglosses' ? (
                      <CollectionIntro intro={collectionIntros.Lipglosses} className="mt-5" />
                    ) : null}
                    {section.products.length > 0 ? (
                      <Reveal>
                        <div className="mt-8">
                          <ProductGrid products={section.products} />
                        </div>
                      </Reveal>
                    ) : (
                      <p className="mt-8 rounded-[8px] border border-dashed border-line bg-bone-200 px-6 py-10 text-center text-sm text-muted">
                        Coming soon — our {section.title.toLowerCase()} are on the way. Watch this space!
                      </p>
                    )}
                  </section>
                )
              })}
            </div>
          ) : (
            <div className="mt-10">
              {active === 'Soaps' ? (
                <Reveal>
                  <CollectionIntro intro={collectionIntros.Soaps} className="mb-10" />
                </Reveal>
              ) : null}
              <Reveal>
                <ProductGrid products={visible} />
              </Reveal>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
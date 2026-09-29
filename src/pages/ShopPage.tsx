import { useLocation, Link } from 'react-router-dom'
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

  // The URL is the single source of truth for the active filter, so a filtered
  // view can be linked to, shared and crawled — and the tabs are real links.
  const active: string =
    requested && categories.includes(requested as Category) ? requested : 'All'
  const filterHref = (category: string): string =>
    category === 'All' ? '/shop' : `/shop?category=${encodeURIComponent(category)}`

  const visible = active === 'All' ? products : products.filter((product) => product.category === active)

  return (
    <>
      <Seo path="/shop" />
      <PageHeader
        kicker="Made in small batches"
        title="Shop Our Collection"
        lead={`${products.length} handcrafted products across ${categories.join(', ')} — add what you love to your cart and send the finished order to us on WhatsApp.`}
      />

      <section className="bg-bone-50 py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2.5" role="group" aria-label="Filter products by category">
            {['All', ...categories].map((category) => (
              <Link
                key={category}
                to={filterHref(category)}
                aria-current={active === category ? 'page' : undefined}
                className={`rounded-[2px] border px-4.5 py-2.5 font-sans text-[13px] font-semibold uppercase tracking-[0.06em] transition-colors ${
                  active === category
                    ? 'border-burgundy-700 bg-burgundy-700 text-bone-100'
                    : 'border-line bg-bone-50 text-ink hover:border-burgundy-400 hover:text-burgundy-700'
                }`}
              >
                {category}
              </Link>
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
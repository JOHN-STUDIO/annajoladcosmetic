import Seo from '../components/ui/Seo'
import Button from '../components/ui/Button'

export default function NotFoundPage() {
  return (
    <>
      {/* Unknown URLs get the 404 metadata (noindex) from src/seo/routes.ts */}
      <Seo />
      <section className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 py-24 text-center">
        <p className="font-display text-7xl font-bold text-burgundy-300">404</p>
        <h1 className="font-display text-3xl font-bold text-ink">This page has wandered off</h1>
        <p className="max-w-md text-sm leading-relaxed text-muted">
          The page you're looking for doesn't exist or has moved. Let's get you back to the pretty things.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button to="/" variant="primary" size="lg">
            Back home
          </Button>
          <Button to="/shop" variant="outline" size="lg">
            Shop the collection
          </Button>
        </div>
      </section>
    </>
  )
}
import Seo from '../components/ui/Seo'
import Hero from '../components/home/Hero'
import HowItWorks from '../components/home/HowItWorks'
import CategoryShowcase from '../components/home/CategoryShowcase'
import TestimonialsSection from '../components/home/TestimonialsSection'

export default function HomePage() {
  return (
    <>
      <Seo
        title="Anna J'olad Cosmetics | Beauty & Self-Care Essentials"
        description="Handcrafted lip, body and hair essentials made in small batches. Shop the collection and order easily on WhatsApp."
      />
      <Hero />
      <HowItWorks />
      <CategoryShowcase />
      <TestimonialsSection />
    </>
  )
}
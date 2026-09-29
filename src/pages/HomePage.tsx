import Seo from '../components/ui/Seo'
import Hero from '../components/home/Hero'
import HowItWorks from '../components/home/HowItWorks'
import CategoryShowcase from '../components/home/CategoryShowcase'
import TestimonialsSection from '../components/home/TestimonialsSection'

export default function HomePage() {
  return (
    <>
      <Seo path="/" />
      <Hero />
      <HowItWorks />
      <CategoryShowcase />
      <TestimonialsSection />
    </>
  )
}
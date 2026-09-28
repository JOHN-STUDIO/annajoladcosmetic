import { testimonials } from '../../data/testimonials'
import TestimonialCard from '../testimonials/TestimonialCard'
import Reveal from '../ui/Reveal'

export default function TestimonialsSection() {
  const visible = testimonials.slice(0, 3)

  return (
    <section className="bg-bone-100 py-14 min-[480px]:py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">
              Testimonials
            </h2>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-5 min-[480px]:mt-14 min-[480px]:gap-8 md:grid-cols-3">
          {visible.map((testimonial, index) => (
            <Reveal key={testimonial.id} delay={index * 80}>
              <TestimonialCard testimonial={testimonial} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
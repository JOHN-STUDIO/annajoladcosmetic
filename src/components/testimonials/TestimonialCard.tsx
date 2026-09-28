import type { Testimonial } from '../../types'

interface TestimonialCardProps {
  testimonial: Testimonial
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <figure className="flex flex-col rounded-[8px] border border-line bg-bone-50 p-5 shadow-card sm:p-7">
      <p aria-hidden="true" className="text-burgundy-400">
        <span className="font-display text-2xl leading-none">“</span>
      </p>
      <blockquote className="mt-3 font-display text-[15px] italic leading-relaxed text-ink/90">
        {testimonial.quote}
      </blockquote>
      <figcaption className="mt-5 border-t border-line pt-3">
        <p className="font-sans text-sm font-bold text-ink">{testimonial.name}</p>
        {testimonial.product ? (
          <p className="mt-0.5 text-xs text-muted">Purchased · {testimonial.product}</p>
        ) : null}
      </figcaption>
    </figure>
  )
}
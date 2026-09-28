import Reveal from '../ui/Reveal'

const STEPS = [
  {
    title: 'Browse the collection',
    text: 'Explore our lip, body and hair essentials, plus handcrafted soaps — everything is shown with clear prices and descriptions.'
  },
  {
    title: 'Add to your cart',
    text: 'Tap “Add” on any product. Adjust quantities in the cart anytime — your selection is saved as you go.'
  },
  {
    title: 'Order on WhatsApp',
    text: 'Open your cart and tap “Order via WhatsApp”. Your full order arrives as a ready-made message — you simply hit send.'
  }
]

export default function HowItWorks() {
  return (
    <section className="bg-blush-100 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">
              Three steps to your order
            </h2>
          </div>
        </Reveal>

        <ol className="mt-10 grid gap-5 min-[480px]:mt-14 min-[480px]:gap-8 sm:grid-cols-3">
          {STEPS.map((step, index) => (
            <Reveal key={step.title} delay={index * 90}>
              <li className="relative rounded-[8px] border border-line bg-bone-50 p-6 sm:p-8">
                <span className="absolute -top-3.5 left-6 grid size-7 place-items-center rounded-full bg-burgundy-700 font-sans text-xs font-extrabold text-bone-100">
                  {index + 1}
                </span>
                <h3 className="font-display text-xl font-bold text-ink">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{step.text}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
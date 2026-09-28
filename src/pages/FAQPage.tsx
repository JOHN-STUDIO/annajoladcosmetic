import { useState } from 'react'
import { faqItems } from '../data/faq'
import Seo from '../components/ui/Seo'
import PageHeader from '../components/ui/PageHeader'
import FAQItem from '../components/faq/FAQItem'
import Reveal from '../components/ui/Reveal'

export default function FAQPage() {
  // Single open item at a time — keeps the page tidy and focused.
  const [openId, setOpenId] = useState<string | null>(faqItems.length > 0 ? faqItems[0].id : null)

  return (
    <>
      <Seo
        title="FAQ | Anna J'olad Cosmetics"
        description="How WhatsApp ordering works, delivery times, product questions and how to contact Anna J'olad Cosmetics."
      />
      <PageHeader title="Frequently Asked Questions" />

      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="space-y-3.5">
              {faqItems.map((item) => (
                <FAQItem
                  key={item.id}
                  item={item}
                  isOpen={item.id === openId}
                  onToggle={(id) => setOpenId(openId === id ? null : id)}
                />
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
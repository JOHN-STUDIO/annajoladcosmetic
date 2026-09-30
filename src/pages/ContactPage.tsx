import { site } from '../data/site'
import Seo from '../components/ui/Seo'
import PageHeader from '../components/ui/PageHeader'
import Reveal from '../components/ui/Reveal'
import Button from '../components/ui/Button'
import {
  WhatsAppIcon,
  InstagramIcon,
  TikTokIcon,
  MailIcon
} from '../components/ui/icons'

const CONTACT_METHODS = [
  {
    key: 'whatsapp',
    title: 'WhatsApp',
    label: 'Fastest way to reach us',
    value: 'Chat with us now',
    href: `https://wa.me/${site.whatsappNumber}`,
    external: true
  },
  {
    key: 'instagram',
    title: 'Instagram',
    label: 'Follow our drops & restocks',
    value: site.instagram.handle,
    href: site.instagram.url,
    external: true
  },
  {
    key: 'tiktok',
    title: 'TikTok',
    label: 'Watch us in action',
    value: site.tiktok.handle,
    href: site.tiktok.url,
    external: true
  },
  {
    key: 'email',
    title: 'Email',
    label: 'For longer questions',
    value: site.email,
    href: `mailto:${site.email}`,
    external: false
  }
]

export default function ContactPage() {
  return (
    <>
      <Seo path="/contact" />
      <PageHeader title="Contact Us" />

      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {CONTACT_METHODS.map((method, index) => (
              <Reveal key={method.key} delay={index * 70}>
                <a
                  href={method.href}
                  target={method.external ? '_blank' : undefined}
                  rel={method.external ? 'noreferrer' : undefined}
                  className="group flex flex-col rounded-[8px] border border-line bg-bone-50 p-8 transition-colors hover:border-burgundy-500"
                >
                  <span className="grid size-12 place-items-center rounded-full border border-line text-burgundy-600 group-hover:text-burgundy-700">
                    {method.key === 'whatsapp' ? <WhatsAppIcon size={22} className="text-whatsapp" /> : null}
                    {method.key === 'instagram' ? <InstagramIcon size={22} /> : null}
                    {method.key === 'tiktok' ? <TikTokIcon size={22} className="text-ink" /> : null}
                    {method.key === 'email' ? <MailIcon size={22} /> : null}
                  </span>
                  <h2 className="mt-4 font-display text-xl font-bold text-ink">{method.title}</h2>
                  <p className="mt-1 text-sm text-muted">{method.label}</p>
                  <p className="mt-3 text-sm font-bold text-burgundy-700 underline-offset-2 underline decoration-burgundy-300">
                    {method.value}
                  </p>
                </a>
              </Reveal>
            ))}
          </div>

          {/* Primary CTA */}
          <Reveal>
            <div className="mx-auto mt-14 max-w-2xl text-center">
              <Button
                href={`https://wa.me/${site.whatsappNumber}`}
                variant="whatsapp"
                size="lg"
                target="_blank"
                rel="noreferrer"
              >
                <WhatsAppIcon size={20} />
                Chat With Us on WhatsApp
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
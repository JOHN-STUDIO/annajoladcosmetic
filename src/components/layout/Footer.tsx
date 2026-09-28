import { Link } from 'react-router-dom'
import { site } from '../../data/site'
import { WhatsAppIcon, InstagramIcon, MailIcon, TikTokIcon } from '../ui/icons'

const FOOTER_LINKS: Array<{ to: string; label: string }> = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/about', label: 'About' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Contact' }
]

export default function Footer() {
  const chatHref = `https://wa.me/${site.whatsappNumber}`

  return (
    <footer className="bg-burgundy-900 text-bone-100">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {/* Explore on the left, Connect on the right — side by side at every size. */}
        <div className="grid grid-cols-2 gap-6 min-[480px]:gap-14 lg:gap-24">
          {/* Explore */}
          <nav aria-label="Footer navigation">
            <h3 className="text-[11px] font-sans font-bold uppercase tracking-[0.2em] text-bone-100/70">
              Explore
            </h3>
            <ul className="mt-4 space-y-2.5">
              {FOOTER_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-bone-100/90 transition-colors hover:text-bone-50"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="min-w-0">
            <h3 className="text-[11px] font-sans font-bold uppercase tracking-[0.2em] text-bone-100/70">
              Contact
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href={chatHref}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start gap-2.5 text-sm text-bone-100/90 transition-colors hover:text-bone-50"
                >
                  <span className="mt-0.5 shrink-0">
                    <WhatsAppIcon size={17} className="text-whatsapp" />
                  </span>
                  <span className="min-w-0 break-words">Chat with us on WhatsApp</span>
                </a>
              </li>
              <li>
                <a
                  href={site.instagram.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start gap-2.5 text-sm text-bone-100/90 transition-colors hover:text-bone-50"
                >
                  <span className="mt-0.5 shrink-0">
                    <InstagramIcon size={17} />
                  </span>
                  <span className="min-w-0 break-words">{site.instagram.handle}</span>
                </a>
              </li>
              <li>
                <a
                  href={site.tiktok.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start gap-2.5 text-sm text-bone-100/90 transition-colors hover:text-bone-50"
                >
                  <span className="mt-0.5 shrink-0">
                    <TikTokIcon size={17} />
                  </span>
                  <span className="min-w-0 break-words">{site.tiktok.handle}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="flex items-start gap-2.5 text-sm text-bone-100/90 transition-colors hover:text-bone-50"
                >
                  <span className="mt-0.5 shrink-0">
                    <MailIcon size={17} />
                  </span>
                  <span className="min-w-0 break-words">{site.email}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-bone-50/20 px-6 py-6 text-center">
        <p className="text-xs text-bone-100/75">© 2026 Anna J'olad Cosmetics. All rights reserved.</p>
      </div>
    </footer>
  )
}
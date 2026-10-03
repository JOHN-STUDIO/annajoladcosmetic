import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { site } from '../../data/site'
import { useCart } from '../../context/CartContext'
import Button from '../ui/Button'
import Logo from '../ui/Logo'
import { CartIcon, CloseIcon, MenuIcon, WhatsAppIcon, InstagramIcon, TikTokIcon } from '../ui/icons'

const NAV_LINKS: Array<{ to: string; label: string }> = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/about', label: 'About' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Contact' }
]

export default function Navbar() {
  const { totalItems, openCart } = useCart()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  // Lock page scroll while the mobile menu is open.
  useEffect(() => {
    if (!menuOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [menuOpen])

  const desktopLinkClass = ({ isActive }: { isActive: boolean }) =>
    `inline-flex items-center border-b-2 transition-colors duration-200 ${isActive ? 'border-burgundy-700' : 'border-transparent hover:border-burgundy-300'} px-1 pb-3 pt-1 text-[13px] font-sans font-semibold uppercase tracking-[0.08em] ${isActive ? 'text-burgundy-700' : 'text-ink hover:text-burgundy-700'}`

  return (
    <header className="sticky top-0 z-30">
      {/* Main navigation */}
      <nav
        className={`border-b border-line transition-all duration-300 ${scrolled ? 'bg-bone-100/95 shadow-card' : 'bg-bone-50/90'}`}
        aria-label="Main navigation"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 min-[420px]:gap-6 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex min-w-0 shrink items-center focus-visible:outline-none"
            aria-label="Anna J'olad Cosmetics — home"
          >
            <Logo imgClassName="h-9 min-[420px]:h-11" />
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex lg:items-center gap-7">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.to === '/'} className={desktopLinkClass}>
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-2.5 lg:gap-4">
            <button
              type="button"
              className="relative grid size-11 place-items-center rounded-[2px] border border-line bg-bone-50 text-ink transition-all duration-200 hover:border-burgundy-500 hover:text-burgundy-700 active:scale-90 active:bg-bone-200"
              aria-label={`Open cart, ${totalItems} item${totalItems === 1 ? '' : 's'}`}
              onClick={openCart}
            >
              <CartIcon size={20} />
              {totalItems > 0 ? (
                <span
                  key={totalItems}
                  className="cart-badge-pop absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-burgundy-700 text-[10px] font-bold text-bone-100"
                >
                  {Math.min(totalItems, 99)}
                </span>
              ) : null}
            </button>

            <Button to="/shop" variant="primary" size="sm" className="hidden lg:inline-flex">
              Shop Collection
            </Button>

            <button
              type="button"
              className="grid size-11 place-items-center rounded-[2px] border border-line bg-bone-50 text-ink transition-all duration-200 hover:border-burgundy-500 hover:text-burgundy-700 active:scale-90 active:bg-bone-200 md:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <CloseIcon size={20} /> : <MenuIcon size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen ? (
        <div
          id="mobile-menu"
          className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-bone-50 px-6 pt-6"
        >
          <button
            type="button"
            className="absolute right-5 top-4 grid size-10 place-items-center rounded-[2px] border border-line text-ink transition-all duration-200 hover:border-burgundy-500 hover:text-burgundy-700 active:scale-90 active:bg-bone-200"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          >
            <CloseIcon size={18} />
          </button>

          <p className="mt-20 text-center">
            <Logo imgClassName="mx-auto h-16" />
          </p>

          <nav aria-label="Mobile navigation" className="mt-10 flex flex-col items-center gap-5">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }: { isActive: boolean }) =>
                  `font-display text-2xl transition-colors duration-200 ${
                    isActive ? 'font-bold text-burgundy-700' : 'text-ink hover:text-burgundy-700'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-10 flex justify-center gap-4">
            <a
              href={`https://wa.me/${site.whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="grid size-11 place-items-center rounded-full text-whatsapp transition-colors hover:bg-bone-200"
              aria-label="Chat on WhatsApp"
            >
              <WhatsAppIcon size={22} />
            </a>
            <a
              href={site.instagram.url}
              target="_blank"
              rel="noreferrer"
              className="grid size-11 place-items-center rounded-full text-burgundy-600 transition-colors hover:bg-bone-200"
              aria-label={`Follow on Instagram ${site.instagram.handle}`}
            >
              <InstagramIcon size={22} />
            </a>
            <a
              href={site.tiktok.url}
              target="_blank"
              rel="noreferrer"
              className="grid size-11 place-items-center rounded-full text-ink transition-colors hover:bg-bone-200"
              aria-label={`Follow on TikTok ${site.tiktok.handle}`}
            >
              <TikTokIcon size={22} />
            </a>
          </div>

          <div className="mt-12 flex flex-col items-center gap-3">
            <Button to="/shop" variant="primary" size="lg" onClick={() => setMenuOpen(false)}>
              Shop Collection
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  )
}
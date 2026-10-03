import { Routes, Route, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { CartProvider } from './context/CartContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import ScrollToTop from './components/layout/ScrollToTop'
import CartDrawer from './components/cart/CartDrawer'
import CartToast from './components/cart/CartToast'
import PipelineBanner from './components/layout/PipelineBanner'
import HomePage from './pages/HomePage'
import ShopPage from './pages/ShopPage'
import ProductDetailPage from './pages/ProductDetailPage'
import AboutPage from './pages/AboutPage'
import FAQPage from './pages/FAQPage'
import ContactPage from './pages/ContactPage'
import NotFoundPage from './pages/NotFoundPage'

/** Wraps the routed page in a subtle fade each time the pathname changes. */
function PageFade({ children }: { children: ReactNode }) {
  const location = useLocation()
  return (
    <div key={location.pathname} className="page-enter">
      {children}
    </div>
  )
}

export default function App() {
  return (
    <CartProvider>
      <ScrollToTop />
      <Navbar />
      <main id="main">
        <PageFade>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </PageFade>
      </main>
      <PipelineBanner />
      <Footer />
      <CartDrawer />
      <CartToast />
    </CartProvider>
  )
}
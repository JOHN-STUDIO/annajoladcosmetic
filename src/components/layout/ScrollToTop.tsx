import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Resets scroll position whenever the route pathname changes. */
export default function ScrollToTop() {
  const location = useLocation()
  const { pathname } = location

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname])

  return null
}
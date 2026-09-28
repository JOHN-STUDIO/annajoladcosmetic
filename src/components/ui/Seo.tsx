import { useEffect } from 'react'

interface SeoProps {
  title: string
  description?: string
}

/** Lightweight per-page SEO: sets the document title and meta description. */
export default function Seo({ title, description }: SeoProps) {
  useEffect(() => {
    document.title = title

    if (description) {
      let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
      if (!meta) {
        meta = document.createElement('meta')
        meta.name = 'description'
        document.head?.appendChild(meta)
      }
      meta.content = description

      let og = document.querySelector<HTMLMetaElement>('meta[property="og:title"]')
      if (!og) {
        og = document.createElement('meta')
        og.setAttribute('property', 'og:title')
        document.head?.appendChild(og)
      }
      og.content = title
    }
  }, [title, description])

  return null
}
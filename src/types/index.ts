// ---------------------------------------------------------------------------
// Shared domain types for Anna J'olad Cosmetics.
// ---------------------------------------------------------------------------

export type Category = 'Creams' | 'Lip Care' | 'Soaps'

export interface Product {
  id: string
  name: string
  category: Category
  /** Optional sub-section within a category, e.g. 'Lipglosses' inside 'Lip Care'. */
  subcategory?: 'Lipglosses' | 'Lip scrubs' | 'Lip balm' | 'Hair Cream' | 'Body lotion'
  /** Price in Nigerian Naira (whole units). */
  price: number
  description: string
  shortDescription: string
  /** Path to the product image inside /public/images/products … */
  image: string
  benefits: string[]
  howToUse: string
  size: string
  /** Optional "Please note" line shown under the description on the product page. */
  note?: string
  featured?: boolean
}

export interface CartLine {
  productId: string
  quantity: number
}

export interface Testimonial {
  id: string
  name: string
  product?: string
  quote: string
}

export interface FaqItem {
  id: string
  question: string
  answer: string
}

/** A highlighted "Please note" line shown under a collection write-up. */
export interface CollectionNote {
  /** Bold lead-in, e.g. "Please note". */
  label: string
  /** The sentence shown after the bold lead-in. */
  text: string
}

/** Editable write-up shown above a collection's products on the Shop page. */
export interface CollectionIntro {
  /** Optional collection brand name, e.g. "Jewel Luxury Soaps". */
  brand?: string
  /** One array entry per paragraph. */
  paragraphs: string[]
  /** Optional highlighted note (bold label + sentence). */
  note?: CollectionNote
}
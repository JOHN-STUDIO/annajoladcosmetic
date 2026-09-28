import type { Category, Product } from '../types'

// ---------------------------------------------------------------------------
// PRODUCT CATALOGUE — single source of truth for the shop.
//
// STRUCTURE — three categories, with sub-sections where shown:
//   1. Creams   → Hair Cream (Hair Bestie hair cream),
//                 Body lotion (Beauty Deep Carrot lotion)
//   2. Lip Care → Lipglosses (7), Lip scrubs (Plain, Tinted), Lip balm
//   3. Soaps    → papaya leaf, coffee/cocoa/goat milk, turmeric & goat milk,
//                 fresh glow, mango & orange peel
//
// To add or edit a product, update it here — every page renders from this
// array, so you never edit components when content changes.
//
// IMAGES:
// Drop a real photo into  /public/images/products/  using the exact filename
// referenced by the product's `image` field (case-sensitive) and it will be
// used automatically. While a file is missing, the site shows an elegant
// placeholder instead of a broken image.
//
// PRICES: Whole Naira amounts (no decimals). Displayed via formatNaira().
// ---------------------------------------------------------------------------

export const products: Product[] = [
  // ── CREAMS ────────────────────────────────────────────────────────────────
  {
    id: 'hair-beauty-natural-cosmetics',
    name: 'Hair Bestie hair cream',
    category: 'Creams',
    subcategory: 'Hair Cream',
    price: 4000,
    shortDescription:
      "Our hair cream is richness in a jar. With ingredients like neem extracts, coconut oil, shea butter, avocado extracts, aloe vera powder, and much more, A little goes a long way, so you have value for your money's worth! Hair Bestie is a forever friend to your hair!!",
    description:
      "Our hair cream is richness in a jar. With ingredients like neem extracts, coconut oil, shea butter, avocado extracts, aloe vera powder, and much more, A little goes a long way, so you have value for your money's worth! Hair Bestie is a forever friend to your hair!!",
    image: '/images/products/Hair beauty natural cosmetics.jpg',
    benefits: [
      'Neem extracts, coconut oil and shea butter',
      'Avocado extracts and aloe vera powder',
      'A little goes a long way — value for your money',
      'Hair Bestie — a forever friend to your hair'
    ],
    howToUse: 'Take a small amount, warm it between your palms and work through your hair. A little goes a long way.',
    size: '200ml jar',
    note: 'For longevity, keep product refrigerated after every use.'
  },
  {
    id: 'beauty-deep',
    name: 'Beauty Deep Carrot lotion',
    category: 'Creams',
    subcategory: 'Body lotion',
    price: 4500,
    shortDescription:
      "Our beauty deep body lotion is formulated with one of Nature's candy, carrots!! Which packed with vitamin a and c. Helping the skin maintain and retain collagen to give the skin youthfulness. It is also moisturising and packed with rich antioxidants.",
    description:
      "Our beauty deep body lotion is formulated with one of Nature's candy, carrots!! Which packed with vitamin a and c. Helping the skin maintain and retain collagen to give the skin youthfulness. It is also moisturising and packed with rich antioxidants.",
    image: '/images/products/Beauty Deep.jpeg',
    benefits: [
      'Formulated with carrots — Nature’s candy, rich in vitamins A and C',
      'Helps the skin maintain and retain collagen',
      'Moisturising and packed with rich antioxidants',
      'Supports youthful-looking skin'
    ],
    howToUse:
      'Smooth over clean skin after bathing. Keep refrigerated after every use for longevity.',
    size: '250ml bottle'
  },
  // ── LIP CARE ──────────────────────────────────────────────────────────────
  {
    id: 'cherry-my-love',
    name: 'Cherry my love',
    category: 'Lip Care',
    subcategory: 'Lipglosses',
    price: 2500,
    shortDescription: 'This red tint of lipgloss is for those who like the kissing game. Enough said!',
    description:
      'This red tint of lipgloss is for those who like the kissing game. Enough said!',
    image: '/images/products/cherry-my-love.jpeg',
    benefits: [
      'Bold red tint',
      'Flavoured gloss',
      'For those who like the kissing game',
      'Comfortable everyday shine'
    ],
    howToUse:
      'Apply directly from the wand to bare lips, or glide over your favourite lipstick. Layer on a second coat for extra shine.',
    size: '10ml'
  },
  {
    id: 'yummy-brownie',
    name: 'Yummy Brownie',
    category: 'Lip Care',
    subcategory: 'Lipglosses',
    price: 3000,
    shortDescription:
      'You can\'t miss with this rich chocolate brown shaded lipgloss. This will remind you of brownies from your grandma\'s oven!!',
    description:
      'You can\'t miss with this rich chocolate brown shaded lipgloss. This will remind you of brownies from your grandma\'s oven!!',
    image: '/images/products/yummy-brownie.jpeg',
    benefits: [
      'Rich chocolate brown shade',
      'Smells like brownies from the oven',
      'Sweet, warm and comforting',
      'A treat you can wear all day'
    ],
    howToUse:
      'Apply directly from the wand to bare lips, or glide over your favourite lipstick. Layer on a second coat for extra shine.',
    size: '10ml'
  },
  {
    id: 'strawberry-kiss',
    name: 'Strawberry Kiss',
    category: 'Lip Care',
    subcategory: 'Lipglosses',
    price: 2500,
    shortDescription:
      'This Lipgloss is strawberry-flavoured with a rich pink tint and a wonderful smell. A must have for strawberry lovers.',
    description:
      'This Lipgloss is strawberry-flavoured with a rich pink tint and a wonderful smell. A must have for strawberry lovers.',
    image: '/images/products/strawberry-kiss.jpeg',
    benefits: [
      'Strawberry-flavoured gloss',
      'Rich pink tint',
      'Wonderful smell',
      'A must-have for strawberry lovers'
    ],
    howToUse:
      'Apply directly from the wand to bare lips, or glide over your favourite lipstick. Layer on a second coat for extra shine.',
    size: '10ml',
    featured: true
  },
  {
    id: 'berry-purple',
    name: 'Berry purple',
    category: 'Lip Care',
    subcategory: 'Lipglosses',
    price: 3000,
    shortDescription:
      'This shade of Lipgloss pays homage to the many fruits of purple like blackberry, blueberry, grapes, and plum. This tinted Lipgloss is for the bold ones who dare to stand out!!!',
    description:
      'This shade of Lipgloss pays homage to the many fruits of purple like blackberry, blueberry, grapes, and plum. This tinted Lipgloss is for the bold ones who dare to stand out!!!',
    image: '/images/products/berry-purple.jpeg',
    benefits: [
      'Deep purple tint',
      'Mixed berry flavour',
      'Bold, vibrant finish',
      'Made to turn heads'
    ],
    howToUse:
      'Apply directly from the wand to bare lips, or glide over your favourite lipstick. Layer on a second coat for extra shine.',
    size: '10ml'
  },
  {
    id: 'orange-squash',
    name: 'Orange Squash',
    category: 'Lip Care',
    subcategory: 'Lipglosses',
    price: 2000,
    shortDescription:
      'Citrus lovers will adore this Lipgloss. It reminds you of Orange, clementine and much more....Smells so Fresh!!!',
    description:
      'Citrus lovers will adore this Lipgloss. It reminds you of Orange, clementine and much more....Smells so Fresh!!!',
    image: '/images/products/orange-squash.jpeg',
    benefits: [
      'Citrus-inspired flavour',
      'Orange and clementine notes',
      'Smells so fresh',
      'Fun, fresh everyday wear'
    ],
    howToUse:
      'Apply directly from the wand to bare lips, or glide over your favourite lipstick. Layer on a second coat for extra shine.',
    size: '10ml'
  },
  {
    id: 'peachy-gum-gum',
    name: 'Peachy gum gum',
    category: 'Lip Care',
    subcategory: 'Lipglosses',
    price: 2000,
    shortDescription:
      "This pale pink shade is flavoured with peach and bubble gum. This combo is so nice, you'll want to wear it all day!!",
    description:
      "This pale pink shade is flavoured with peach and bubble gum. This combo is so nice, you'll want to wear it all day!!",
    image: '/images/products/peachy-gum-gum.jpeg',
    benefits: [
      'Pale pink shade',
      'Peach and bubble gum flavour',
      'Comfortable all-day wear',
      'Soft, glossy finish'
    ],
    howToUse:
      'Apply directly from the wand to bare lips, or glide over your favourite lipstick. Layer on a second coat for extra shine.',
    size: '10ml'
  },
  {
    id: 'sugar-rush',
    name: 'Sugar Rush',
    category: 'Lip Care',
    subcategory: 'Lipglosses',
    price: 2000,
    shortDescription:
      'This translucent white tint is for the girlies who want to veil their lips but with no colour. Perfect way to feel simple but trendy as well!!',
    description:
      'This translucent white tint is for the girlies who want to veil their lips but with no colour. Perfect way to feel simple but trendy as well!!',
    image: '/images/products/sugar-rush.jpeg',
    benefits: [
      'Translucent white tint',
      'No colour — just shine',
      'Simple but trendy',
      'Veils lips beautifully'
    ],
    howToUse:
      'Apply directly from the wand to bare lips, or glide over your favourite lipstick. Layer on a second coat for extra shine.',
    size: '10ml'
  },
  {
    id: 'plain-lip-scrub',
    name: 'Plain',
    category: 'Lip Care',
    subcategory: 'Lip scrubs',
    price: 1800,
    shortDescription:
      'This plain lip scrub is formulated with natural ingredients like shea butter, cocoa butter, and jojoba oil to plump up the lips and make it so smooth!!',
    description:
      'This plain lip scrub is formulated with natural ingredients like shea butter, cocoa butter, and jojoba oil to plump up the lips and make it so smooth!!',
    image: '/images/products/plain-lip-scrub.jpeg',
    benefits: [
      'Made with natural ingredients',
      'Shea butter and cocoa butter',
      'Jojoba oil nourish',
      'Plumps up the lips and makes them so smooth'
    ],
    howToUse:
      'Massage a pea-sized amount onto lips in small circles, then rinse or wipe away with a damp cloth. Use 2–3 times a week.',
    size: '25ml jar'
  },
  {
    id: 'pink-tinted-lip-scrub',
    name: 'Tinted',
    category: 'Lip Care',
    subcategory: 'Lip scrubs',
    price: 2500,
    shortDescription:
      'This deep pink tinted lip scrub is made with vibrant richness of beetroot. All ingredients are natural enough to be consumed orally. For your pink lips, this is perfect for obtaining!!',
    description:
      'This deep pink tinted lip scrub is made with vibrant richness of beetroot. All ingredients are natural enough to be consumed orally. For your pink lips, this is perfect for obtaining!!',
    image: '/images/products/pink-tinted-lip-scrub.jpeg',
    benefits: [
      'Deep pink tint from beetroot',
      'Made with natural ingredients',
      'Plumps and smooths lips',
      'Perfect for your pink lips'
    ],
    howToUse:
      'Massage a pea-sized amount onto lips in small circles, then rinse or wipe away with a damp cloth. Use 2–3 times a week.',
    size: '25ml jar',
    featured: true
  },
  {
    id: 'lip-balm',
    name: 'Lip balm',
    category: 'Lip Care',
    subcategory: 'Lip balm',
    price: 1000,
    shortDescription:
      "A simple balm made specifically for dry, broken lips. It's made to trap moisture and layer the lips from dryness.",
    description:
      "A simple balm made specifically for dry, broken lips. It's made to trap moisture and layer the lips from dryness.",
    image: '/images/products/Lip balm.jpeg',
    benefits: [
      'Made specifically for dry, broken lips',
      'Traps moisture to keep lips soft',
      'Layers the lips to protect them from dryness'
    ],
    howToUse:
      'Smooth a small amount over clean lips whenever they feel dry — morning and night works well.',
    size: '8g tube'
  },

  // ── SOAPS ─────────────────────────────────────────────────────────────────
  {
    id: 'papaya-leaf-soap',
    name: 'Papaya leaf',
    category: 'Soaps',
    price: 2000,
    shortDescription:
      "Papaya leaf soap is made from naturally processed and grounded papaya leaves powder. It is best used for removing excessive oil, sweat and dirt. A very good exfoliant has strong antioxidant properties and it's deep cleansing.",
    description:
      "Papaya leaf soap is made from naturally processed and grounded papaya leaves powder. It is best used for removing excessive oil, sweat and dirt. A very good exfoliant has strong antioxidant properties and it's deep cleansing.",
    image: '/images/products/papaya-leaf-soap.jpeg',
    benefits: [
      'Naturally processed papaya leaves powder',
      'Removes excessive oil, sweat and dirt',
      'A very good exfoliant',
      'Strong antioxidant properties',
      'Deep cleansing'    ],
    howToUse:
      'Lather onto damp skin and massage gently in circles, then rinse. Rest the bar on a draining soap dish between uses.',
    size: '120g bar'
  },
  {
    id: 'coffee-cocoa-goat-milk-soap',
    name: 'Coffee, cocoa, and goat milk',
    category: 'Soaps',
    price: 3000,
    shortDescription:
      'Coffee, cocoa, and goat milk are a power trio that make their soap remove dead skin cells, reduce cellulite, have rich antioxidant compounds, and contain lactic acid that moisturises your skin so well, it feels highly hydrated even after rinse off!!',
    description:
      'Coffee, cocoa, and goat milk are a power trio that make their soap remove dead skin cells, reduce cellulite, have rich antioxidant compounds, and contain lactic acid that moisturises your skin so well, it feels highly hydrated even after rinse off!!',
    image: '/images/products/coffee-cocoa-goat-milk-soap.jpeg',
    benefits: [
      'Removes dead skin cells',
      'Helps reduce cellulite',
      'Rich in antioxidant compounds',
      'Lactic acid from goat milk moisturises',
      'Skin feels highly hydrated after rinse off'
    ],
    howToUse:
      'Lather onto damp skin and massage in circles to help exfoliate, then rinse. Rest the bar on a draining soap dish between uses.',
    size: '120g bar'
  },
  {
    id: 'turmeric-goat-milk-soap',
    name: 'Turmeric and goat milk soap',
    category: 'Soaps',
    price: 2500,
    shortDescription:
      'This soap has turmeric that has been proved by modern research to reduce acne, brighten skin, and reduce ageing and inflammation because of its active compound called curcumin. Goat milk adds extra conditioning and moisturising!!',
    description:
      'This soap has turmeric that has been proved by modern research to reduce acne, brighten skin, and reduce ageing and inflammation because of its active compound called curcumin. Goat milk adds extra conditioning and moisturising!!',
    image: '/images/products/turmeric-goat-milk-soap.jpeg',
    benefits: [
      'Turmeric with its active compound, curcumin',
      'Helps reduce acne',
      'Brightens skin',
      'Helps reduce ageing and inflammation',
      'Goat milk for extra conditioning and moisturising'
    ],
    howToUse:
      'Lather onto damp skin, massage gently, then rinse. Rest the bar on a draining soap dish between uses.',
    size: '120g bar'
  },
  {
    id: 'fresh-glow-soap',
    name: 'Fresh glow',
    category: 'Soaps',
    price: 3500,
    shortDescription:
      'Fresh glow soap is a blend of cucumber and aloe vera that powers the soap to greatly reduce antifungal activities, soothe skin, and reduce inflammation, hydrate the skin and refresh the skin to give it a youthful glow!!',
    description:
      'Fresh glow soap is a blend of cucumber and aloe vera that powers the soap to greatly reduce antifungal activities, soothe skin, and reduce inflammation, hydrate the skin and refresh the skin to give it a youthful glow!!',
    image: '/images/products/fresh-glow-soap.jpeg',
    benefits: [
      'Cucumber and aloe vera blend',
      'Helps reduce antifungal activity',
      'Soothes skin',
      'Helps reduce inflammation',
      'Hydrates and refreshes for a youthful glow'
    ],
    howToUse:
      'Lather onto damp skin, rinse thoroughly and pat dry. Rest the bar on a draining soap dish between uses.',
    size: '120g bar'
  },
  {
    id: 'mango-and-orange-peel-soap',
    name: 'Mango and orange peel soap',
    category: 'Soaps',
    price: 3000,
    shortDescription:
      "Our mango and orange peel soap is a hybrid which helps rejuvenate the skin. Its benefits are so many and it smells divine!!",
    description:
      "Our mango and orange peel soap is a hybrid which helps rejuvenate the skin. Its benefits are so many and it smells divine!!",
    image: '/images/products/Mango and orange peel soap.jpeg',
    benefits: [
      'Mango and orange peel blend',
      'Helps rejuvenate the skin',
      'Handcrafted in small batches',
      'Smells divine'
    ],
    howToUse:
      'Lather onto damp skin, massage gently, then rinse. Rest the bar on a draining soap dish between uses.',
    size: '120g bar'
  }
]

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id)
}

export function getFeaturedProducts(limit = 6): Product[] {
  return products.filter((product) => product.featured).slice(0, limit)
}

export function getRelatedProducts(product: Product, limit = 3): Product[] {
  const sameCategory = products.filter(
    (candidate) => candidate.id !== product.id && candidate.category === product.category
  )
  const others = products.filter(
    (candidate) => candidate.id !== product.id && candidate.category !== product.category
  )
  return [...sameCategory, ...others].slice(0, limit)
}

export function getCategories(): Category[] {
  // Preserve the desired shop filter order.
  return ['Creams', 'Lip Care', 'Soaps']
}

const SECTION_TITLES: Partial<Record<Category, Array<NonNullable<Product['subcategory']>>>> = {
  Creams: ['Hair Cream', 'Body lotion'],
  'Lip Care': ['Lipglosses', 'Lip scrubs', 'Lip balm']
}

/** The sub-sections of a category, in display order (empty ones render as "coming soon"). */
export function getSections(category: string): Array<{ title: string; products: Product[] }> {
  const titles = SECTION_TITLES[category as Category] ?? []
  return titles.map((title) => ({
    title,
    products: products.filter((product) => product.category === category && product.subcategory === title)
  }))
}
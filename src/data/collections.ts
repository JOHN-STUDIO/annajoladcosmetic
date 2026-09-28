import type { CollectionIntro } from '../types'

// ---------------------------------------------------------------------------
// COLLECTION WRITE-UPS — shown on the Shop page under a sub-section heading.
//
// Keys match the sub-section that should show them ("Lipglosses")
// or the category itself for flat categories ("Soaps").
// Edit the wording here — no components need changing.
// The `note` block renders "Please note" in bold automatically.
// ---------------------------------------------------------------------------

export type CollectionIntroKey = 'Lipglosses' | 'Soaps'

export const collectionIntros: Record<CollectionIntroKey, CollectionIntro> = {
  Lipglosses: {
    paragraphs: [
      "Sweetlips by Anna J'olad is the brand name for our lipglosses. We have 7 different tints, creating a range of varieties where you are spoilt for choice and have the liberty to possess all without restraint. Each lipgloss has a character that we hope identifies with you in some special way!!"
    ],
    note: {
      label: 'Please note',
      text: 'While our lipgloss formula and volume remain constant, the style or shape of the container may vary due to availability'
    }
  },
  Soaps: {
    brand: 'Jewel Luxury Soaps',
    paragraphs: [
      "Our soaps are 100% handcrafted, which we take great pride in. We source for our materials locally, in turn helping local traders grow their business. For this reason, our soaps take a period of 4 weeks to 'cure' for it to be ready. Pre ordering is just requesting your patience so we can give you the best quality!!"
    ],
    note: {
      label: 'Please note',
      text: 'Packaging may vary, but product quality is always the same.'
    }
  }
}

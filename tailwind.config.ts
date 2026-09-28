// ---------------------------------------------------------------------------
// Tailwind CSS v4 settings.
//
// NOTE: design tokens (colours, fonts, shadows) are defined CSS-first in
//   src/index.css  via the @theme block. This file only configures content
//   scanning (the Vite plugin auto-detects sources, but being explicit keeps
//   it predictable).
// ---------------------------------------------------------------------------

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}']
}
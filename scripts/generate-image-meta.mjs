// ---------------------------------------------------------------------------
// Reads the real pixel dimensions of every picture in public/images and writes
// src/data/imageDimensions.ts.
//
// Why bother: an <img> with width/height lets the browser reserve the right
// space before the file arrives — that is what removes the layout shift (CLS)
// that hurts Core Web Vitals. The same numbers feed og:image:width/height, so
// WhatsApp/Facebook render the preview at the correct size instead of guessing.
//
// Runs automatically as part of `npm run build`; run it directly with
// `npm run images:meta` after adding or replacing a picture.
// ---------------------------------------------------------------------------

import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join, posix, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const imagesDir = join(root, 'public', 'images')
const outFile = join(root, 'src', 'data', 'imageDimensions.ts')

/** Large pictures slow down mobile — warn above this size. */
const HEAVY_KB = 300

const SUPPORTED = /\.(jpe?g|png|gif|webp)$/i

function jpegSize(buffer) {
  let i = 2
  while (i < buffer.length - 9) {
    if (buffer[i] !== 0xff) {
      i += 1
      continue
    }
    const marker = buffer[i + 1]
    // Padding / standalone markers carry no length.
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      i += 2
      continue
    }
    if (marker === 0xd9 || marker === 0xda) break // end of header / start of scan
    const isStartOfFrame =
      marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc
    if (isStartOfFrame) {
      return { height: buffer.readUInt16BE(i + 5), width: buffer.readUInt16BE(i + 7) }
    }
    i += 2 + buffer.readUInt16BE(i + 2)
  }
  return null
}

function pngSize(buffer) {
  if (buffer.length < 24) return null
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) }
}

function gifSize(buffer) {
  if (buffer.length < 10) return null
  return { width: buffer.readUInt16LE(6), height: buffer.readUInt16LE(8) }
}

function webpSize(buffer) {
  if (buffer.length < 30) return null
  const chunk = buffer.toString('ascii', 12, 16)
  if (chunk === 'VP8X') {
    return { width: 1 + buffer.readUIntLE(24, 3), height: 1 + buffer.readUIntLE(27, 3) }
  }
  if (chunk === 'VP8 ') {
    return { width: buffer.readUInt16LE(26) & 0x3fff, height: buffer.readUInt16LE(28) & 0x3fff }
  }
  if (chunk === 'VP8L') {
    const bits = buffer.readUInt32LE(21)
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 }
  }
  return null
}

/** Pixel dimensions straight from the file header (no image library needed). */
function readSize(file) {
  const buffer = readFileSync(file)
  if (buffer.length > 3 && buffer[0] === 0xff && buffer[1] === 0xd8) return jpegSize(buffer)
  if (buffer.length > 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return pngSize(buffer)
  }
  if (buffer.subarray(0, 3).toString('ascii') === 'GIF') return gifSize(buffer)
  if (buffer.subarray(0, 4).toString('ascii') === 'RIFF') return webpSize(buffer)
  return null
}

/** Every picture under public/images, as site paths ("/images/…"). */
function collect(dir = imagesDir, found = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      collect(full, found)
    } else if (SUPPORTED.test(entry)) {
      found.push(full)
    }
  }
  return found
}

const files = collect().sort()
const entries = []
const heavy = []
const unknown = []

for (const file of files) {
  const sitePath = posix.join('/images', relative(imagesDir, file).split(sep).join('/'))
  const size = readSize(file)
  if (!size) {
    unknown.push(sitePath)
    continue
  }
  entries.push({ sitePath, ...size })
  const kb = statSync(file).size / 1024
  if (kb > HEAVY_KB) heavy.push(`${sitePath} (${kb.toFixed(0)} KB)`)
}

const rows = entries
  .map((entry) => `  '${entry.sitePath}': { width: ${entry.width}, height: ${entry.height} },`)
  .join('\n')

const contents = `// ---------------------------------------------------------------------------
// GENERATED FILE — do not edit by hand.
//
// Real pixel dimensions of every picture in public/images, read straight from
// the image headers by scripts/generate-image-meta.mjs (runs automatically as
// part of \`npm run build\`; refresh on demand with \`npm run images:meta\`).
//
// Why it exists: an <img> with width/height lets the browser reserve the right
// space before the file arrives, which removes the layout shift (CLS) that
// hurts Core Web Vitals. The same numbers feed og:image:width/height so social
// previews are rendered at the correct size instead of being guessed.
// ---------------------------------------------------------------------------

export interface ImageSize {
  width: number
  height: number
}

export const imageDimensions: Record<string, ImageSize> = {
${rows}
}

/** Dimensions of a picture in /public, or undefined if it isn't catalogued. */
export function getImageSize(src: string): ImageSize | undefined {
  return imageDimensions[src]
}
`

writeFileSync(outFile, contents, 'utf8')

console.log(`✓ imageDimensions.ts — ${entries.length} pictures catalogued`)
if (unknown.length > 0) console.log(`  skipped (unreadable header): ${unknown.join(', ')}`)
if (heavy.length > 0) {
  console.log(`  ⚠ over ${HEAVY_KB} KB — consider compressing for mobile:`)
  for (const item of heavy) console.log(`    - ${item}`)
}

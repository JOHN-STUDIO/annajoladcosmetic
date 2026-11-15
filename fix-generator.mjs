import { readFileSync, writeFileSync } from 'fs'
const path = 'D:/Anna J\'olad Cosmetics/scripts/generate-image-meta.mjs'
let f = readFileSync(path, 'utf8')
f = f.replace(
  ".map((entry) => `  '${entry.sitePath.replace(/'/g, \"\\\\'\")}': { width: ${entry.width}, height: ${entry.height} },`)",
  ".map((entry) => `  \"${entry.sitePath}\": { width: ${entry.width}, height: ${entry.height} },`)"
)
writeFileSync(path, f, 'utf8')
console.log('Fixed generate-image-meta.mjs')
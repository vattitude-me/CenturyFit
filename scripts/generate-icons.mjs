import fs from 'fs'
import path from 'path'

// Minimal 1x1 PNG data transparent / emerald green for placeholder icon files until asset generator is used
const png1x1Base64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkWPifAQAE+gH29Eca6AAAAABJRU5ErkJggg=='
const buffer = Buffer.from(png1x1Base64, 'base64')

const iconFiles = [
  'icon-192.png',
  'icon-512.png',
  'icon-maskable-192.png',
  'apple-touch-icon.png'
]

const iconsDir = path.join(process.cwd(), 'public', 'icons')
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true })
}

iconFiles.forEach((file) => {
  const filePath = path.join(iconsDir, file)
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, buffer)
  }
})

console.log('Icons generated successfully')

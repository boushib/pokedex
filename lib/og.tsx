import { readFile } from 'node:fs/promises'
import path from 'node:path'

/** Outfit ExtraBold for share images (static .woff from @fontsource; the image renderer can't read woff2 or variable fonts) */
export const ogFont = () => readFile(path.join(process.cwd(), 'node_modules/@fontsource/outfit/files/outfit-latin-800-normal.woff'))

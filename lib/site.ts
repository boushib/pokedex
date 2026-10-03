/**
 * Where the Pokédex lives. Canonical links, the sitemap and share images are built from it.
 * SITE_URL wins (set it for a custom domain); otherwise the address Render or Vercel gives the deploy.
 */
const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
export const siteUrl = (process.env.SITE_URL || process.env.RENDER_EXTERNAL_URL || vercel || 'http://localhost:3000').replace(/\/$/, '')

export const site = {
  name: 'Pokédex',
  description: 'A fast Pokédex for all 1,025 Pokémon: stats, abilities, evolutions, type matchups, a team builder and side-by-side comparisons.',
}

export const absolute = (path: string) => `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`

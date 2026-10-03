/** Where the Pokédex lives. Canonical links, the sitemap and share images are built from it. */
export const siteUrl = (process.env.SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '')

export const site = {
  name: 'Pokédex',
  description: 'A fast Pokédex for all 1,025 Pokémon: stats, abilities, evolutions, type matchups, a team builder and side-by-side comparisons.',
}

export const absolute = (path: string) => `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`

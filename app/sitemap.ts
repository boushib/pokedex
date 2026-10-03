import type { MetadataRoute } from 'next'

import meta from '@/data/meta.json'
import { allPokemon } from '@/lib/pokemon'
import { absolute } from '@/lib/site'

/** The front page, the tools and all 1,025 Pokémon pages; dated by the last data snapshot */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(meta.fetchedAt)
  return [
    { url: absolute('/'), lastModified, changeFrequency: 'monthly', priority: 1 },
    { url: absolute('/types'), lastModified, changeFrequency: 'yearly', priority: 0.8 },
    { url: absolute('/compare'), lastModified, changeFrequency: 'yearly', priority: 0.5 },
    { url: absolute('/team'), lastModified, changeFrequency: 'yearly', priority: 0.5 },
    ...allPokemon.map((p) => ({ url: absolute(`/pokemon/${p.slug}`), lastModified, changeFrequency: 'yearly' as const, priority: 0.7 })),
  ]
}

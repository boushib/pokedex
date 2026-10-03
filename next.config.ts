import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactCompiler: true,
  // A second dev server (e.g. an agent's) can build into its own folder
  distDir: process.env.NEXT_DIST_DIR || '.next',
  images: {
    // Official artwork: high resolution from HybridShivam/Pokemon, and the PokéAPI copy for share images
    remotePatterns: [
      { protocol: 'https', hostname: 'raw.githubusercontent.com', pathname: '/HybridShivam/Pokemon/master/assets/images/**' },
      { protocol: 'https', hostname: 'raw.githubusercontent.com', pathname: '/PokeAPI/sprites/**' },
    ],
    // 90 for the large artwork on Pokémon pages, where 75 shows banding in the soft shading
    qualities: [75, 90],
  },
}

export default nextConfig

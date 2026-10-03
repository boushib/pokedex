import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactCompiler: true,
  // A second dev server (e.g. an agent's) can build into its own folder
  distDir: process.env.NEXT_DIST_DIR || '.next',
  images: {
    // Official artwork from the PokéAPI sprites repository
    remotePatterns: [{ protocol: 'https', hostname: 'raw.githubusercontent.com', pathname: '/PokeAPI/sprites/**' }],
  },
}

export default nextConfig

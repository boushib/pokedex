import './globals.scss'

import type { Metadata, Viewport } from 'next'
import { Inter, Outfit } from 'next/font/google'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { themeScript } from '@/components/ThemeToggle'
import { site, siteUrl } from '@/lib/site'

const sans = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })
const display = Outfit({ subsets: ['latin'], variable: '--font-display', display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${site.name}: every Pokémon, stats, evolutions and matchups`, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: '/' },
  openGraph: { type: 'website', siteName: site.name, locale: 'en_US', url: '/' },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true, 'max-image-preview': 'large' },
}

export const viewport: Viewport = {
  // Dark by default
  themeColor: '#0f1117',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" data-theme="dark" className={`${sans.variable} ${display.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a href="#main" className="sr-only">
          Skip to content
        </a>
        <Header />
        <div id="main">{children}</div>
        <Footer />
      </body>
    </html>
  )
}

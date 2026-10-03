import { ImageResponse } from 'next/og'

import { ogFont } from '@/lib/og'
import { artworkPng, dexNumber, getPokemon, STATS, titleCase } from '@/lib/pokemon'
import { TYPE_COLORS } from '@/lib/types'

export const alt = 'Pokémon card with artwork, types and base stats'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const p = getPokemon((await params).slug)
  if (!p) return new Response('Not found', { status: 404 })
  const color = TYPE_COLORS[p.types[0]]

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', fontFamily: 'Outfit', background: `linear-gradient(135deg, ${color}33, #ffffff 55%)`, padding: 56 }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: 620 }}>
          <div style={{ display: 'flex', fontSize: 34, color: '#8d92a3' }}>{dexNumber(p.id)}</div>
          <div style={{ display: 'flex', fontSize: 96, color: '#15171f', lineHeight: 1, marginTop: 6 }}>{p.name}</div>
          <div style={{ display: 'flex', fontSize: 30, color: '#5d6273', marginTop: 12 }}>{p.genus}</div>
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            {p.types.map((t) => (
              <div key={t} style={{ display: 'flex', padding: '8px 24px', borderRadius: 999, background: TYPE_COLORS[t], color: '#fff', fontSize: 28 }}>
                {titleCase(t)}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 32 }}>
            {STATS.map((s) => (
              <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 22, color: '#5d6273' }}>
                <div style={{ display: 'flex', width: 54 }}>{s.short}</div>
                <div style={{ display: 'flex', width: 44, color: '#15171f' }}>{p.stats[s.key]}</div>
                <div style={{ display: 'flex', width: 360, height: 12, borderRadius: 999, background: '#e8eaf1' }}>
                  <div style={{ display: 'flex', width: `${Math.min(100, (p.stats[s.key] / 200) * 100)}%`, height: 12, borderRadius: 999, background: color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 470 }}>
          <img src={artworkPng(p.id)} width={450} height={450} alt="" />
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: 'Outfit', data: await ogFont(), weight: 800 }] },
  )
}

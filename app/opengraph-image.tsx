import { ImageResponse } from 'next/og'

import { MARK_DATA_URI } from '@/lib/brand'
import { ogFont } from '@/lib/og'
import { artwork } from '@/lib/pokemon'

export const alt = 'Pokédex: every Pokémon, with stats, evolutions and matchups'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const FEATURED = [25, 6, 9, 3, 150, 448]

export default async function Image() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: '#f6f7fb', fontFamily: 'Outfit', padding: 64, position: 'relative' }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: 560 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <img src={MARK_DATA_URI} width={68} height={68} />
            <div style={{ fontSize: 44, color: '#15171f' }}>Pokédex</div>
          </div>
          <div style={{ fontSize: 76, lineHeight: 1.02, color: '#15171f', marginTop: 36 }}>Every Pokémon, at a glance</div>
          <div style={{ fontSize: 30, color: '#5d6273', marginTop: 22 }}>Stats, evolutions and matchups</div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', width: 520, gap: 8, alignContent: 'center', justifyContent: 'center' }}>
          {FEATURED.map((id) => (
            <img key={id} src={artwork(id)} width={160} height={160} alt="" />
          ))}
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: 'Outfit', data: await ogFont(), weight: 800 }] },
  )
}

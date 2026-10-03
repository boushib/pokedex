import { STATS, type StatKey } from '@/lib/format'

import styles from './StatRadar.module.scss'

// Clockwise from the top, the order the games' summary screens use
const ORDER: StatKey[] = ['hp', 'attack', 'defense', 'speed', 'spDefense', 'spAttack']
const SIZE = 300
const C = SIZE / 2
const R = 104
const MAX = 150

const point = (i: number, r: number) => {
  const a = (Math.PI * 2 * i) / ORDER.length - Math.PI / 2
  return [C + Math.cos(a) * r, C + Math.sin(a) * r] as const
}
const polygon = (r: (i: number) => number) => ORDER.map((_, i) => point(i, r(i)).join(',')).join(' ')

/** The six base stats as a hexagon, the classic summary-screen shape */
export function StatRadar({ stats }: { stats: Record<StatKey, number> }) {
  const label = Object.fromEntries(STATS.map((s) => [s.key, s.short]))
  return (
    <svg className={styles.radar} viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label="Base stats chart">
      <defs>
        <radialGradient id="radar-fill">
          <stop offset="0" stopColor="var(--accent)" stopOpacity="0.15" />
          <stop offset="1" stopColor="var(--type)" stopOpacity="0.55" />
        </radialGradient>
      </defs>
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <polygon key={f} points={polygon(() => R * f)} className={styles.ring} />
      ))}
      {ORDER.map((_, i) => {
        const [x, y] = point(i, R)
        return <line key={i} x1={C} y1={C} x2={x} y2={y} className={styles.axis} />
      })}
      <g className={styles.shape}>
        <polygon points={polygon((i) => (Math.min(stats[ORDER[i]], MAX) / MAX) * R)} fill="url(#radar-fill)" className={styles.area} />
        {ORDER.map((k, i) => {
          const [x, y] = point(i, (Math.min(stats[k], MAX) / MAX) * R)
          return <circle key={k} cx={x} cy={y} r="4" className={styles.dot} />
        })}
      </g>
      {ORDER.map((k, i) => {
        const [x, y] = point(i, R + 26)
        return (
          <text key={k} x={x} y={y} className={styles.label} textAnchor="middle">
            <tspan x={x} dy="-0.2em">
              {label[k]}
            </tspan>
            <tspan x={x} dy="1.15em" className={styles.value}>
              {stats[k]}
            </tspan>
          </text>
        )
      })}
    </svg>
  )
}

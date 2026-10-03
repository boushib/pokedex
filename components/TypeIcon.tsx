// Simple original glyphs for the 18 types, drawn on a 24px grid with round strokes

const PATHS: Record<string, string> = {
  normal: 'M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  fire: 'M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2.2 1.2-3.6 2.4-4.8.3 1.6 1 2.6 2.1 3.2C11 8.5 11.3 5.6 12 3z',
  water: 'M12 3.5c3 4 6 7.2 6 10.5a6 6 0 0 1-12 0c0-3.3 3-6.5 6-10.5zM9.5 14.5a2.5 2.5 0 0 0 2.5 2.5',
  grass: 'M5 19C5 10 10 5 19 5c0 9-5 14-14 14zM5 19l8-8',
  electric: 'M13.5 3 6 13.5h5L10 21l8-11h-5.2z',
  ice: 'M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9M9.5 4.5 12 6l2.5-1.5M9.5 19.5 12 18l2.5 1.5',
  fighting: 'M7 11V7.5a1.5 1.5 0 0 1 3 0V10m0-3a1.5 1.5 0 0 1 3 0v3m0-2.5a1.5 1.5 0 0 1 3 0V11m0-1.5a1.5 1.5 0 0 1 3 0V14a6 6 0 0 1-6 6h-1.5A5.5 5.5 0 0 1 7 14.5V11a1.5 1.5 0 0 0-3 0v1',
  poison: 'M12 4a6 6 0 0 0-6 6c0 2 1 3.4 2 4.2V17h8v-2.8c1-.8 2-2.2 2-4.2a6 6 0 0 0-6-6zM9.5 10.5h.01M14.5 10.5h.01M10 20h4',
  ground: 'M3 18h18M5 18l4.5-7 3 4 2.5-3.5L19 18M9.5 11 11 8.5',
  flying: 'M3 14c4 0 7-2 9-6 1.5 3 4 5 9 5-3 3.5-6.5 5-10 5-3.5 0-6-1.5-8-4zM12 8V4',
  psychic: 'M12 12a1.5 1.5 0 1 1 1.5-1.5c0 2.5-2 4-4.5 4A4.5 4.5 0 0 1 4.5 10C4.5 6 8 3.5 12 3.5s8 3 8 8-4 9-9.5 9',
  bug: 'M9 7a3 3 0 0 1 6 0M8 9h8v5a4 4 0 0 1-8 0zM12 9v9M4 11h4M16 11h4M4 17l4-2M20 17l-4-2M9 4 7.5 2.5M15 4l1.5-1.5',
  rock: 'M7 5h7l5 5-2 8H8l-4-6zM7 5l3 6 7 7M10 11l-6 1M10 11l9-1',
  ghost: 'M6 20V10a6 6 0 0 1 12 0v10l-2-1.5-2 1.5-2-1.5-2 1.5-2-1.5zM9.5 10.5h.01M14.5 10.5h.01',
  dragon: 'M4 19c2-8 6-13 14-15-1 3-1 5 1 7-4 0-6 2-7 5 2 0 4 1 5 3H4zM14 9h.01',
  dark: 'M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z',
  steel: 'M12 3l7.8 4.5v9L12 21l-7.8-4.5v-9zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  fairy: 'M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6zM18 16l.8 2.2L21 19l-2.2.8L18 22l-.8-2.2L15 19l2.2-.8z',
}

/** A type's glyph; inherits its color from the surrounding text */
export function TypeIcon({ type, size = 20, className }: { type: string; size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d={PATHS[type] ?? PATHS.normal} />
    </svg>
  )
}

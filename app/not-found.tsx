import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="container" style={{ padding: '96px 0', textAlign: 'center' }}>
      <p style={{ fontWeight: 800, color: 'var(--faint)' }}>404</p>
      <h1 className="display" style={{ fontSize: 44, fontWeight: 800, marginTop: 8 }}>
        This Pokémon fled.
      </h1>
      <p style={{ marginTop: 10, color: 'var(--muted)', fontSize: 17 }}>There’s nothing at this address. It may be spelled differently.</p>
      <Link href="/" className="btn btn-brand" style={{ marginTop: 24 }}>
        Back to the Pokédex
      </Link>
    </main>
  )
}

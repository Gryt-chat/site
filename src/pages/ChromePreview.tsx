import { useEffect, useState } from 'react'
import { Chip } from '@gryt/ui'
import { NavBalanced, NavGrouped, NavSearch } from '../components/chrome/Navs'
import { FooterColophon, FooterMast, FooterStatement } from '../components/chrome/Footers'
import { pageTitle } from '../lib/title'

/**
 * Three nav-and-footer pairings, to be chosen between and then deleted.
 *
 * This route is throwaway. Two of the six components under `components/chrome`
 * go with it; the third pair moves into `Navbar.tsx` and `Footer.tsx`, and
 * `data/siteLinks.ts` stays whichever wins — that file is the reason the nav
 * and the footer stopped disagreeing about what exists.
 *
 * Each pairing renders with a slab of filler between the bar and the footer,
 * because chrome is only judgeable with something above and below it.
 */

const PAIRS = [
  {
    id: 'grouped',
    name: 'Grouped nav · colophon footer',
    archetypes: 'N11 + Ft2',
    note: 'The nav carries everything behind three triggers, so the footer stops being a sitemap. Most chrome, fewest places to look.',
    Nav: NavGrouped,
    Foot: FooterColophon,
  },
  {
    id: 'balanced',
    name: 'Balanced nav · mast-headed footer',
    archetypes: 'N1b + Ft1',
    note: 'Blog sits in the bar as itself; the six repositories go behind one Source trigger. The footer keeps community and the small print. Recommended.',
    Nav: NavBalanced,
    Foot: FooterMast,
  },
  {
    id: 'search',
    name: 'Search nav · statement footer',
    archetypes: 'N13 + Ft5',
    note: 'A visible search pill reaches every destination, so the footer has no navigational job and closes the page instead. Scales best, most new machinery.',
    Nav: NavSearch,
    Foot: FooterStatement,
  },
]

export function ChromePreview() {
  const [active, setActive] = useState(PAIRS[1].id)

  useEffect(() => {
    document.title = pageTitle('Chrome preview')
  }, [])

  const pair = PAIRS.find((p) => p.id === active) ?? PAIRS[0]
  const { Nav, Foot } = pair

  return (
    <>
      {/* The switch itself is not part of any candidate — it exists to compare
          them and leaves with this file. */}
      <div
        style={{
          position: 'fixed',
          bottom: 20,
          left: '50%',
          translate: '-50% 0',
          zIndex: 200,
          display: 'flex',
          gap: 8,
          padding: 10,
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 999,
        }}
      >
        {PAIRS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setActive(p.id)}
            style={{ background: 'none', border: 0, padding: 0, cursor: 'pointer' }}
          >
            <Chip tone={p.id === active ? 'primary' : 'neutral'}>{p.archetypes}</Chip>
          </button>
        ))}
      </div>

      <Nav />

      <main style={{ maxWidth: 'var(--max-w)', margin: '0 auto', padding: '56px 24px 0' }}>
        <p
          style={{
            fontSize: 12,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            color: 'var(--accent)',
            marginBottom: 12,
          }}
        >
          {pair.archetypes}
        </p>
        <h1
          style={{
            fontSize: 'clamp(28px, 3.6vw, 44px)',
            fontWeight: 800,
            letterSpacing: '-0.028em',
            textWrap: 'balance',
            margin: 0,
          }}
        >
          {pair.name}
        </h1>
        <p style={{ color: 'var(--text-dim)', maxWidth: '60ch', marginTop: 14, lineHeight: 1.6 }}>
          {pair.note}
        </p>

        <div style={{ height: 420, display: 'grid', placeItems: 'center', color: 'var(--text-dimmer)' }}>
          page content sits here
        </div>
      </main>

      <Foot />
    </>
  )
}

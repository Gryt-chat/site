import { useState } from 'react'
import { NavCentred, NavIcon, NavPill, NavTwoTier } from './Navs'
import { FooterMast, FooterMastSource, FooterStatementMast } from './Footers'

/**
 * Candidate chrome, tried on the real site rather than on a sample page.
 *
 * An empty page is the wrong place to judge a navbar. What matters is whether
 * the bar holds up over the blog index, a long post, the changelog and the
 * front page's hero — so this replaces the real chrome everywhere and stays put
 * while you browse.
 *
 * Off unless asked for, remembered while you look, and gone with this file once
 * a pair is chosen. It reads no state the site depends on and writes nothing
 * except its own two keys.
 */

export const NAVS = {
  pill: { label: 'Pill', Component: NavPill },
  icon: { label: 'Icon', Component: NavIcon },
  centred: { label: 'Centred', Component: NavCentred },
  tiers: { label: 'Two-tier', Component: NavTwoTier },
}

export const FOOTERS = {
  two: { label: '2 groups', Component: FooterMast },
  three: { label: '3 + source', Component: FooterMastSource },
  statement: { label: 'Statement', Component: FooterStatementMast },
}

export type NavKey = keyof typeof NAVS
export type FooterKey = keyof typeof FOOTERS

const NAV_KEY = 'gryt:chrome:nav'
const FOOTER_KEY = 'gryt:chrome:footer'
const ON_KEY = 'gryt:chrome:on'

function read(key: string, fallback: string): string {
  try {
    return localStorage.getItem(key) ?? fallback
  } catch {
    /* Private windows throw on the first read. Not worth a broken page. */
    return fallback
  }
}

function write(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {
    /* Nothing depends on it sticking. */
  }
}

/**
 * Whether candidate chrome is on.
 *
 * `?chrome=1` turns it on and `?chrome=0` off, both remembered, so the switch
 * survives clicking through the site. Nobody arrives here by accident.
 */
export function useChromePreview() {
  /* Read once during initialisation rather than in an effect. An effect would
     render the real chrome first and swap it a frame later, which is a flash on
     every page load and reads as a bug in whichever candidate is being judged. */
  const [on, setOn] = useState(() => {
    if (typeof window === 'undefined') return false
    const param = new URLSearchParams(window.location.search).get('chrome')
    if (param === '1' || param === '0') write(ON_KEY, param)
    return read(ON_KEY, '0') === '1'
  })
  const [nav, setNav] = useState<NavKey>(() =>
    typeof window === 'undefined' ? 'pill' : (read(NAV_KEY, 'pill') as NavKey),
  )
  const [footer, setFooter] = useState<FooterKey>(() =>
    typeof window === 'undefined' ? 'two' : (read(FOOTER_KEY, 'two') as FooterKey),
  )

  return {
    on,
    Nav: NAVS[nav]?.Component ?? NavPill,
    Footer: FOOTERS[footer]?.Component ?? FooterMast,
    nav,
    footer,
    pickNav: (k: NavKey) => {
      write(NAV_KEY, k)
      setNav(k)
    },
    pickFooter: (k: FooterKey) => {
      write(FOOTER_KEY, k)
      setFooter(k)
    },
    off: () => {
      write(ON_KEY, '0')
      setOn(false)
    },
  }
}

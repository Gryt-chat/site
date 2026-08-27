import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Dialog } from '@gryt/ui'
import { MdExpandMore, MdSearch } from 'react-icons/md'
import {
  actions,
  allLinks,
  community,
  getGoing,
  reading,
  source,
  type SiteLink,
} from '../../data/siteLinks'
import styles from './chrome.module.css'

/**
 * Three candidate navbars, for choosing between by looking at them.
 *
 * All three carry the same link inventory from `data/siteLinks.ts` and the same
 * tokens; they differ only in how the thirty destinations are arranged. Two of
 * them will be deleted.
 *
 * The one thing none of them does is what the current nav does — leave Blog out
 * of the desktop bar entirely and only offer it in the mobile sheet.
 */

/** One link, route or external, so the three navs cannot drift on this. */
export function Item({ link, className }: { link: SiteLink; className?: string }) {
  const cls = className ?? styles.link
  if (link.route) {
    return (
      <Link className={cls} to={link.href}>
        {link.label}
      </Link>
    )
  }
  return (
    <a
      className={cls}
      href={link.href}
      target={link.href.startsWith('mailto:') ? undefined : '_blank'}
      rel={`noreferrer${link.relMe ? ' me' : ''}`}
    >
      {link.label}
    </a>
  )
}

function Brand() {
  return (
    <Link to="/" className={styles.brand}>
      <img src="/logo.svg" alt="" className={styles.brandMark} />
      Gryt
    </Link>
  )
}

function Actions() {
  return (
    <div className={styles.actions}>
      <a className={styles.link} href={actions.openApp.href} target="_blank" rel="noreferrer">
        {actions.openApp.label}
      </a>
      <Button size="small" tone="primary" render={<a href={actions.download.href} />}>
        {actions.download.label}
      </Button>
    </div>
  )
}

/* ── A · Grouped ─────────────────────────────────────────────────────────
   N11. Three triggers open one full-width panel under the bar. Everything is
   reachable from the top of every page, and the footer gets to stop being a
   sitemap — which is the complaint this is answering.

   The panel is a plain surface rather than a dimming scrim over the page:
   design.md's voice is restrained, and a marketing site that dims itself to
   show six links reads corporate. */
const PANELS: { label: string; groups: { title: string; links: SiteLink[] }[] }[] = [
  {
    label: 'Product',
    groups: [
      { title: 'Get going', links: getGoing.slice(0, 2) },
      { title: 'Host it', links: getGoing.slice(2) },
    ],
  },
  {
    label: 'Read',
    groups: [
      { title: 'Pages', links: reading },
      { title: 'Community', links: community },
    ],
  },
  { label: 'Source', groups: [{ title: 'Repositories', links: source }] },
]

export function NavGrouped() {
  const [open, setOpen] = useState<string | null>(null)
  const wrap = useRef<HTMLElement>(null)

  /* Close on anything that means "I am done here" — a click outside, Escape.
     A panel that only closes by clicking its own trigger again is a panel
     people leave open by accident. */
  useEffect(() => {
    if (!open) return
    const away = (e: MouseEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(null)
    }
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(null)
    document.addEventListener('mousedown', away)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('mousedown', away)
      document.removeEventListener('keydown', esc)
    }
  }, [open])

  const panel = PANELS.find((p) => p.label === open)

  return (
    <header className={styles.shell} ref={wrap}>
      <div className={styles.bar}>
        <Brand />
        <nav className={styles.cluster} aria-label="Main">
          {PANELS.map((p) => (
            <button
              key={p.label}
              type="button"
              className={styles.trigger}
              data-open={open === p.label}
              aria-expanded={open === p.label}
              onClick={() => setOpen(open === p.label ? null : p.label)}
            >
              {p.label}
              <MdExpandMore size={16} aria-hidden="true" />
            </button>
          ))}
        </nav>
        <span className={styles.spacer} />
        <Actions />
      </div>

      {panel && (
        <div className={styles.panel}>
          <div className={styles.panelInner}>
            {panel.groups.map((g) => (
              <div key={g.title} className={styles.panelGroup}>
                <p className={styles.eyebrow}>{g.title}</p>
                {g.links.map((l) => (
                  <Item key={l.label} link={l} />
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}

/* ── B · Balanced ────────────────────────────────────────────────────────
   N1b. The four reading destinations sit in the bar as themselves — which is
   how Blog stops being a thing you can only find on a phone — and the six
   repositories, which are one idea rather than six, go behind one trigger. */
export function NavBalanced() {
  const [openSource, setOpenSource] = useState(false)
  const wrap = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!openSource) return
    const away = (e: MouseEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpenSource(false)
    }
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpenSource(false)
    document.addEventListener('mousedown', away)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('mousedown', away)
      document.removeEventListener('keydown', esc)
    }
  }, [openSource])

  return (
    <header className={styles.shell}>
      <div className={styles.bar}>
        <Brand />
        <span className={styles.spacer} />
        <nav className={styles.cluster} aria-label="Main">
          {reading.map((l) => (
            <Item key={l.label} link={l} />
          ))}
          <a className={styles.link} href="https://docs.gryt.chat" target="_blank" rel="noreferrer">
            Docs
          </a>
          <div className={styles.dropdownWrap} ref={wrap}>
            <button
              type="button"
              className={styles.trigger}
              data-open={openSource}
              aria-expanded={openSource}
              onClick={() => setOpenSource((v) => !v)}
            >
              Source
              <MdExpandMore size={16} aria-hidden="true" />
            </button>
            {openSource && (
              <div className={styles.dropdown}>
                {source.map((l) => (
                  <Item key={l.label} link={l} />
                ))}
              </div>
            )}
          </div>
        </nav>
        <span className={styles.spacer} />
        <Actions />
      </div>
    </header>
  )
}

/* ── C · Search ──────────────────────────────────────────────────────────
   N13. A visible pill rather than a hidden ⌘K, because a shortcut nobody can
   see is a shortcut nobody uses. Thirty destinations stop being a layout
   problem, and the count can grow without the chrome changing shape.

   The honest question about this one is whether people search a thirteen-page
   marketing site at all, or whether they scan it. */
export function NavSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen(true)
      }
    }
    document.addEventListener('keydown', key)
    return () => document.removeEventListener('keydown', key)
  }, [])

  const q = query.trim().toLowerCase()
  const results = allLinks
    .map((g) => ({ ...g, links: g.links.filter((l) => l.label.toLowerCase().includes(q)) }))
    .filter((g) => g.links.length)

  return (
    <header className={styles.shell}>
      <div className={styles.bar}>
        <Brand />
        <nav className={styles.cluster} aria-label="Main">
          <Item link={reading[1]} />
          <Item link={reading[2]} />
        </nav>
        <span className={styles.spacer} />
        <button type="button" className={styles.searchPill} onClick={() => setOpen(true)}>
          <MdSearch size={16} aria-hidden="true" />
          Search Gryt…
          <span className={styles.kbd}>⌘K</span>
        </button>
        <span className={styles.spacer} />
        <Actions />
      </div>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Popup aria-label="Search Gryt">
            <Dialog.Title>Search</Dialog.Title>
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pages, docs, repositories…"
              className={styles.searchPill}
              style={{ width: '100%', borderRadius: 10 }}
            />
            <div className={styles.spotlightResults}>
              {results.length === 0 && <p className={styles.spotlightHint}>Nothing matches that.</p>}
              {results.map((g) => (
                <div key={g.group} className={styles.spotlightGroup}>
                  <p className={styles.eyebrow}>{g.group}</p>
                  {g.links.map((l) => (
                    <Item key={l.label} link={l} className={styles.spotlightRow} />
                  ))}
                </div>
              ))}
            </div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </header>
  )
}

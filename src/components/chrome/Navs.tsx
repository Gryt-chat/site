import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Dialog } from '@gryt/ui'
import { MdSearch } from 'react-icons/md'
import { actions, allLinks, reading, type SiteLink } from '../../data/siteLinks'
import styles from './chrome.module.css'

/**
 * Four takes on one nav, after the first round.
 *
 * The direction was settled by looking: the search bar is clean and simple and
 * that is the one to keep, but it dropped Why Gryt? — which is the page that
 * explains the whole project, so it cannot be the thing search has to find.
 *
 * So all four carry Why Gryt?, Blog and Changelog as themselves, and differ in
 * how search sits beside them. The mega-menu and the two footers that went with
 * the other rounds are gone; there is no point maintaining candidates nobody
 * picked.
 */

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

/** Why Gryt?, Blog, Changelog. Sponsors stays in the footer — it is a page you
    go to once, not one you navigate to from the top of every other page. */
const barLinks = reading.slice(0, 3)

/* ── The spotlight, shared by all four ───────────────────────────────────
   One implementation, so the four differ in how you *reach* search rather
   than in what search then does. */
function useSpotlight() {
  const [open, setOpen] = useState(false)
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
  return { open, setOpen }
}

function Spotlight({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()
  const results = allLinks
    .map((g) => ({ ...g, links: g.links.filter((l) => l.label.toLowerCase().includes(q)) }))
    .filter((g) => g.links.length)

  return (
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
            className={styles.searchInput}
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
  )
}

/* ── 1 · Pill ────────────────────────────────────────────────────────────
   The one that was picked, with Why Gryt? restored. Links left of a search
   pill wide enough to read as a field rather than a button. */
export function NavPill() {
  const { open, setOpen } = useSpotlight()
  return (
    <header className={styles.shell}>
      <div className={styles.bar}>
        <Brand />
        <nav className={styles.cluster} aria-label="Main">
          {barLinks.map((l) => (
            <Item key={l.label} link={l} />
          ))}
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
      <Spotlight open={open} setOpen={setOpen} />
    </header>
  )
}

/* ── 2 · Icon ────────────────────────────────────────────────────────────
   The quietest of the four. Search is an icon beside the links, so the bar is
   nothing but wordmark, four words and the two buttons.

   The trade is real: an icon is smaller and less inviting than a field, and
   somebody who does not already know there is search will not find it. Docs
   earns its place in the bar here because there is room for it. */
export function NavIcon() {
  const { open, setOpen } = useSpotlight()
  return (
    <header className={styles.shell}>
      <div className={styles.bar}>
        <Brand />
        <span className={styles.spacer} />
        <nav className={styles.cluster} aria-label="Main">
          {barLinks.map((l) => (
            <Item key={l.label} link={l} />
          ))}
          <a className={styles.link} href="https://docs.gryt.chat" target="_blank" rel="noreferrer">
            Docs
          </a>
          <button
            type="button"
            className={styles.iconButton}
            onClick={() => setOpen(true)}
            aria-label="Search Gryt"
          >
            <MdSearch size={18} aria-hidden="true" />
          </button>
        </nav>
        <span className={styles.spacer} />
        <Actions />
      </div>
      <Spotlight open={open} setOpen={setOpen} />
    </header>
  )
}

/* ── 3 · Centred ─────────────────────────────────────────────────────────
   Search in the middle of the bar, links pushed right against the actions.
   Makes search the thing the bar is *for*, which is honest if it is how people
   are expected to get around — and overstated if it is not. */
export function NavCentred() {
  const { open, setOpen } = useSpotlight()
  return (
    <header className={styles.shell}>
      <div className={styles.bar}>
        <Brand />
        <span className={styles.spacer} />
        <button
          type="button"
          className={`${styles.searchPill} ${styles.searchWide}`}
          onClick={() => setOpen(true)}
        >
          <MdSearch size={16} aria-hidden="true" />
          Search Gryt…
          <span className={styles.kbd}>⌘K</span>
        </button>
        <span className={styles.spacer} />
        <nav className={styles.cluster} aria-label="Main">
          {barLinks.map((l) => (
            <Item key={l.label} link={l} />
          ))}
        </nav>
        <Actions />
      </div>
      <Spotlight open={open} setOpen={setOpen} />
    </header>
  )
}

/* ── 4 · Two-tier ────────────────────────────────────────────────────────
   Brand and the two actions on top, links and search on a hairline row under
   it. More room than the others and a more editorial rhythm, at the cost of
   twice the vertical space — which a sticky bar pays for on every scroll. */
export function NavTwoTier() {
  const { open, setOpen } = useSpotlight()
  return (
    <header className={styles.shell}>
      <div className={`${styles.bar} ${styles.barTight}`}>
        <Brand />
        <span className={styles.spacer} />
        <Actions />
      </div>
      <div className={styles.secondTier}>
        <div className={`${styles.bar} ${styles.barTight}`}>
          <nav className={styles.cluster} aria-label="Main">
            {barLinks.map((l) => (
              <Item key={l.label} link={l} />
            ))}
            <a className={styles.link} href="https://docs.gryt.chat" target="_blank" rel="noreferrer">
              Docs
            </a>
          </nav>
          <span className={styles.spacer} />
          <button type="button" className={styles.searchPill} onClick={() => setOpen(true)}>
            <MdSearch size={16} aria-hidden="true" />
            Search Gryt…
            <span className={styles.kbd}>⌘K</span>
          </button>
        </div>
      </div>
      <Spotlight open={open} setOpen={setOpen} />
    </header>
  )
}

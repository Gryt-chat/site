import { Link } from 'react-router-dom'
import { community, getGoing, legal, reading, source, tagline } from '../../data/siteLinks'
import { Item } from './Navs'
import styles from './chrome.module.css'

/**
 * Three takes on the mast-headed footer, after the first round picked it.
 *
 * All three anchor on the wordmark and the tagline and keep the small print at
 * the bottom under a rule. They differ in how much the middle carries, which is
 * the actual question: the old footer held thirty targets and was unreadable,
 * and the nav above now holds four, so somewhere between those is right.
 */

function Legal() {
  return (
    <>
      <span>AGPL-3.0</span>
      {legal.map((l) => (
        <span key={l.label} style={{ display: 'contents' }}>
          <span className={styles.dot} aria-hidden="true">
            ·
          </span>
          <Item link={l} />
        </span>
      ))}
      <span className={styles.dot} aria-hidden="true">
        ·
      </span>
      <span>Built in the open since 2022</span>
    </>
  )
}

function Mast({ big = false }: { big?: boolean }) {
  return (
    <div>
      <Link to="/" className={styles.brand}>
        <img src="/logo.svg" alt="" className={styles.brandMark} />
        Gryt
      </Link>
      <p className={big ? styles.statement : styles.mastTagline}>{tagline}</p>
    </div>
  )
}

function Group({ title, links }: { title: string; links: typeof getGoing }) {
  return (
    <div className={styles.mastGroup}>
      <p className={styles.eyebrow}>{title}</p>
      {links.map((l) => (
        <Item key={l.label} link={l} />
      ))}
    </div>
  )
}

/* ── 1 · Two groups ──────────────────────────────────────────────────────
   What was picked. The footer keeps only what the bar deliberately left out:
   the ways in, and the people. */
export function FooterMast() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.mastTop}>
          <Mast />
          <div className={styles.mastGroups}>
            <Group title="Get going" links={getGoing} />
            <Group title="Community" links={community} />
          </div>
        </div>
        <hr className={styles.rule} />
        <div className={styles.colophon}>
          <Legal />
        </div>
      </div>
    </footer>
  )
}

/* ── 2 · Three groups, with the source back ──────────────────────────────
   The six repositories return, because with search-only chrome above there is
   nowhere else on the page they live, and "you can read all of it" is most of
   what Gryt is claiming. Three narrower columns rather than two wide ones. */
export function FooterMastSource() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.mastTop}>
          <Mast />
          <div className={styles.mastGroups}>
            <Group title="Get going" links={getGoing} />
            <Group title="Source" links={source} />
            <Group title="Community" links={community} />
          </div>
        </div>
        <hr className={styles.rule} />
        <div className={styles.colophon}>
          <Legal />
        </div>
      </div>
    </footer>
  )
}

/* ── 3 · Statement-led ───────────────────────────────────────────────────
   The tagline at section-heading size so the footer closes the page, with the
   groups underneath rather than beside. Ft1 and Ft5 crossed: the sentence does
   the work Ft5 wanted and the columns still carry the links.

   The one to watch is height — this is the tallest of the three, and a footer
   taller than a phone screen is a footer people scroll past. */
export function FooterStatementMast() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <Mast big />
        <div className={`${styles.mastGroups} ${styles.groupsRow}`}>
          <Group title="Get going" links={getGoing} />
          <Group title="Read" links={reading} />
          <Group title="Community" links={community} />
        </div>
        <hr className={styles.rule} />
        <div className={styles.colophon}>
          <Legal />
        </div>
      </div>
    </footer>
  )
}

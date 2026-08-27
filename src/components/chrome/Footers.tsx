import { Link } from 'react-router-dom'
import { community, getGoing, legal, reading, source, tagline } from '../../data/siteLinks'
import { Item } from './Navs'
import styles from './chrome.module.css'

/**
 * Three candidate footers, each the complement of one nav.
 *
 * The pairing is the point: how much the footer has to carry depends entirely
 * on how much the nav already did. A footer holding twenty-four links under a
 * nav holding three is the shape the site has now, and it is why the footer is
 * hard to read.
 */

function Legal({ separator = '·' }: { separator?: string }) {
  return (
    <>
      <span>AGPL-3.0</span>
      {legal.map((l) => (
        <span key={l.label} style={{ display: 'contents' }}>
          <span className={styles.dot} aria-hidden="true">
            {separator}
          </span>
          <Item link={l} />
        </span>
      ))}
      <span className={styles.dot} aria-hidden="true">
        {separator}
      </span>
      <span>Built in the open since 2022</span>
    </>
  )
}

/* ── A · Colophon ────────────────────────────────────────────────────────
   Ft2, the complement of the grouped nav. One hairline row. If the nav already
   carries every destination on every page, repeating them down here is not
   navigation, it is furniture. */
export function FooterColophon() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.colophon}>
          <Link to="/" className={styles.brand} style={{ fontSize: 15 }}>
            <img src="/logo.svg" alt="" className={styles.brandMark} style={{ width: 22, height: 22 }} />
            Gryt
          </Link>
          <Legal />
        </div>
      </div>
    </footer>
  )
}

/* ── B · Mast-headed ─────────────────────────────────────────────────────
   Ft1, the complement of the balanced nav. The wordmark and the tagline anchor
   the band, and the footer keeps only what the bar deliberately left out:
   community, the ways in, and the small print.

   No repositories here — the nav's Source trigger owns those, and a link in
   both places is how the two drifted apart in the first place. */
export function FooterMast() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.mastTop}>
          <div>
            <Link to="/" className={styles.brand}>
              <img src="/logo.svg" alt="" className={styles.brandMark} />
              Gryt
            </Link>
            <p className={styles.mastTagline}>{tagline}</p>
          </div>

          <div className={styles.mastGroups}>
            <div className={styles.mastGroup}>
              <p className={styles.eyebrow}>Get going</p>
              {getGoing.map((l) => (
                <Item key={l.label} link={l} />
              ))}
            </div>
            <div className={styles.mastGroup}>
              <p className={styles.eyebrow}>Community</p>
              {community.map((l) => (
                <Item key={l.label} link={l} />
              ))}
            </div>
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

/* ── C · Statement ───────────────────────────────────────────────────────
   Ft5, the complement of the search nav. If search is how people get anywhere,
   the footer has no navigational job left, so it closes the page with the one
   sentence the whole site is about.

   Section-heading type from design.md rather than a size invented for this. */
export function FooterStatement() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <p className={styles.statement}>{tagline}</p>
        <div className={styles.statementFoot}>
          <Link to="/" className={styles.brand} style={{ fontSize: 15 }}>
            <img src="/logo.svg" alt="" className={styles.brandMark} style={{ width: 22, height: 22 }} />
            Gryt
          </Link>
          <Item link={reading[1]} />
          <Item link={source[0]} />
          <Item link={community[0]} />
          <Legal />
        </div>
      </div>
    </footer>
  )
}

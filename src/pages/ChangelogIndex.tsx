import { Link } from 'react-router-dom'
import { useEffect, useState, type ReactNode } from 'react'
import { listReleases, SURFACES, type ListedRelease, type Surface } from '../lib/changelog'
import { pageTitle } from '../lib/title'
import { Chip } from "@gryt/ui";
import styles from './ChangelogIndex.module.css'

const DATE = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

/**
 * The one kind worth marking in a list of eighty-two. New and Fixed are what a
 * changelog is; a security fix is the reason somebody scrolls one.
 */
function hasSecurity(release: ListedRelease): boolean {
  return release.changes?.some((c) => c.kind === 'security') ?? false
}

function LineRow({
  version,
  linked,
  children,
}: {
  version: string
  linked: boolean
  children: ReactNode
}) {
  if (!linked) return <span className={styles.lineRow}>{children}</span>
  return (
    <Link to={`/changelog/${version}`} className={`${styles.lineRow} ${styles.lineLink}`}>
      {children}
    </Link>
  )
}

/**
 * Every release, and one line saying what it did. Two tiers: a release with a note keeps its
 * card, every other is one line. The story of a feature is a blog post.
 */
export function ChangelogIndex() {
  const [surface, setSurface] = useState<Surface>('app')

  useEffect(() => {
    document.title = pageTitle('Changelog')
  }, [])

  const current = SURFACES.find((s) => s.id === surface)!
  const rows = listReleases(surface)
  const noted = rows.filter((r) => r.entry).length

  return (
    <main className={styles.page}>
      <header className={styles.head}>
        <div className={styles.headRow}>
          <div>
            <h1 className={styles.title}>What changed, and where</h1>
            <p className={styles.sub}>
              Every release, and what it did. Gryt is four things that ship on their
              own clocks — the app is what you install, the rest are what a server
              runs. When something big lands there is <Link to="/blog">a post about
              it</Link>.
            </p>
          </div>
        </div>
      </header>

      <div className={styles.surfaces} role="tablist" aria-label="Surface">
        {SURFACES.map((s) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={s.id === surface}
            className={styles.surface}
            onClick={() => setSurface(s.id)}
          >
            <span className={styles.surfaceName}>{s.name}</span>
            <span className={styles.surfaceMeta}>
              {listReleases(s.id)[0]?.version ?? '—'}
            </span>
          </button>
        ))}
      </div>

      <div className={styles.summary}>
        <p>{current.blurb}</p>
        {rows.length > 0 && (
          <span className={styles.count}>
            {rows.length} release{rows.length === 1 ? '' : 's'}
            {noted > 0 && ` · ${noted} with notes`}
          </span>
        )}
      </div>

      {rows.length === 0 ? (
        <p className={styles.empty}>
          No lines written for {current.name.toLowerCase()} yet. The releases are real
          and their commit ranges are readable, so nothing is missing but the writing.
        </p>
      ) : (
        <ol className={styles.stages}>
          {rows.map((release) => (
            <li
              key={release.version}
              className={release.entry ? styles.stage : styles.plain}
            >
              {release.entry ? (
                <Link to={`/changelog/${release.version}`} className={styles.link}>
                  <span className={styles.rail} aria-hidden="true" />
                  <span className={styles.body}>
                    <span className={styles.versionRow}>
                      <span className={styles.version}>{release.version}</span>
                      {release.channel === 'beta' && (
                        <Chip className={styles.beta} tone="warning">
                          Beta
                        </Chip>
                      )}
                      {hasSecurity(release) && (
                        <Chip className={styles.beta} tone="warning">
                          Security
                        </Chip>
                      )}
                      <time
                        className={styles.date}
                        dateTime={new Date(release.date).toISOString()}
                      >
                        {DATE.format(new Date(release.date))}
                      </time>
                    </span>
                    <span className={styles.headline}>
                      {release.entry.frontmatter.headline ?? release.line}
                    </span>
                    <span className={styles.more} aria-hidden="true">
                      Read the notes →
                    </span>
                  </span>
                </Link>
              ) : (
                /* Every app release has a page. The other three surfaces have
                   lines and nothing to open, so their rows stay plain. */
                <LineRow version={release.version} linked={surface === 'app'}>
                  <span className={styles.rail} aria-hidden="true" />
                  <span className={styles.lineVersion}>{release.version}</span>
                  <span className={styles.line}>
                    {release.channel === 'beta' && (
                      <Chip className={styles.beta} tone="warning">
                        Beta
                      </Chip>
                    )}
                    {hasSecurity(release) && (
                      <Chip className={styles.beta} tone="warning">
                        Security
                      </Chip>
                    )}
                    {release.line}
                  </span>
                  <time
                    className={styles.date}
                    dateTime={new Date(release.date).toISOString()}
                  >
                    {DATE.format(new Date(release.date))}
                  </time>
                </LineRow>
              )}
            </li>
          ))}
        </ol>
      )}
    </main>
  )
}

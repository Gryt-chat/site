import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { releases } from '../lib/changelog'
import { pageTitle } from '../lib/title'
import { Chip } from "@gryt/ui";
import styles from './ChangelogIndex.module.css'

const DATE = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

export function ChangelogIndex() {
  useEffect(() => {
    document.title = pageTitle('Changelog')
  }, [])

  return (
    <main className={styles.page}>
      <header className={styles.head}>
        <h1 className={styles.title}>Changelog</h1>
        <p className={styles.sub}>
          What changed in each release of Gryt, newest first.
        </p>
      </header>

      <ol className={styles.stages}>
        {releases.map((release) => (
          <li key={release.slug} className={styles.stage}>
            <Link to={`/changelog/${release.slug}`} className={styles.link}>
              <span className={styles.rail} aria-hidden="true" />
              <span className={styles.body}>
                <span className={styles.versionRow}>
                  <span className={styles.version}>
                    {release.frontmatter.version}
                  </span>
                  {release.frontmatter.channel === 'beta' && (
                    <Chip className={styles.beta} tone="warning">
                      Beta
                    </Chip>
                  )}
                  <time
                    className={styles.date}
                    dateTime={new Date(release.frontmatter.date).toISOString()}
                  >
                    {DATE.format(new Date(release.frontmatter.date))}
                  </time>
                </span>
                {release.frontmatter.headline && (
                  <span className={styles.headline}>
                    {release.frontmatter.headline}
                  </span>
                )}
                <span className={styles.more} aria-hidden="true">
                  Read the notes →
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </main>
  )
}

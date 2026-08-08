import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { releases } from '../lib/changelog'
import styles from './ChangelogIndex.module.css'

export function ChangelogIndex() {
  useEffect(() => {
    document.title = 'Changelog — Gryt'
  }, [])

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Changelog</h1>
        <p className={styles.subtitle}>
          What changed in each release of Gryt, newest first.
        </p>
      </div>

      <div className={styles.grid}>
        {releases.map((release) => (
          <Link
            key={release.slug}
            to={`/changelog/${release.slug}`}
            className={styles.card}
          >
            <div className={styles.meta}>
              <span className={styles.version}>v{release.frontmatter.version}</span>
              {release.frontmatter.channel === 'beta' && (
                <span className={styles.beta}>Beta</span>
              )}
              <span className={styles.dot}>·</span>
              <time dateTime={new Date(release.frontmatter.date).toISOString()}>
                {new Date(release.frontmatter.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>
            {release.frontmatter.headline && (
              <p className={styles.headline}>{release.frontmatter.headline}</p>
            )}
          </Link>
        ))}
      </div>
    </main>
  )
}

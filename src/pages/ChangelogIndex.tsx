import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAllReleases, visible } from '../lib/changelog'
import { pageTitle } from '../lib/title'
import { Chip, Switch } from "@gryt/ui";
import styles from './ChangelogIndex.module.css'

const DATE = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

/* Remembered, because somebody who turns betas on is telling you what kind of
   reader they are, and asking again on the next visit is just forgetting. */
const BETA_KEY = 'gryt:changelog:beta'

function readBetaPreference(): boolean {
  try {
    return localStorage.getItem(BETA_KEY) === '1'
  } catch {
    /* Private windows and blocked site data both throw here. Off is the right
       default for the reader who cannot be asked. */
    return false
  }
}

export function ChangelogIndex() {
  const { all, loading } = useAllReleases()
  const [showBeta, setShowBeta] = useState(readBetaPreference)

  useEffect(() => {
    document.title = pageTitle('Changelog')
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(BETA_KEY, showBeta ? '1' : '0')
    } catch { /* nothing to do about it, and nothing depends on it */ }
  }, [showBeta])

  const shown = visible(all, showBeta)
  const betaCount = all.length - visible(all, false).length

  return (
    <main className={styles.page}>
      <header className={styles.head}>
        <div className={styles.headRow}>
          <div>
            <h1 className={styles.title}>Changelog</h1>
            <p className={styles.sub}>
              What changed in each release of Gryt, newest first.
            </p>
          </div>
          {betaCount > 0 && (
            <label className={styles.betaToggle}>
              <Switch
                checked={showBeta}
                onCheckedChange={(next: boolean) => setShowBeta(next)}
              />
              <span>Show beta releases</span>
            </label>
          )}
        </div>
      </header>

      <ol className={styles.stages}>
        {shown.map((release) => (
          <li key={release.slug} className={styles.stage}>
            <Link to={`/changelog/${release.slug}`} className={styles.link}>
              <span className={styles.rail} aria-hidden="true" />
              <span className={styles.body}>
                <span className={styles.versionRow}>
                  <span className={styles.version}>{release.version}</span>
                  {release.channel === 'beta' && (
                    <Chip className={styles.beta} tone="warning">
                      Beta
                    </Chip>
                  )}
                  <time
                    className={styles.date}
                    dateTime={new Date(release.date).toISOString()}
                  >
                    {DATE.format(new Date(release.date))}
                  </time>
                </span>
                {release.headline && (
                  <span className={styles.headline}>{release.headline}</span>
                )}
                <span className={styles.more} aria-hidden="true">
                  Read the notes →
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ol>

      {/* Only while the fetch is out, and only when there is nothing yet to
          read. Once the written notes are on screen a spinner underneath them
          is noise. */}
      {loading && shown.length === 0 && (
        <p className={styles.loading}>Loading the release notes…</p>
      )}
    </main>
  )
}

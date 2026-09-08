import { Fragment, Suspense, useEffect } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { MdChevronLeft } from 'react-icons/md'
import { Chip } from '@gryt/ui'
import { getAppLine, getRelease, groupChanges, KIND_LABELS } from '../lib/changelog'
import { pageTitle } from '../lib/title'
import { Clip } from '../components/Clip'
import { LightboxImage } from '../components/Lightbox'
import styles from './ChangelogEntry.module.css'
import type { ComponentPropsWithoutRef } from 'react'
import type { ReleaseLine } from '../lib/changelog'

function MdxLink({ href, ...rest }: ComponentPropsWithoutRef<'a'>) {
  if (href?.startsWith('/')) {
    return <Link to={href} {...rest} />
  }
  return <a href={href} {...rest} target="_blank" rel="noreferrer" />
}

// Screenshots in release notes are the main reason to want a lightbox — the
// interesting detail is usually smaller than the column.
function MdxImage(props: ComponentPropsWithoutRef<'img'>) {
  return <LightboxImage {...props} />
}

// Clip is a named component rather than a `video` override because MDX only routes
// markdown-generated elements through this map; a literal <video> would lose its attributes.
const components = { a: MdxLink, img: MdxImage, Clip }

/**
 * The two kinds that change what a reader does about the release. The rest, and
 * a kind added since this built, stay neutral.
 */
const TONES: Record<string, 'primary' | 'warning' | 'neutral'> = {
  new: 'primary',
  security: 'warning',
}

export function ChangelogEntry() {
  const { version } = useParams<{ version: string }>()
  const release = version ? getRelease(version) : undefined
  /* No prose, but the release may still have been split into kinds. The app's
     what's-new modal links here for every version it shows. */
  const line = !release && version ? getAppLine(version) : undefined

  useEffect(() => {
    const shown = release?.frontmatter.version ?? line?.version
    if (shown) document.title = pageTitle(`${shown} | Changelog`)
  }, [release, line])

  if (!release && line) return <LineOnly line={line} />

  /* Every note is compiled in and every line is imported, so a version that is
     neither is not one that was released. */
  if (!release) return <Navigate to="/changelog" replace />

  const { frontmatter } = release

  return (
    <main className={styles.page}>
      <Link to="/changelog" className={styles.back}>
        <MdChevronLeft size={16} />
        All releases
      </Link>

      <header className={styles.header}>
        <div className={styles.versionRow}>
          <h1 className={styles.title}>Gryt {frontmatter.version}</h1>
          {frontmatter.channel === 'beta' && (
            <span className={styles.beta}>Beta</span>
          )}
        </div>
        {frontmatter.headline && (
          <p className={styles.headline}>{frontmatter.headline}</p>
        )}
        <div className={styles.meta}>
          <time dateTime={new Date(frontmatter.date).toISOString()}>
            {new Date(frontmatter.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </div>
      </header>

      <div className={styles.prose}>
        <Suspense fallback={<p>Loading release notes…</p>}>
          <release.Component components={components} />
        </Suspense>
      </div>
    </main>
  )
}

/**
 * A release nobody wrote up. Same shape as the app's modal, so somebody
 * following "Read more" lands on what they have just read.
 */
function LineOnly({ line }: { line: ReleaseLine }) {
  const groups = line.changes?.length ? groupChanges(line.changes) : null

  return (
    <main className={styles.page}>
      <Link to="/changelog" className={styles.back}>
        <MdChevronLeft size={16} />
        All releases
      </Link>

      <header className={styles.header}>
        <div className={styles.versionRow}>
          <h1 className={styles.title}>Gryt {line.version}</h1>
          {line.channel === 'beta' && <span className={styles.beta}>Beta</span>}
        </div>
        <div className={styles.meta}>
          <time dateTime={new Date(line.date).toISOString()}>
            {new Date(line.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </div>
      </header>

      {groups ? (
        <dl className={styles.kinds}>
          {groups.map(([kind, items]) => (
            <Fragment key={kind}>
              <dt>
                <Chip tone={TONES[kind] ?? 'neutral'}>{KIND_LABELS[kind] ?? kind}</Chip>
              </dt>
              <dd>
                {items.map((text) => (
                  <p key={text}>{text}</p>
                ))}
              </dd>
            </Fragment>
          ))}
        </dl>
      ) : (
        /* Before 1.10 nobody split a release up. One sentence is all there is. */
        <p className={styles.onlyLine}>{line.line}</p>
      )}

      <p className={styles.noNote}>
        {groups
          ? 'Nobody wrote this one up, so the list above is all of it. '
          : 'One line is all this release got. '}
        When something lands that&rsquo;s worth explaining there&rsquo;s{' '}
        <Link to="/blog">a post about it</Link> instead.
      </p>
    </main>
  )
}

import { Suspense, useEffect } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { MdChevronLeft } from 'react-icons/md'
import { getRelease } from '../lib/changelog'
import { pageTitle } from '../lib/title'
import { Clip } from '../components/Clip'
import { LightboxImage } from '../components/Lightbox'
import styles from './ChangelogEntry.module.css'
import type { ComponentPropsWithoutRef } from 'react'

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

// Clip is a named component rather than a `video` override because MDX only
// routes markdown-generated elements through this map — a literal <video> tag
// in a note would render with none of its attributes, which is exactly the
// failure it exists to prevent. It lives in components/ now because the front
// page shows captures too, and two answers to "how does a clip behave" is one
// too many.
const components = { a: MdxLink, img: MdxImage, Clip }

export function ChangelogEntry() {
  const { version } = useParams<{ version: string }>()
  const release = version ? getRelease(version) : undefined

  useEffect(() => {
    if (release) {
      document.title = pageTitle(`${release.frontmatter.version} | Changelog`)
    }
  }, [release])

  /* Every note is compiled in, so a version that is not here is not one that
     exists. Nothing to wait for. */
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

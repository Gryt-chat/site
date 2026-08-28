import { Suspense, useEffect } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { MdChevronLeft } from 'react-icons/md'
import { useAllReleases, findRelease, type AnyRelease } from '../lib/changelog'
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

/**
 * A drafted note, rendered from its shape.
 *
 * The prose classes are the same ones the compiled MDX lands in, so a drafted
 * note and a written one are the same page in the same type. What a drafted
 * note cannot have is a picture or a clip: the drafter works from a commit
 * range and has nothing to photograph.
 */
function Drafted({ release }: { release: Extract<AnyRelease, { kind: 'drafted' }> }) {
  return (
    <div className={styles.prose}>
      {release.intro.map((paragraph, i) => (
        <p key={`intro-${i}`}>{paragraph}</p>
      ))}
      {release.sections.map((section) => (
        <section key={section.heading}>
          <h2>{section.heading}</h2>
          {section.body.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </section>
      ))}

      {release.recap.length > 0 && (
        <>
          <hr />
          {release.recap.map((group) => (
            <section key={group.group}>
              <h3>{group.group}</h3>
              <ul>
                {group.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
        </>
      )}
    </div>
  )
}

export function ChangelogEntry() {
  const { version } = useParams<{ version: string }>()
  const { all, loading } = useAllReleases()
  const release = version ? findRelease(all, version) : undefined

  useEffect(() => {
    if (release) {
      document.title = pageTitle(`${release.version} | Changelog`)
    }
  }, [release])

  /* The drafted notes arrive over the network, so "not found" is only true
     once they have. Redirecting before then sends anyone following a link to
     a drafted note back to the index. */
  if (!release) {
    if (loading) return <main className={styles.page}><p>Loading release notes…</p></main>
    return <Navigate to="/changelog" replace />
  }

  const frontmatter = release

  return (
    <main className={styles.page}>
      <Link to="/changelog" className={styles.back}>
        <MdChevronLeft size={16} />
        All releases
      </Link>

      {/* Only reachable under ?drafts=1, and the point of being able to reach
          it at all is to read the note on the page it would go on. Saying so
          here means nobody mistakes this URL for the published one. */}
      {release.kind === 'drafted' && release.status !== 'published' && (
        <p className={styles.draftNotice}>
          Nobody has read this yet. A model drafted it from the commits in the
          release, and it is not on the changelog for anybody else.
        </p>
      )}

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
          {/* Which parts of Gryt this release moved. Not in the prose on
              purpose — a note that says "the SFU" is aimed at the wrong reader,
              and somebody running their own server still needs to know whether
              the server changed or whether this is only the app. */}
          {release.kind === 'drafted' && release.source?.components?.length ? (
            <span className={styles.parts}>
              {release.source.components.join(' · ')}
            </span>
          ) : null}
        </div>
      </header>

      {release.kind === 'written' ? (
        <div className={styles.prose}>
          <Suspense fallback={<p>Loading release notes…</p>}>
            <release.Component components={components} />
          </Suspense>
        </div>
      ) : (
        <Drafted release={release} />
      )}
    </main>
  )
}

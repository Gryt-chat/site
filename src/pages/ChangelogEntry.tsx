import { Suspense, useEffect } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { MdChevronLeft } from 'react-icons/md'
import { useAllReleases, findRelease, type AnyRelease } from '../lib/changelog'
import { pageTitle } from '../lib/title'
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

/**
 * A clip in release notes plays itself, silently, forever.
 *
 * These are screen recordings of an interface — a speaking ring pulsing, a
 * layout rearranging — so they are closer to an animated image than to video.
 * Nobody wants to press play on a four second loop, and nobody wants sound
 * from a page they are reading.
 *
 * The attributes are set here rather than per post so a note cannot ship a clip
 * that autoplays with sound. `muted` and `playsInline` are also what make
 * autoplay work at all: iOS refuses fullscreen-by-default inline video, and
 * every browser refuses to autoplay anything audible.
 */
function Clip({
  src,
  av1,
  ...props
}: Omit<ComponentPropsWithoutRef<'video'>, 'children'> & { av1?: string }) {
  return (
    <video
      {...props}
      autoPlay
      muted
      loop
      playsInline
      controls={false}
      preload="metadata"
    >
      {/* AV1 first: it holds far more detail per byte, which matters for a
          screen recording where the interesting part is a thin ring. Browsers
          that cannot decode it — Safari without hardware AV1, mostly — fall
          through to the H.264 copy, which is encoded well past the point of
          visible loss rather than merely small. */}
      {av1 && <source src={av1} type="video/mp4; codecs=av01.0.05M.08" />}
      <source src={src} type="video/mp4" />
    </video>
  )
}

// Clip is a named component rather than a `video` override because MDX only
// routes markdown-generated elements through this map — a literal <video> tag
// in a note would render with none of these attributes, which is exactly the
// failure this exists to prevent.
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

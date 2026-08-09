import { useEffect } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { MdChevronLeft } from 'react-icons/md'
import { getRelease } from '../lib/changelog'
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

export function ChangelogEntry() {
  const { version } = useParams<{ version: string }>()
  const release = version ? getRelease(version) : undefined

  useEffect(() => {
    if (release) {
      document.title = pageTitle(`${release.frontmatter.version} | Changelog`)
    }
  }, [release])

  if (!release) return <Navigate to="/changelog" replace />

  const { frontmatter, Component } = release

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
        <Component components={components} />
      </div>
    </main>
  )
}

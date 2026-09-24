import { Fragment, Suspense, useEffect } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { MdChevronLeft } from 'react-icons/md'
import {
  PiBellFill,
  PiChatCircleFill,
  PiDeviceMobileFill,
  PiDotsThreeCircleFill,
  PiGearFill,
  PiHardDrivesFill,
  PiHouseFill,
  PiMicrophoneFill,
  PiShieldCheckFill,
} from 'react-icons/pi'
import { Chip } from '@gryt/ui'
import { getAppLine, getRelease, groupByArea, groupChanges, KIND_LABELS, splitSecurity } from '../lib/changelog'
import { monthDayYear } from '../lib/formatDate'
import { pageTitle } from '../lib/title'
import { Clip } from '../components/Clip'
import { LightboxImage } from '../components/Lightbox'
import styles from './ChangelogEntry.module.css'
import type { ComponentPropsWithoutRef } from 'react'
import type { IconType } from 'react-icons'
import type { Change, ReleaseLine } from '../lib/changelog'

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
const TONES: Record<string, 'primary' | 'danger' | 'neutral'> = {
  new: 'primary',
  security: 'danger',
}

/** One icon per area, keyed by the label `groupByArea` returns. Copied from
    the app's WhatsNewDialog so both places mark the same area the same way. */
const AREA_ICONS: Record<string, IconType> = {
  'Voice & video': PiMicrophoneFill,
  Chat: PiChatCircleFill,
  Notifications: PiBellFill,
  'Servers & invites': PiHardDrivesFill,
  'Settings & app': PiGearFill,
  Phone: PiDeviceMobileFill,
  'Self-hosting': PiHouseFill,
}

/** For an area this build has never seen. */
const OTHER_ICON: IconType = PiDotsThreeCircleFill

/** A pinned heading with its area's icon, or the shield for Security. */
function AreaHeading({ label, icon: Icon }: { label: string; icon: IconType }) {
  return (
    <h2 className={styles.area}>
      <Icon className={styles.areaIcon} size={14} />
      {label}
    </h2>
  )
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
            {monthDayYear(frontmatter.date)}
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

/** A chip for each kind, with that kind's changes beside it. */
function Kinds({ changes }: { changes: Change[] }) {
  return (
    <dl className={styles.kinds}>
      {groupChanges(changes).map(([kind, items]) => (
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
  )
}

/**
 * A release nobody wrote up. Same shape as the app's modal, so somebody
 * following "Read more" lands on what they have just read.
 */
function LineOnly({ line }: { line: ReleaseLine }) {
  const [security, rest] = splitSecurity(line.changes ?? [])
  const areas = line.changes?.length ? groupByArea(rest) : null
  /* A heading only earns its place when there's another one to tell it from. */
  const headed = (areas?.length ?? 0) > 1

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
        {/* The line above everything, security included, as in the app's modal. */}
        {areas && <p className={styles.headline}>{line.line}</p>}
        <div className={styles.meta}>
          <time dateTime={new Date(line.date).toISOString()}>
            {monthDayYear(line.date)}
          </time>
        </div>
      </header>

      {areas ? (
        <div className={styles.areas}>
          {security.length > 0 && (
            <div className={`${styles.security} ${styles.areaGroup}`}>
              <AreaHeading label="Security" icon={PiShieldCheckFill} />
              <Kinds changes={security} />
            </div>
          )}
          {areas.map(([area, changes]) => (
            <div key={area} className={styles.areaGroup}>
              {headed && <AreaHeading label={area} icon={AREA_ICONS[area] ?? OTHER_ICON} />}
              <Kinds changes={changes} />
            </div>
          ))}
        </div>
      ) : (
        /* Before 1.10 nobody split a release up. One sentence is all there is. */
        <p className={styles.onlyLine}>{line.line}</p>
      )}

      <p className={styles.noNote}>
        {areas
          ? 'Nobody wrote this one up, so the list above is all of it. '
          : 'One line is all this release got. '}
        When something lands that&rsquo;s worth explaining there&rsquo;s{' '}
        <Link to="/blog">a post about it</Link> instead.
      </p>
    </main>
  )
}

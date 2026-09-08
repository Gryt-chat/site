import { lazy, type ComponentType, type LazyExoticComponent } from 'react'
import * as lines from '../../content/changelog/releases'
import type { ReleaseLine, Surface } from '../../content/changelog/releases'

export type { ReleaseLine, Surface }

export interface ChangelogFrontmatter {
  /** Product version these notes describe, e.g. "1.4.0". */
  version: string
  date: string
  /** Which channel it went out on. Stable releases omit this. */
  channel?: 'beta' | 'latest'
  /** One sentence naming the two things that actually matter. */
  headline?: string
}

type MdxComponent = ComponentType<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  components?: Record<string, ComponentType<any>>
}>

export interface ChangelogEntry {
  /** The version, which is also the URL. */
  slug: string
  frontmatter: ChangelogFrontmatter
  Component: LazyExoticComponent<MdxComponent>
}

type ChangelogModule = {
  default: MdxComponent
  frontmatter: ChangelogFrontmatter
}

const modules = import.meta.glob<ChangelogModule>('../../content/changelog/*.mdx')
const frontmatter = import.meta.glob<ChangelogFrontmatter>('../../content/changelog/*.mdx', {
  eager: true,
  import: 'frontmatter',
  query: '?frontmatter',
})

/**
 * Newest first, by version rather than date.
 *
 * Dates would mostly agree, but a note can be written or corrected after the
 * release it describes, and the order people expect is the version order.
 */
function compareVersions(a: string, b: string): number {
  const parse = (v: string) =>
    v.split(/[.-]/).map((p) => (/^\d+$/.test(p) ? Number(p) : p))
  const pa = parse(a)
  const pb = parse(b)

  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const x = pa[i]
    const y = pb[i]
    if (x === undefined) return 1
    if (y === undefined) return -1
    if (x === y) continue
    if (typeof x === 'number' && typeof y === 'number') return y - x
    return String(y).localeCompare(String(x))
  }
  return 0
}

export const releases: ChangelogEntry[] = Object.entries(frontmatter)
  .map(([path, metadata]) => ({
    slug: path.split('/').pop()!.replace(/\.mdx$/, ''),
    frontmatter: metadata,
    Component: lazy(() => modules[path]().then((mod) => ({ default: mod.default }))),
  }))
  .sort((a, b) => compareVersions(a.frontmatter.version, b.frontmatter.version))

export function getRelease(version: string): ChangelogEntry | undefined {
  return releases.find((r) => r.slug === version)
}

/**
 * Everything released after `since`, newest first.
 *
 * This is what the desktop app asks for when it has updated: it knows the
 * version the user last saw, and wants the notes they have not read. An unknown
 * or missing `since` returns nothing rather than the entire history — someone
 * installing Gryt for the first time does not want six releases of context.
 */
export function releasesSince(since: string | null | undefined): ChangelogEntry[] {
  if (!since) return []
  if (!releases.some((r) => r.frontmatter.version === since)) return []
  return releases.filter(
    (r) => compareVersions(r.frontmatter.version, since) < 0,
  )
}

/* ── every release, not only the ones with prose ─────────────────────────── */

/**
 * A release as the index lists it: always a line, sometimes a note.
 *
 * The two halves are written in different places on purpose. A line belongs
 * with the other lines, where you can read the whole history in one file and
 * see the gaps; a note is prose and belongs in its own MDX. Joining them here
 * means the page never has to know which a release has.
 */
export interface ListedRelease {
  version: string
  date: string
  channel?: 'beta'
  line: string
  post?: string
  /** Present when somebody wrote the release a note. */
  entry?: ChangelogEntry
}

const notesByVersion = new Map(releases.map((r) => [r.frontmatter.version, r]))

/**
 * Every line, plus any note whose version has no line.
 *
 * That second half is not a nicety. Four notes — 1.4.0, 1.5.0, 1.6.0, 1.7.0 —
 * describe versions that were never released under those tags: they cover a
 * beta line, which is what the house style says a note should do while a
 * version is still in beta. Listing only the lines dropped all four off the
 * page the moment this function existed.
 *
 * So a note is enough to be listed. The line is what a release without one
 * gets, not a requirement for appearing at all.
 */
export function listReleases(surface: Surface): ListedRelease[] {
  const listed = lines[surface].map((release) => ({
    ...release,
    entry: notesByVersion.get(release.version),
  }))

  // Only the app has hand-written notes; the other surfaces have never had one.
  if (surface !== 'app') return listed

  const covered = new Set(listed.map((r) => r.version))
  const orphans: ListedRelease[] = releases
    .filter((entry) => !covered.has(entry.frontmatter.version))
    .map((entry) => ({
      version: entry.frontmatter.version,
      date: entry.frontmatter.date,
      channel: entry.frontmatter.channel === 'beta' ? 'beta' : undefined,
      line: entry.frontmatter.headline ?? '',
      entry,
    }))

  return [...listed, ...orphans].sort((a, b) => compareVersions(a.version, b.version))
}

/**
 * The surfaces, in the order the tabs show them, and what each one is.
 *
 * Named the way the patch notes already name them — `sfu` means nothing to
 * somebody deciding whether they need to update anything. Mobile is missing
 * because it has never cut a release: it goes out through TestFlight, and a
 * tab that is permanently empty is worse than no tab.
 */
export const SURFACES: { id: Surface; name: string; blurb: string }[] = [
  { id: 'app', name: 'The app', blurb: 'What you install. The desktop app, and gryt.chat in a browser.' },
  { id: 'server', name: 'The server', blurb: 'What somebody runs to host a Gryt server.' },
  { id: 'voice', name: 'Voice', blurb: 'The media server that carries calls. Updated alongside the server.' },
  { id: 'images', name: 'Images', blurb: 'Avatars, thumbnails and uploads. Runs beside the server.' },
]

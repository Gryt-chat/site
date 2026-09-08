import { lazy, type ComponentType, type LazyExoticComponent } from 'react'
import * as lines from '../../content/changelog/releases'
import type { Change, ChangeKind, ReleaseLine, Surface } from '../../content/changelog/releases'

export type { Change, ChangeKind, ReleaseLine, Surface }

/**
 * Security leads wherever it appears: below the features it gets scrolled past.
 * The app's WhatsNewDialog keeps its own copy; a package would cost two releases.
 */
export const KIND_ORDER: ChangeKind[] = ['security', 'new', 'changed', 'fixed']

export const KIND_LABELS: Record<string, string> = {
  new: 'New',
  fixed: 'Fixed',
  changed: 'Changed',
  security: 'Security',
}

/** The changes by kind, in KIND_ORDER, with anything unrecognised kept on the end. */
export function groupChanges(changes: Change[]): [string, string[]][] {
  const kinds = [...new Set(changes.map((c) => c.kind as string))]
  const ordered = [
    ...KIND_ORDER.filter((k) => kinds.includes(k)),
    ...kinds.filter((k) => !(KIND_ORDER as string[]).includes(k)),
  ]

  return ordered.map((kind) => [
    kind,
    changes.filter((c) => c.kind === kind).map((c) => c.text),
  ])
}

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
 * Newest first, by version rather than date. A note can be written or corrected after the
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
 * The app line for one version. What `/changelog/<version>` falls back to: the
 * app's modal links there for releases that have kinds and no prose.
 */
export function getAppLine(version: string): ReleaseLine | undefined {
  return lines.app.find((r) => r.version === version)
}

/**
 * Everything released after `since`, newest first — what the desktop app asks for once it
 * has updated. An unknown `since` returns nothing rather than the entire history.
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
 * A release as the index lists it: always a line, sometimes a note. The two halves are
 * written in different places, and joining them here means the page never has to know.
 */
export interface ListedRelease {
  version: string
  date: string
  channel?: 'beta'
  line: string
  /** The same release split by kind, where somebody has written it that way. */
  changes?: Change[]
  post?: string
  /** Present when somebody wrote the release a note. */
  entry?: ChangelogEntry
}

const notesByVersion = new Map(releases.map((r) => [r.frontmatter.version, r]))

/**
 * Every line, plus any note whose version has no line. Four notes cover beta lines that
 * were never released under those tags, and listing only lines dropped all four.
 */
export function listReleases(surface: Surface): ListedRelease[] {
  /* Only the app has notes and the join is by version number alone, so the other three
     skip it: the server released a 1.4.0 of its own and would pick up the app's note. */
  if (surface !== 'app') return lines[surface].map((release) => ({ ...release }))

  const listed = lines.app.map((release) => ({
    ...release,
    entry: notesByVersion.get(release.version),
  }))

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
 * The surfaces, in the order the tabs show them. Named the way the patch notes name them —
 * `sfu` means nothing to a reader. Mobile is missing: it has never cut a release.
 */
export const SURFACES: { id: Surface; name: string; blurb: string }[] = [
  { id: 'app', name: 'The app', blurb: 'What you install. The desktop app, and gryt.chat in a browser.' },
  { id: 'server', name: 'The server', blurb: 'What somebody runs to host a Gryt server.' },
  { id: 'voice', name: 'Voice', blurb: 'The media server that carries calls. Updated alongside the server.' },
  { id: 'images', name: 'Images', blurb: 'Avatars, thumbnails and uploads. Runs beside the server.' },
]

import { lazy, useMemo, type ComponentType, type LazyExoticComponent } from 'react'
import { useLocation } from 'react-router-dom'
import { useGenerated, type GeneratedRelease } from './generated'

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


/* ── One list, two sources ─────────────────────────────────────────────
   The notes written by hand live in content/changelog and are compiled in.
   The rest are drafted on the box after a release and fetched at runtime.
   A page wants both, in one order, and mostly does not care which is which. */

export type AnyRelease =
  | ({ kind: 'written'; slug: string } & ChangelogFrontmatter & { Component: ChangelogEntry['Component'] })
  | ({ kind: 'drafted'; slug: string } & GeneratedRelease)

/**
 * Whether unpublished notes are being shown.
 *
 * A drafted note is one a model wrote and nobody has read yet. It is in the
 * file the page fetches, carrying `status: "draft"`, so that it can be read on
 * the page it would go on rather than in a text field somewhere — which is the
 * cheapest way to judge whether it is any good. It is not on the page for
 * everybody else, and `?drafts=1` is what asks for it.
 *
 * Deliberately not behind a sign-in. An unpublished note is not a secret; it is
 * prose about a release that already shipped, and the only person who would go
 * looking is the one deciding whether to publish it.
 */
export function showingDrafts(search: string): boolean {
  return new URLSearchParams(search).get('drafts') === '1'
}

export function useAllReleases(): { all: AnyRelease[]; loading: boolean } {
  const { generated, loading } = useGenerated()
  const drafts = useLocation().search

  return useMemo(() => {
    const written: AnyRelease[] = releases.map((r) => ({
      kind: 'written',
      slug: r.slug,
      ...r.frontmatter,
      Component: r.Component,
    }))
    /* A hand-written note wins. Somebody sat down and wrote it, and the three
       that exist are the examples the drafter is shown. */
    const have = new Set(written.map((r) => r.version))
    const withDrafts = showingDrafts(drafts)
    const generatedVisible: AnyRelease[] = generated
      .filter((g) => !have.has(g.version))
      .filter((g) => withDrafts || g.status === 'published')
      .map((g) => ({ kind: 'drafted', slug: g.version, ...g }))

    const all = [...written, ...generatedVisible].sort((a, b) =>
      compareVersions(a.version, b.version),
    )
    return { all, loading }
  }, [generated, loading, drafts])
}

/**
 * Stable only, unless the reader asked to see the pre-releases too.
 *
 * The toggle governs the *drafted* betas and nothing else. All three
 * hand-written notes carry `channel: beta`, because each was written while its
 * line was still in beta and covers the whole line — filtering on the field
 * alone hid every curated note and left the page showing one entry. A note
 * somebody sat down and wrote is not the noise this toggle exists to hide;
 * forty machine-drafted pre-release entries are.
 */
export function visible(all: AnyRelease[], showBeta: boolean): AnyRelease[] {
  if (showBeta) return all
  return all.filter((r) => r.kind === 'written' || r.channel !== 'beta')
}

export function findRelease(all: AnyRelease[], version: string): AnyRelease | undefined {
  return all.find((r) => r.slug === version)
}

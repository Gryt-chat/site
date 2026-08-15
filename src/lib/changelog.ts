import { lazy, type ComponentType, type LazyExoticComponent } from 'react'

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

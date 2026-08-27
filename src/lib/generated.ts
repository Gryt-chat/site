/**
 * Release notes drafted on the box and served beside the site.
 *
 * `ops/internal/changelog-notes.mjs` drafts a note when a release goes out and
 * posts it to the reports service, which holds it until somebody has read it
 * and writes `changelog.json`. nginx serves that from the same origin as the
 * site, under /release-notes/. Fetching it at runtime rather than building it
 * in is the whole point — publishing a note takes seconds, with no rebuild and
 * no pull request in the way.
 *
 * An entry carries the status it is in. A draft is in the file too, because it
 * is unpublished rather than secret and reading one on this page is the best
 * way to judge it — but this page renders published entries only unless the URL
 * says `?drafts=1`.
 *
 * The hand-written notes in `content/changelog` stay where they are and win
 * where both exist. A version somebody sat down and wrote about is better than
 * a version a model summarised, and the three that exist are the examples the
 * model is given.
 *
 * Nothing here trusts the file. It arrives as JSON of unknown shape from a
 * process that is not this one, so every field is checked before it is used,
 * and a file that fails the check is dropped rather than half-rendered. The
 * model is never allowed to produce markup: it fills this shape, and the page
 * renders the shape with its own components.
 */
import { useEffect, useState } from 'react'

export interface GeneratedSection {
  heading: string
  body: string[]
}

export interface GeneratedRecapGroup {
  group: string
  items: string[]
}

/**
 * Whether anybody has read this yet.
 *
 * The drafter used to write this file itself, so a note nobody had read was on
 * the page the moment a model finished writing it. Two fabricated drafts were
 * caught by reading them while that was being built. Now reports holds a note
 * until somebody publishes it, and `published` is what says so.
 *
 * A file written before this existed has no status at all, which is treated as
 * a draft: the safe direction is that a note nobody vouched for is not on the
 * page by default.
 */
export type GeneratedStatus = 'draft' | 'published'

export interface GeneratedRelease {
  version: string
  date: string
  channel: 'beta' | 'latest'
  status: GeneratedStatus
  headline: string
  /** The untitled paragraphs before the first heading, as the written notes have. */
  intro: string[]
  sections: GeneratedSection[]
  recap: GeneratedRecapGroup[]
  /** Which release this one is measured against, and what drafted it. */
  source?: { since?: string; commits?: number; model?: string }
}

const isStringArray = (v: unknown): v is string[] =>
  Array.isArray(v) && v.every((s) => typeof s === 'string')

function asRelease(raw: unknown): GeneratedRelease | null {
  if (typeof raw !== 'object' || raw === null) return null
  const r = raw as Record<string, unknown>
  if (typeof r.version !== 'string' || !r.version) return null
  if (typeof r.date !== 'string') return null
  if (r.channel !== 'beta' && r.channel !== 'latest') return null
  if (typeof r.headline !== 'string') return null

  /* Older files predate the intro, so a missing one is empty rather than fatal. */
  const intro = isStringArray(r.intro) ? r.intro : []

  /* Anything that is not the word "published" is a draft, including a missing
     field and a status this build has never heard of. */
  const status: GeneratedStatus = r.status === 'published' ? 'published' : 'draft'

  const sections: GeneratedSection[] = []
  if (!Array.isArray(r.sections)) return null
  for (const s of r.sections) {
    if (typeof s !== 'object' || s === null) return null
    const sec = s as Record<string, unknown>
    if (typeof sec.heading !== 'string' || !isStringArray(sec.body)) return null
    sections.push({ heading: sec.heading, body: sec.body })
  }

  const recap: GeneratedRecapGroup[] = []
  if (r.recap !== undefined) {
    if (!Array.isArray(r.recap)) return null
    for (const g of r.recap) {
      if (typeof g !== 'object' || g === null) return null
      const grp = g as Record<string, unknown>
      if (typeof grp.group !== 'string' || !isStringArray(grp.items)) return null
      recap.push({ group: grp.group, items: grp.items })
    }
  }

  return {
    version: r.version,
    date: r.date,
    channel: r.channel,
    status,
    headline: r.headline,
    intro,
    sections,
    recap,
    source: (r.source as GeneratedRelease['source']) ?? undefined,
  }
}

let cache: GeneratedRelease[] | null = null

export async function loadGenerated(): Promise<GeneratedRelease[]> {
  if (cache) return cache
  try {
    /* Not /changelog.json. The site owns the /changelog route, and nginx
       resolving a real file under a path the router also claims is the kind of
       collision that works locally and surprises somebody later. This path
       exists only for the mount. */
    const res = await fetch('/release-notes/changelog.json', { cache: 'no-cache' })
    if (!res.ok) return (cache = [])
    const doc: unknown = await res.json()
    const entries = (doc as { entries?: unknown })?.entries
    if (!Array.isArray(entries)) return (cache = [])
    cache = entries.map(asRelease).filter((r): r is GeneratedRelease => r !== null)
    return cache
  } catch {
    /* No file yet, or the box is down. The hand-written notes still render;
       an empty changelog page would be a worse failure than a short one. */
    return (cache = [])
  }
}

export function useGenerated(): { generated: GeneratedRelease[]; loading: boolean } {
  const [generated, setGenerated] = useState<GeneratedRelease[]>(cache ?? [])
  const [loading, setLoading] = useState(cache === null)

  useEffect(() => {
    let alive = true
    loadGenerated().then((list) => {
      if (!alive) return
      setGenerated(list)
      setLoading(false)
    })
    return () => {
      alive = false
    }
  }, [])

  return { generated, loading }
}

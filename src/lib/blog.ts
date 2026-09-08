import { lazy, type ComponentType, type LazyExoticComponent } from 'react'

export interface BlogFrontmatter {
  title: string
  description?: string
  author: string
  date: string
  image?: string
  tags?: string[]
}

type MdxComponent = ComponentType<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  components?: Record<string, ComponentType<any>>
}>

export interface BlogPost {
  slug: string
  frontmatter: BlogFrontmatter
  Component: LazyExoticComponent<MdxComponent>
}

type BlogModule = {
  default: MdxComponent
  frontmatter: BlogFrontmatter
}

const modules = import.meta.glob<BlogModule>('../../content/blog/*.mdx')
const frontmatter = import.meta.glob<BlogFrontmatter>('../../content/blog/*.mdx', {
  eager: true,
  import: 'frontmatter',
  query: '?frontmatter',
})

export const posts: BlogPost[] = Object.entries(frontmatter)
  .map(([path, metadata]) => ({
    slug: path.split('/').pop()!.replace(/\.mdx$/, ''),
    frontmatter: metadata,
    Component: lazy(() => modules[path]().then((mod) => ({ default: mod.default }))),
  }))
  .sort((a, b) => {
    const byDate =
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime()
    /* Slug breaks the tie, because five posts share a publish date and without this their
       order is whatever the glob returned. Invisible until a post links to the one before. */
    return byDate !== 0 ? byDate : a.slug.localeCompare(b.slug)
  })

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug)
}

/**
 * The posts either side of this one, named by what they are rather than which way an arrow
 * points: the list is newest first, so the older post is the next entry along.
 */
export function getNeighbours(slug: string): {
  older?: BlogPost
  newer?: BlogPost
} {
  const at = posts.findIndex((p) => p.slug === slug)
  if (at === -1) return {}
  return { newer: posts[at - 1], older: posts[at + 1] }
}

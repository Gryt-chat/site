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
  .sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime(),
  )

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug)
}

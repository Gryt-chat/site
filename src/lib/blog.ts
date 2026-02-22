import type { ComponentType } from 'react'

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
  Component: MdxComponent
}

const modules = import.meta.glob<{
  default: MdxComponent
  frontmatter: BlogFrontmatter
}>('../../content/blog/*.mdx', { eager: true })

export const posts: BlogPost[] = Object.entries(modules)
  .map(([path, mod]) => ({
    slug: path.split('/').pop()!.replace(/\.mdx$/, ''),
    frontmatter: mod.frontmatter,
    Component: mod.default,
  }))
  .sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime(),
  )

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug)
}

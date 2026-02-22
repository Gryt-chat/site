declare module '*.mdx' {
  import type { ComponentType } from 'react'

  export const frontmatter: {
    title: string
    description?: string
    author: string
    date: string
    image?: string
    tags?: string[]
  }

  const Component: ComponentType<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    components?: Record<string, ComponentType<any>>
  }>
  export default Component
}

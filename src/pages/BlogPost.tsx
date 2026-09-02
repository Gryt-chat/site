import { lazy, Suspense, useEffect } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { MdChevronLeft } from 'react-icons/md'
import { Chip } from '@gryt/ui'
import { getNeighbours, getPost } from '../lib/blog'
import { pageTitle } from '../lib/title'
import { LightboxImage } from '../components/Lightbox'
import { PostNav } from '../components/PostNav'
import styles from './BlogPost.module.css'
import type { ComponentPropsWithoutRef } from 'react'

function MdxLink({ href, ...rest }: ComponentPropsWithoutRef<'a'>) {
  if (href?.startsWith('/')) {
    return <Link to={href} {...rest} />
  }
  return <a href={href} {...rest} target="_blank" rel="noreferrer" />
}

function MdxImage(props: ComponentPropsWithoutRef<'img'>) {
  return <LightboxImage {...props} />
}

/* Lazily, so mermaid stays out of the main bundle and off every page that has
   no diagram in it. That was already true before GRYT-700 removed the component
   for being "in the bundle"; what was in the bundle was /why-gryt importing it
   directly, and that page draws its own sketches now. */
const LazyMermaid = lazy(() =>
  import('../components/Mermaid').then((m) => ({ default: m.Mermaid }))
)

function MermaidWrapper(props: { chart: string }) {
  return (
    <Suspense
      fallback={
        <div style={{ margin: '24px 0', padding: '24px', textAlign: 'center', color: 'var(--text-dim)' }}>
          Loading diagram…
        </div>
      }
    >
      <LazyMermaid {...props} />
    </Suspense>
  )
}

const components = { a: MdxLink, img: MdxImage, Image: MdxImage, Mermaid: MermaidWrapper }

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const post = slug ? getPost(slug) : undefined

  useEffect(() => {
    if (post) {
      document.title = pageTitle(post.frontmatter.title)
    }
  }, [post])

  if (!post) return <Navigate to="/blog" replace />

  const { frontmatter, Component } = post
  const { older, newer } = getNeighbours(post.slug)

  return (
    <main className={styles.page}>
      <Link to="/blog" className={styles.back}>
        <MdChevronLeft size={16} />
        Back to blog
      </Link>

      <header className={styles.header}>
        {frontmatter.image && (
          <img
            src={frontmatter.image}
            alt={frontmatter.title}
            className={styles.heroImage}
          />
        )}
        <h1 className={styles.title}>{frontmatter.title}</h1>
        {frontmatter.description && (
          <p className={styles.description}>{frontmatter.description}</p>
        )}
        <div className={styles.meta}>
          <span className={styles.author}>{frontmatter.author}</span>
          <span className={styles.dot}>·</span>
          <time dateTime={new Date(frontmatter.date).toISOString()}>
            {new Date(frontmatter.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </div>
        {frontmatter.tags && frontmatter.tags.length > 0 && (
          <div className={styles.tags}>
            {frontmatter.tags.map((tag) => (
              <Chip key={tag} tone="primary">
                {tag}
              </Chip>
            ))}
          </div>
        )}
      </header>

      <div className={styles.prose}>
        <Suspense fallback={<p>Loading post…</p>}>
          <Component components={components} />
        </Suspense>
      </div>

      <PostNav older={older} newer={newer} />
    </main>
  )
}

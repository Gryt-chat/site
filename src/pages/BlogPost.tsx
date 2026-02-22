import { lazy, Suspense } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { getPost } from '../lib/blog'
import { LightboxImage } from '../components/Lightbox'
import styles from './BlogPost.module.css'
import type { ComponentPropsWithoutRef } from 'react'

const LazyMermaid = lazy(() =>
  import('../components/Mermaid').then((m) => ({ default: m.Mermaid }))
)

function MermaidWrapper(props: { chart: string }) {
  return (
    <Suspense fallback={<div style={{ margin: '24px 0', padding: '24px', textAlign: 'center', color: 'var(--text-dim)' }}>Loading diagram…</div>}>
      <LazyMermaid {...props} />
    </Suspense>
  )
}

function MdxLink({ href, ...rest }: ComponentPropsWithoutRef<'a'>) {
  if (href?.startsWith('/')) {
    return <Link to={href} {...rest} />
  }
  return <a href={href} {...rest} target="_blank" rel="noreferrer" />
}

function MdxImage(props: ComponentPropsWithoutRef<'img'>) {
  return <LightboxImage {...props} />
}

const components = { a: MdxLink, img: MdxImage, Mermaid: MermaidWrapper }

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const post = slug ? getPost(slug) : undefined

  if (!post) return <Navigate to="/blog" replace />

  const { frontmatter, Component } = post

  return (
    <main className={styles.page}>
      <Link to="/blog" className={styles.back}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
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
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      <div className={styles.prose}>
        <Component components={components} />
      </div>
    </main>
  )
}

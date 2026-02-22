import { Link } from 'react-router-dom'
import { posts } from '../lib/blog'
import styles from './BlogIndex.module.css'

export function BlogIndex() {
  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Blog</h1>
        <p className={styles.subtitle}>
          Updates, stories, and technical deep dives from the Gryt team.
        </p>
      </div>

      <div className={styles.grid}>
        {posts.map((post) => (
          <Link
            key={post.slug}
            to={`/blog/${post.slug}`}
            className={styles.card}
          >
            {post.frontmatter.image && (
              <img
                src={post.frontmatter.image}
                alt={post.frontmatter.title}
                className={styles.cardImage}
              />
            )}
            <div className={styles.meta}>
              <time dateTime={new Date(post.frontmatter.date).toISOString()}>
                {new Date(post.frontmatter.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              <span className={styles.dot}>·</span>
              <span>{post.frontmatter.author}</span>
            </div>
            <h2 className={styles.cardTitle}>{post.frontmatter.title}</h2>
            {post.frontmatter.description && (
              <p className={styles.cardDesc}>{post.frontmatter.description}</p>
            )}
            {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
              <div className={styles.tags}>
                {post.frontmatter.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>
    </main>
  )
}

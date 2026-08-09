import { Link } from 'react-router-dom'
import { posts } from '../lib/blog'
import styles from './BlogIndex.module.css'

const YEAR = new Intl.DateTimeFormat('en-GB', { year: 'numeric' })
const DAY = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short' })

/** Posts grouped by year, newest year first, in the order `posts` already sorts. */
function byYear(list: typeof posts) {
  const groups = new Map<string, typeof posts>()
  for (const post of list) {
    const year = YEAR.format(new Date(post.frontmatter.date))
    const bucket = groups.get(year)
    if (bucket) bucket.push(post)
    else groups.set(year, [post])
  }
  return [...groups.entries()]
}

export function BlogIndex() {
  const years = byYear(posts)
  const newest = years[0]?.[0]
  const oldest = years[years.length - 1]?.[0]
  /* Every post is from the same year at the moment, and "2026 to 2026" reads as
     a bug rather than as a range. */
  const span = newest === oldest ? newest : `${oldest} to ${newest}`

  return (
    <main className={styles.page}>
      <header className={styles.head}>
        <h1 className={styles.title}>Writing</h1>
        <p className={styles.sub}>
          {posts.length} posts on building Gryt · {span}
        </p>
      </header>

      {years.map(([year, group]) => (
        <section key={year} className={styles.year}>
          <h2 className={styles.yearLabel}>{year}</h2>
          <ul className={styles.list}>
            {group.map((post) => (
              <li key={post.slug}>
                <Link to={`/blog/${post.slug}`} className={styles.row}>
                  <time
                    className={styles.date}
                    dateTime={new Date(post.frontmatter.date).toISOString()}
                  >
                    {DAY.format(new Date(post.frontmatter.date))}
                  </time>
                  <span className={styles.rowMain}>
                    <span className={styles.rowTitle}>
                      {post.frontmatter.title}
                    </span>
                    {post.frontmatter.description && (
                      <span className={styles.rowDesc}>
                        {post.frontmatter.description}
                      </span>
                    )}
                  </span>
                  <span className={styles.arrow} aria-hidden="true">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  )
}

import { Link } from 'react-router-dom'
import { posts } from '../lib/blog'
import styles from './BlogIndex.module.css'

const YEAR = new Intl.DateTimeFormat('en-GB', { year: 'numeric' })
const LONG = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

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
          <ul className={styles.stack}>
            {group.map((post) => {
              const { title, date, image, tags } = post.frontmatter
              /* A post with no picture yet gets its own first tag on the same
                 mat, at the same size, rather than a blank panel. */
              const label = tags?.[0] ?? 'writing'
              return (
                <li key={post.slug}>
                  <Link to={`/blog/${post.slug}`} className={styles.card}>
                    <span className={styles.mat}>
                      {image ? (
                        <img src={image} alt="" loading="lazy" decoding="async" />
                      ) : (
                        <span className={styles.matLabel}>{label}</span>
                      )}
                    </span>
                    <span className={styles.meta}>
                      <span className={styles.cardTitle}>{title}</span>
                      <time
                        className={styles.date}
                        dateTime={new Date(date).toISOString()}
                      >
                        {LONG.format(new Date(date))}
                      </time>
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </main>
  )
}

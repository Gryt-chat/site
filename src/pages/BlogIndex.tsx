import { Link, useSearchParams } from 'react-router-dom'
import { Chip } from '@gryt/ui'
import { posts } from '../lib/blog'
import { dayMonthYear, yearOf } from '../lib/formatDate'
import styles from './BlogIndex.module.css'

/** Posts grouped by year, newest year first, in the order `posts` already sorts. */
function byYear(list: typeof posts) {
  const groups = new Map<string, typeof posts>()
  for (const post of list) {
    const year = yearOf(post.frontmatter.date)
    const bucket = groups.get(year)
    if (bucket) bucket.push(post)
    else groups.set(year, [post])
  }
  return [...groups.entries()]
}

/* Topics group the free-text tags, so a new tag only needs adding here to be filterable. */
const TOPICS = [
  { id: 'announcements', label: 'Announcements', tags: ['announcement'] },
  { id: 'releases', label: 'Releases', tags: ['releases', 'update', 'beta'] },
  { id: 'security', label: 'Security and privacy', tags: ['security', 'privacy', 'encryption', 'identity'] },
  { id: 'voice', label: 'Voice and video', tags: ['voice', 'webrtc', 'screen-sharing'] },
  { id: 'messages', label: 'Messages', tags: ['direct-messages', 'discord', 'threads'] },
  { id: 'servers', label: 'Servers', tags: ['permissions', 'roles', 'moderation', 'plugins'] },
  { id: 'phone', label: 'Phone', tags: ['mobile'] },
  { id: 'design', label: 'Design', tags: ['design', 'themes'] },
  { id: 'hosting', label: 'Self-hosting', tags: ['self-hosting', 'infrastructure', 'database', 'windows'] },
  { id: 'story', label: 'The story', tags: ['history', 'community', 'personal', 'open-source', 'licensing', 'ai'] },
]

export function BlogIndex() {
  const [params, setParams] = useSearchParams()
  const topic = TOPICS.find((t) => t.id === params.get('topic'))
  const shown = topic ? posts.filter((p) => p.frontmatter.tags?.some((tag) => topic.tags.includes(tag))) : posts
  const years = byYear(shown)
  const all = byYear(posts)
  const newest = all[0]?.[0]
  const oldest = all[all.length - 1]?.[0]
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

      <div className={styles.topics} role="group" aria-label="Filter posts by topic">
        <button type="button" className={styles.topic} aria-pressed={!topic} onClick={() => setParams({})}>
          All
        </button>
        {TOPICS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={styles.topic}
            aria-pressed={topic?.id === t.id}
            onClick={() => setParams({ topic: t.id })}
          >
            {t.label}
          </button>
        ))}
      </div>

      {years.map(([year, group]) => (
        <section key={year} className={styles.year}>
          <h2 className={styles.yearLabel}>{year}</h2>
          <ul className={styles.stack}>
            {group.map((post) => {
              const { title, date, image, tags } = post.frontmatter
              /* A post with no picture yet gets its own first tag on the same
                 mat, at the same size, rather than a blank panel. */
              const label = tags?.[0] ?? 'writing'
              const topics = TOPICS.filter((t) => tags?.some((tag) => t.tags.includes(tag))).slice(0, 2)
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
                    {topics.length > 0 && (
                      <span className={styles.cardTopics}>
                        {topics.map((t) => (
                          <Chip key={t.id} tone="primary">{t.label}</Chip>
                        ))}
                      </span>
                    )}
                    <span className={styles.meta}>
                      <span className={styles.cardTitle}>{title}</span>
                      <time
                        className={styles.date}
                        dateTime={new Date(date).toISOString()}
                      >
                        {dayMonthYear(date)}
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

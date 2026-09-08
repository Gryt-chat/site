import { Link } from 'react-router-dom'
import { MdChevronLeft, MdChevronRight } from 'react-icons/md'
import type { BlogPost } from '../lib/blog'
import styles from './PostNav.module.css'

interface PostNavProps {
  /** The post published before this one. Absent on the oldest. */
  older?: BlogPost
  /** The post published after it. Absent on the newest. */
  newer?: BlogPost
}

/**
 * Reading on from the bottom of a post. The props are `older` and `newer`: in a list sorted
 * newest-first the next entry is the older post, which `previous`/`next` invites getting wrong.
 */
export function PostNav({ older, newer }: PostNavProps) {
  if (!older && !newer) return null

  return (
    <nav className={styles.nav} aria-label="More posts">
      {older && (
        <Link to={`/blog/${older.slug}`} className={`${styles.side} ${styles.previous}`}>
          <span className={styles.direction}>
            <MdChevronLeft size={14} aria-hidden="true" />
            Previous post
          </span>
          <span className={styles.title}>{older.frontmatter.title}</span>
        </Link>
      )}

      {newer && (
        <Link to={`/blog/${newer.slug}`} className={`${styles.side} ${styles.next}`}>
          <span className={styles.direction}>
            Next post
            <MdChevronRight size={14} aria-hidden="true" />
          </span>
          <span className={styles.title}>{newer.frontmatter.title}</span>
        </Link>
      )}
    </nav>
  )
}

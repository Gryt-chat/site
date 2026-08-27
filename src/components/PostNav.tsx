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
 * Reading on from the bottom of a post.
 *
 * "Previous" is the older post and sits on the left, "Next" is the newer one on
 * the right — the arrangement every blog uses, and the reason the props are
 * named `older` and `newer` instead. In an array sorted newest-first the next
 * entry along is the *older* post, so a component taking `previous` and `next`
 * would invite exactly the off-by-one this naming removes.
 *
 * The ends of the list have one neighbour each and render one link. A post with
 * neither — the only post — renders nothing rather than a dead control.
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

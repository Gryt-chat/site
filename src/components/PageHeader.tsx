import type { ReactNode } from "react";
import styles from "./PageHeader.module.css";

/**
 * The front page's section rhythm — eyebrow, heading, sub, stacked in one
 * column — as the top of a content page.
 *
 * It does not animate, and that is deliberate. The front page reveals sections
 * with `inView`, which is worth it there because you scroll past eight of them.
 * A page header is above the fold on load, so a reveal either fires instantly
 * (and is therefore invisible) or delays the one thing the reader came for.
 *
 * `meta` is for a date or a count — the small dim line that belongs under the
 * lede rather than beside the title.
 */
export function PageHeader({
  eyebrow,
  title,
  lede,
  meta,
}: {
  eyebrow: string;
  title: string;
  lede?: ReactNode;
  meta?: ReactNode;
}) {
  return (
    <header className={styles.header}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h1 className={styles.title}>{title}</h1>
      {lede && <p className={styles.lede}>{lede}</p>}
      {meta && <p className={styles.meta}>{meta}</p>}
    </header>
  );
}

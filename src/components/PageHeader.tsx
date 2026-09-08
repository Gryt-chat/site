import type { ReactNode } from "react";
import styles from "./PageHeader.module.css";

/**
 * The front page's section rhythm as the top of a content page. It does not animate: a
 * header is above the fold, so a reveal is either invisible or a delay.
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

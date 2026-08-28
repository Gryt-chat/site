import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import styles from "../styles/audience.module.css";

/**
 * A named group of destinations, and the rows in it.
 *
 * /developers and /self-hosting are both mostly a front door onto
 * docs.gryt.chat — the docs are already grouped by audience, and a second copy
 * of their content on this site would be a second copy to keep right. So each
 * page is orientation plus rows, and the rows are this.
 *
 * A row is a name, one line saying what is behind it, and an arrow. Not a card:
 * two of these pages are almost entirely rows, and a page of forty boxes is
 * unreadable in a way a page of forty rules is not.
 */
export interface RowItem {
  name: string;
  detail: string;
  href: string;
  /** Set for a package name or a command — something you type, not a title. */
  mono?: boolean;
}

export function Block({
  heading,
  note,
  items,
  children,
}: {
  heading: string;
  note?: ReactNode;
  items?: RowItem[];
  children?: ReactNode;
}) {
  return (
    <section className={styles.block}>
      <h2 className={styles.blockHeading}>{heading}</h2>
      {note && <p className={styles.blockNote}>{note}</p>}
      {children}
      {items && items.length > 0 && <LinkRows items={items} />}
    </section>
  );
}

export function LinkRows({ items }: { items: RowItem[] }) {
  return (
    <ul className={styles.list}>
      {items.map((item) => (
        <li key={item.href + item.name}>
          <Row item={item} />
        </li>
      ))}
    </ul>
  );
}

function Row({ item }: { item: RowItem }) {
  const body = (
    <>
      <span className={styles.rowName} data-mono={item.mono || undefined}>
        {item.name}
      </span>
      <span className={styles.rowDetail}>{item.detail}</span>
      <span className={styles.rowArrow} aria-hidden="true">
        →
      </span>
    </>
  );

  // A route rather than a page load when the destination is this site. Every
  // other row leaves for the docs or for GitHub.
  return item.href.startsWith("/") ? (
    <Link className={styles.row} to={item.href}>
      {body}
    </Link>
  ) : (
    <a className={styles.row} href={item.href} target="_blank" rel="noreferrer">
      {body}
    </a>
  );
}

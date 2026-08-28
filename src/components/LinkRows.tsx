import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import { useCopy } from "../lib/useCopy";
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

/**
 * A published package: what it is called, what it costs you, and the line that
 * installs it.
 *
 * Not a `Row`, and it cannot be one. A row is a single anchor over the whole
 * strip, and this needs two controls in it — the name goes to npm and the
 * command goes to your clipboard. Nesting a button inside a link is invalid
 * markup and unusable with a keyboard, so the strip is a plain container with
 * two things in it instead.
 *
 * The licence sits beside the name rather than at the front of the sentence.
 * Which one a package is under is the second thing a developer wants to know
 * and it was buried in prose, one word in from the left, six times over.
 */
export interface PackageItem {
  name: string;
  licence: "MIT" | "AGPL";
  detail: string;
  install: string;
  href: string;
}

export function PackageRows({ items }: { items: PackageItem[] }) {
  return (
    <ul className={styles.list}>
      {items.map((item) => (
        <li key={item.name}>
          <div className={styles.package}>
            <a
              className={styles.packageName}
              href={item.href}
              target="_blank"
              rel="noreferrer"
            >
              {item.name}
            </a>
            <span className={styles.licence}>{item.licence}</span>
            <InstallButton command={item.install} name={item.name} />
            <p className={styles.packageDetail}>{item.detail}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function InstallButton({ command, name }: { command: string; name: string }) {
  const [copied, copy] = useCopy(command);
  return (
    <button
      type="button"
      className={styles.install}
      onClick={copy}
      aria-label={`Copy the install command for ${name}`}
    >
      <code>{command}</code>
      <span className={styles.installState} aria-live="polite">
        {copied ? "Copied" : "Copy"}
      </span>
    </button>
  );
}

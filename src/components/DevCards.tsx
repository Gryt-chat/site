import type { ComponentType } from "react";
import { Link } from "react-router-dom";

import styles from "../styles/devHub.module.css";

/**
 * The cards on /developers, and the headings above them. `design.md` calls cards a budget,
 * and this spends it here: the hub's job is to make eleven destinations scannable.
 */
export interface DevCard {
  /** A Phosphor component from `react-icons/pi`. Passed, not named, so a typo
      is a type error rather than a blank square at runtime. */
  icon: ComponentType<{ size?: number }>;
  title: string;
  detail: string;
  /** What sits at the bottom of the card, in mono. A package name, or a page. */
  go: string;
  href: string;
}

export function GroupHead({ title, note }: { title: string; note: string }) {
  return (
    <div className={styles.groupHead}>
      <h2>{title}</h2>
      <p>{note}</p>
    </div>
  );
}

export function CardGrid({ items }: { items: DevCard[] }) {
  return (
    <div className={styles.cards}>
      {items.map((item) => (
        <Card key={item.href + item.title} item={item} />
      ))}
    </div>
  );
}

function Card({ item }: { item: DevCard }) {
  const Icon = item.icon;

  const body = (
    <>
      <Icon size={30} />
      <h3>{item.title}</h3>
      <p>{item.detail}</p>
      {/* Pushed to the bottom by margin-top:auto, so a row of cards has its
          destinations on one line however long the descriptions run. */}
      <span className={styles.go}>{item.go} →</span>
    </>
  );

  // A route stays a route; everything else leaves for the docs or GitHub.
  return item.href.startsWith("/") ? (
    <Link className={styles.card} to={item.href}>
      {body}
    </Link>
  ) : (
    <a className={styles.card} href={item.href} target="_blank" rel="noreferrer">
      {body}
    </a>
  );
}

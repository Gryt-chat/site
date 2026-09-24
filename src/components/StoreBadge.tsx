import type { Store } from "../lib/releases";
import styles from "./StoreBadge.module.css";

/** A store's official badge, linking to its listing. Nothing for a store that isn't open yet.
    Set `--badge-height` to size it. */
export function StoreBadge({ store, className }: { store: Store; className?: string }) {
  const { badge, url } = store;
  const img = <img src={badge.src} alt={badge.alt} width={badge.width} height={badge.height} />;

  if (!url) return null;

  return (
    <a
      className={className ? `${styles.badge} ${className}` : styles.badge}
      href={url}
      target="_blank"
      rel="noreferrer"
    >
      {img}
    </a>
  );
}

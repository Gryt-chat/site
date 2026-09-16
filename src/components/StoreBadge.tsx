import type { Store } from "../lib/releases";
import styles from "./StoreBadge.module.css";

/** A store's official badge. A link once the store is open, and faded and inert until then.
    Set `--badge-height` to size it. */
export function StoreBadge({ store, className }: { store: Store; className?: string }) {
  const { badge, url } = store;
  const img = <img src={badge.src} alt={badge.alt} width={badge.width} height={badge.height} />;

  if (!url) {
    return <span className={[styles.badge, styles.soon, className].filter(Boolean).join(" ")}>{img}</span>;
  }

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

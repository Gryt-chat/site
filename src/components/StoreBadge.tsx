import type { StoreListing } from "../lib/releases";
import styles from "./StoreBadge.module.css";

/** A store's official badge, linking to the listing. Set `--badge-height` to size it. */
export function StoreBadge({
  listing,
  className,
}: {
  listing: StoreListing;
  className?: string;
}) {
  return (
    <a
      className={className ? `${styles.badge} ${className}` : styles.badge}
      href={listing.url}
      target="_blank"
      rel="noreferrer"
    >
      <img
        src={listing.badge}
        alt={listing.alt}
        width={listing.width}
        height={listing.height}
      />
    </a>
  );
}

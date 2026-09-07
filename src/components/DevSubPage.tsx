import type { ReactNode } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { PiArrowLeftBold } from "react-icons/pi";

import { PageHeader } from "./PageHeader";
import { pageTitle } from "../lib/title";
import styles from "../styles/audience.module.css";
import hub from "../styles/devHub.module.css";

/**
 * The six pages under `/developers` (GRYT-956).
 *
 * They share a back link and a header and nothing else — the point of splitting
 * the hub was to give each one room for its own worked example, so the body is
 * whatever that page needs.
 *
 * The back link is a real one rather than browser history: somebody arriving
 * from a search result or a shared link has no history to go back to, and a
 * control that does nothing on a fresh tab is worse than no control.
 */
export function DevSubPage({
  title,
  eyebrow,
  lede,
  children,
}: {
  title: string;
  eyebrow: string;
  lede: ReactNode;
  children: ReactNode;
}) {
  useEffect(() => {
    document.title = pageTitle(title);
  }, [title]);

  return (
    <main className={styles.page}>
      <Link className={hub.back} to="/developers">
        <PiArrowLeftBold size={13} /> For developers
      </Link>

      <PageHeader eyebrow={eyebrow} title={title} lede={lede} />

      {children}
    </main>
  );
}

import type { ReactNode } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { PiArrowLeftBold } from "react-icons/pi";

import { PageHeader } from "./PageHeader";
import { pageTitle } from "../lib/title";
import styles from "../styles/audience.module.css";
import hub from "../styles/devHub.module.css";

/**
 * The six pages under `/developers`, sharing a back link and a header and nothing else. The
 * back link is real rather than history: somebody arriving from a search has none.
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

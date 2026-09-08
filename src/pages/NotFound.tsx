import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@gryt/ui";
import { pageTitle } from "../lib/title";
import styles from "./NotFound.module.css";

/**
 * There was no catch-all route before this, so a mistyped URL rendered an empty `<Routes>`
 * with the footer under the navbar. The useful thing on a dead end is the way out.
 */
const DESTINATIONS = [
  { to: "/", label: "Front page" },
  { to: "/why-gryt", label: "Why Gryt?" },
  { to: "/blog", label: "Blog" },
  { to: "/changelog", label: "Changelog" },
];

export function NotFound() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = pageTitle("Page not found");
  }, []);

  return (
    <main className={styles.page}>
      <div className={styles.panel}>
        <p className={styles.code}>404</p>
        <h1 className={styles.title}>Nothing here</h1>
        <p className={styles.body}>
          There is no page at <code className={styles.path}>{pathname}</code>.
          It might have moved, or the link that sent you here might be wrong.
        </p>

        <nav className={styles.links} aria-label="Go to">
          {DESTINATIONS.map((d) => (
            <Button
              className={styles.link}
              key={d.to}
              render={<Link to={d.to} />}
              tone="neutral"
            >
              {d.label}
              <span aria-hidden="true">→</span>
            </Button>
          ))}
        </nav>
      </div>
    </main>
  );
}

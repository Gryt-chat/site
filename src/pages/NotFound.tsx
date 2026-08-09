import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import styles from "./NotFound.module.css";

/**
 * There was no catch-all route before this. Any URL that did not match rendered
 * an empty <Routes>, which meant gryt.chat/anything-mistyped showed the footer
 * jammed directly under the navbar, wordmark above wordmark, with no content
 * and no explanation — and kept the template's title, so it looked like a page
 * that had loaded rather than one that did not exist.
 *
 * Component-scope, not a macrostructure. The useful thing on a dead end is the
 * way out, so the real destinations are listed rather than decorated around.
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
    // Matches the "<name> | Gryt" convention the title PR establishes, so this
    // does not need touching again when that lands.
    document.title = "Page not found | Gryt";
  }, []);

  return (
    <main className={styles.page}>
      <div className={styles.panel}>
        <p className={styles.code}>404</p>
        <h1 className={styles.title}>There is nothing at this address</h1>
        <p className={styles.body}>
          No page is served at <code className={styles.path}>{pathname}</code>.
          It may have moved, or the link that sent you here may be wrong.
        </p>

        <nav className={styles.links} aria-label="Go to">
          {DESTINATIONS.map((d) => (
            <Link key={d.to} to={d.to} className={styles.link}>
              {d.label}
              <span aria-hidden="true">→</span>
            </Link>
          ))}
        </nav>
      </div>
    </main>
  );
}

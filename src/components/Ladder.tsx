import type { ReactNode } from "react";

import { Snippet } from "./Snippet";
import styles from "../styles/audience.module.css";

/**
 * The five ways to get a server up, in the order that matters: they differ by
 * how much you have to know, from the app you already downloaded to a Helm
 * chart. Each rung leads with what it costs you to be here.
 *
 * **One line of command, not the whole file.** The twelve-line Compose block
 * was deliberately taken off the front page and it should not grow back here.
 * The guide has the rest.
 *
 * Two rungs have no command, because they genuinely do not: hosting from the
 * app is three clicks, and Windows is a zip and a double-click.
 */
export interface Rung {
  /** What you need before you start. The reason this list is ordered. */
  needs: string;
  name: string;
  detail: ReactNode;
  command?: { label: string; code: string; shell?: boolean };
  href: string;
  /** What the link goes to, when "Guide" is not what is on the other end. */
  linkText?: string;
}

export function Ladder({ rungs }: { rungs: Rung[] }) {
  return (
    <ol className={styles.ladder}>
      {rungs.map((rung, i) => (
        <li className={styles.rung} key={rung.name}>
          <div className={styles.rungMeta}>
            <span className={styles.rungIndex} aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className={styles.rungNeeds}>{rung.needs}</span>
          </div>
          <div className={styles.rungBody}>
            <h3 className={styles.rungName}>{rung.name}</h3>
            <p className={styles.rungDetail}>{rung.detail}</p>
            {rung.command && (
              <Snippet
                label={rung.command.label}
                code={rung.command.code}
                shell={rung.command.shell}
              />
            )}
            <a
              className={styles.rungLink}
              href={rung.href}
              target="_blank"
              rel="noreferrer"
            >
              {rung.linkText ?? "Guide"} <span aria-hidden="true">→</span>
            </a>
          </div>
        </li>
      ))}
    </ol>
  );
}

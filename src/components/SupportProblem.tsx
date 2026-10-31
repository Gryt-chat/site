import { useEffect, type ReactNode } from "react";
import { Link } from "react-router-dom";

import { pageTitle } from "../lib/title";
import styles from "./SupportProblem.module.css";

/** One problem, one page: what's happening, what to try, and who to ask after that. */
export function SupportProblem({
  title,
  lede,
  choices,
  askText,
  children,
}: {
  title: string;
  lede: string;
  choices?: { id: string; label: string }[];
  askText: string;
  children: ReactNode;
}) {
  useEffect(() => {
    document.title = pageTitle(title);
  }, [title]);

  return (
    <main className={styles.page}>
      <Link className={styles.back} to="/support">
        ← All help
      </Link>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.lede}>{lede}</p>

      {choices && (
        <nav className={styles.choices} aria-label="What are you seeing?">
          {choices.map((choice) => (
            <a key={choice.id} className={styles.choice} href={`#${choice.id}`}>
              {choice.label}
            </a>
          ))}
        </nav>
      )}

      {children}

      <section className={styles.ask} aria-labelledby="support-ask">
        <h2 id="support-ask" className={styles.askTitle}>
          Still stuck? Ask us.
        </h2>
        <p className={styles.askText}>{askText}</p>
        <div className={styles.askLinks}>
          <a className={styles.primary} href="https://gryt.chat/community">
            Ask in our Gryt server
          </a>
          <Link className={styles.secondary} to="/support">
            See other problems
          </Link>
        </div>
      </section>
    </main>
  );
}

export function ProblemSection({
  id,
  title,
  intro,
  children,
}: {
  id: string;
  title: string;
  intro?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section id={id} className={styles.section}>
      <h2 className={styles.heading}>{title}</h2>
      {intro && <p className={styles.intro}>{intro}</p>}
      {children}
    </section>
  );
}

export function Body({ children }: { children: ReactNode }) {
  return <p className={styles.body}>{children}</p>;
}

export function Steps({ children }: { children: ReactNode }) {
  return <ol className={styles.steps}>{children}</ol>;
}

export function Step({ title, children }: { title: string; children: ReactNode }) {
  return (
    <li className={styles.step}>
      <div className={styles.stepBody}>
        <h3 className={styles.stepTitle}>{title}</h3>
        <p>{children}</p>
      </div>
    </li>
  );
}

export function Notes({ children }: { children: ReactNode }) {
  return <div className={styles.notes}>{children}</div>;
}

export function Note({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className={styles.note}>
      <h3 className={styles.noteTitle}>{title}</h3>
      <p>{children}</p>
    </div>
  );
}

export function Code({ children }: { children: ReactNode }) {
  return <pre className={styles.code}>{children}</pre>;
}

export function CodeMark({ children }: { children: ReactNode }) {
  return <span className={styles.mark}>{children}</span>;
}

/** Keyed by the exact words on screen, so somebody can match what they're looking at. */
export function Messages({ items }: { items: { text: string; fix: ReactNode }[] }) {
  return (
    <div className={styles.messages}>
      {items.map((item) => (
        <div key={item.text} className={styles.message}>
          <div className={styles.messageText}>{item.text}</div>
          <p className={styles.messageFix}>{item.fix}</p>
        </div>
      ))}
    </div>
  );
}

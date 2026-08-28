import { useCopy } from "../lib/useCopy";
import styles from "./Snippet.module.css";

/**
 * A line or two of real code, with a label and a copy button.
 *
 * /developers and /self-hosting had no code on them at all, which for those two
 * readers is strange. The front page's no-code rule was decided for somebody
 * deciding whether to try Gryt — a shell command in front of that person is an
 * obstacle — and it does not transfer to a page whose reader came to install
 * something.
 *
 * `design.md` bans hand-built fake window chrome: title bars, traffic lights,
 * an invented terminal frame. A code block is not that, and this one does not
 * pretend to be a terminal. It is a labelled `<pre>` with a hairline.
 *
 * The `$` on a shell line is drawn and never copied. Everybody has pasted a
 * prompt into their own shell once; the copy button hands over the command and
 * the selection does too, because the prompt is `user-select: none`.
 *
 * The button says "Copied" rather than firing a toast. A toast for something
 * that happened where you are looking is a notification about your own hand.
 */
export function Snippet({
  label,
  code,
  shell,
}: {
  /** What this is: a language, or the file it is out of. */
  label: string;
  code: string;
  /** Draw a prompt on each line, and leave it out of what gets copied. */
  shell?: boolean;
}) {
  const [copied, copy] = useCopy(code);

  const lines = code.split("\n");

  return (
    <div className={styles.snippet}>
      <div className={styles.head}>
        <span className={styles.label}>{label}</span>
        <button type="button" className={styles.copy} onClick={copy}>
          <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
      <pre className={styles.pre}>
        <code>
          {lines.map((line, i) => (
            <span key={i}>
              {shell && line !== "" && (
                <span className={styles.prompt} aria-hidden="true">
                  ${" "}
                </span>
              )}
              {line}
              {i < lines.length - 1 && "\n"}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}

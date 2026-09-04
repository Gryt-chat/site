import { useCopy } from "../lib/useCopy";
import styles from "./Snippet.module.css";

/**
 * A line or two of real code, with a label and a copy button.
 *
 * `design.md` bans hand-built fake window chrome: title bars, traffic lights,
 * an invented terminal frame. This does not pretend to be a terminal — it is a
 * labelled `<pre>` with a hairline.
 *
 * The `$` on a shell line is drawn and never copied. The copy button hands over
 * the command, and so does the selection, because the prompt is
 * `user-select: none`.
 *
 * The button says "Copied" rather than firing a toast.
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

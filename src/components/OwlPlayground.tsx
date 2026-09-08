import { avatarSeed, owlAvatarDataUri } from "@gryt/owl";
import { useMemo, useState } from "react";

import { Snippet } from "./Snippet";
import styles from "./OwlPlayground.module.css";

/**
 * `@gryt/owl` running on the page that is telling you about it: the line in the snippet is
 * the line below, with the name you typed. The literal goes through `JSON.stringify`.
 */
const FALLBACK = "gryt";

export function OwlPlayground() {
  const [name, setName] = useState("nora");

  const seed = avatarSeed(name) ?? FALLBACK;
  const src = useMemo(() => owlAvatarDataUri(seed, { size: 320 }), [seed]);

  const literal = JSON.stringify(name);
  const code = `import { avatarSeed, owlAvatarDataUri } from "@gryt/owl";

const src = owlAvatarDataUri(avatarSeed(${literal}) ?? "${FALLBACK}");`;

  return (
    <div className={styles.playground}>
      <label className={styles.field}>
        <span className={styles.fieldLabel}>A name</span>
        <input
          className={styles.input}
          value={name}
          onChange={(e) => setName(e.target.value.slice(0, 24))}
          placeholder="anything"
          spellCheck={false}
          autoComplete="off"
        />
      </label>

      <div className={styles.grid}>
        <figure className={styles.output}>
          <img
            src={src}
            alt={`The owl @gryt/owl draws for the name ${seed}`}
            width={320}
            height={320}
          />
          <figcaption>{seed}</figcaption>
        </figure>

        <div className={styles.code}>
          <Snippet label="owl.ts" code={code} />
          <p className={styles.note}>
            No network, no canvas, no dependencies. It&rsquo;s a function from
            a string to SVG markup, and it runs the same in Node as it does
            here. <code>avatarSeed</code> lower-cases and trims, so someone who
            renames themselves and only changes the capitals keeps the same owl.
          </p>
        </div>
      </div>
    </div>
  );
}

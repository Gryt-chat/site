import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

import { inView, rise, stagger } from "./home/motion";
import styles from "./Showcase.module.css";

/**
 * One feature, shown beside its own words.
 *
 * The front page had eight hand-written sections and no way to say "media one
 * side, text the other" without a ninth CSS module doing it again. This is that
 * shape, once. The two audience pages use it too, which is the other half of
 * the reason it exists: three files agreeing on a layout is how the layout
 * stops being the same layout.
 *
 * `side` is passed in rather than derived from `:nth-child`. Alternation by
 * child index looks tidy right up until somebody inserts a section in the
 * middle, at which point every block below it flips and the diff says one line.
 *
 * `media` may be null, and a section with no media renders as a plain column
 * rather than as an empty half. Four of these are waiting on captures that do
 * not exist yet, and a page with a video-shaped hole in it is worse than a page
 * with a paragraph in it — the same call `Hero.tsx` makes with `CREATE_SERVER`.
 */
export type ShowcaseSide = "left" | "right";
export type ShowcaseSize = "regular" | "large" | "full";

interface ShowcaseProps {
  id?: string;
  /** Which side the media sits on from 900px up. Ignored by `full`. */
  side?: ShowcaseSide;
  /**
   * `regular` splits the row evenly, `large` gives the media the wider column,
   * `full` puts the media under the text at the full width of the section.
   */
  size?: ShowcaseSize;
  eyebrow: string;
  title: string;
  children: ReactNode;
  media?: ReactNode;
  /** Sits under the media, at the media's width. */
  mediaCaption?: ReactNode;
  /** Full width under both columns. The voice facts are the reason for it. */
  below?: ReactNode;
}

export function Showcase({
  id,
  side = "right",
  size = "regular",
  eyebrow,
  title,
  children,
  media,
  mediaCaption,
  below,
}: ShowcaseProps) {
  const reduced = useReducedMotion() ?? false;
  const split = media != null && size !== "full";

  return (
    <section className={styles.section} id={id}>
      <motion.div className={styles.inner} variants={stagger(reduced)} {...inView}>
        <div
          className={styles.row}
          data-size={size}
          data-side={split ? side : undefined}
          data-split={split || undefined}
        >
          {/* Text first in the DOM whichever side it is drawn on. The visual
              swap is a grid placement, not a `row-reverse`, so reading order
              and tab order stay the order the words are written in. */}
          <div className={styles.copy}>
            <motion.p className={styles.eyebrow} variants={rise(reduced)}>
              {eyebrow}
            </motion.p>
            <motion.h2 className={styles.title} variants={rise(reduced)}>
              {title}
            </motion.h2>
            <motion.div className={styles.body} variants={rise(reduced)}>
              {children}
            </motion.div>
          </div>

          {media != null && (
            <motion.figure className={styles.media} variants={rise(reduced)}>
              {media}
              {mediaCaption && (
                <figcaption className={styles.caption}>{mediaCaption}</figcaption>
              )}
            </motion.figure>
          )}
        </div>

        {below && (
          <motion.div className={styles.below} variants={rise(reduced)}>
            {below}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}

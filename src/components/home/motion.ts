import type { Variants } from "motion/react";

/**
 * Shared motion vocabulary for the front page.
 *
 * Everything animates `transform` and `opacity` only, and every spatial move
 * has a reduced-motion counterpart that collapses to a short fade. Components
 * read `useReducedMotion()` and pass the result to these builders rather than
 * each one re-deriving it.
 */
const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export const rise = (reduced: boolean): Variants => ({
  hidden: { opacity: 0, y: reduced ? 0 : 24 },
  shown: {
    opacity: 1,
    y: 0,
    transition: { duration: reduced ? 0.15 : 0.6, ease: EASE_OUT },
  },
});

/** Parent for a group whose children arrive one after another. */
export const stagger = (reduced: boolean, gap = 0.07): Variants => ({
  hidden: {},
  shown: {
    transition: {
      staggerChildren: reduced ? 0 : gap,
      delayChildren: reduced ? 0 : 0.05,
    },
  },
});

/** Applied to sections so they animate the first time they scroll into view. */
export const inView = {
  initial: "hidden",
  whileInView: "shown",
  viewport: { once: true, margin: "-80px" },
} as const;

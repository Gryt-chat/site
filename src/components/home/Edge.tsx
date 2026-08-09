import { motion, useReducedMotion } from "motion/react";
import { inView, rise, stagger } from "./motion";
import styles from "./Edge.module.css";

/**
 * Sits directly under the hero so it lands inside the first two screenfuls,
 * where NN/g's eyetracking puts 74% of viewing time. The section that actually
 * compares Gryt to the alternatives starts around 3,800px, which is outside
 * that window — this answers the same question for the people who never get
 * there, and the comparison further down is the proof for the ones who do.
 *
 * Three items, one line each. Anything longer stops being scannable, which
 * defeats the point of moving it up.
 */
const edges = [
  {
    claim: "The voice stack is ours",
    body: "Written from scratch in Go on Pion, after two years learning WebRTC internals. Most open source alternatives rent theirs from LiveKit or Mediasoup.",
  },
  {
    claim: "A server cannot become you",
    body: "You sign a one-time challenge with a key that never leaves your device. The proof is bound to that one server and expires in 60 seconds.",
  },
  {
    claim: "120 fps screen sharing",
    body: "With AV1 or H.264 encoded on your GPU, and a gaming mode that holds framerate over sharpness. No tier gates the bitrate.",
  },
];

export function Edge() {
  const reduced = useReducedMotion() ?? false;

  return (
    <section className={styles.section} id="edge">
      <motion.div className={styles.inner} variants={stagger(reduced)} {...inView}>
        <motion.h2 className={styles.heading} variants={rise(reduced)}>
          What Gryt has that the others don't
        </motion.h2>

        <div className={styles.grid}>
          {edges.map((e, i) => (
            <motion.article key={e.claim} className={styles.item} variants={rise(reduced)}>
              <span className={styles.num} aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3>{e.claim}</h3>
              <p>{e.body}</p>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

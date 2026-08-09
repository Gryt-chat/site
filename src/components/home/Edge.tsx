import { motion, useReducedMotion } from "motion/react";
import { inView, rise, stagger } from "./motion";
import styles from "./Edge.module.css";

/**
 * The one argument section, sitting directly under the hero so it lands inside
 * the first two screenfuls, where NN/g's eyetracking puts 74% of viewing time.
 *
 * This used to be two sections. A three-item differentiator strip here and a
 * five-item "why Gryt" block under it meant eight claims before the reader saw
 * any product, and two of them were the same claim: "a server cannot become
 * you" and "your identity cannot be stolen". The five that survive each say
 * something the others do not, and the one that got cut — voice the SFU cannot
 * decrypt — is answered properly in the security section instead.
 *
 * The first three are what nothing else on the list has. The last two are the
 * ground the whole project stands on.
 */
const lead = [
  {
    claim: "The voice stack is ours",
    body: "Written from scratch in Go on Pion, after two years spent learning WebRTC internals. Most open source alternatives rent theirs from LiveKit or Mediasoup, which means the hardest part of the product is somebody else's to fix.",
  },
  {
    claim: "A server cannot become you",
    body: "You sign a one-time challenge with a key that never leaves your device. The proof is bound to that one server and expires in 60 seconds, so it is useless anywhere else.",
  },
  {
    claim: "120 fps screen sharing",
    body: "AV1 or H.264 encoded on your GPU, with a gaming mode that holds framerate over sharpness. The server owner sets the bitrate, not a subscription tier.",
  },
];

const ground = [
  {
    claim: "Open source down to the certificate authority",
    body: "The client is only the part you can see. The signalling server, the Go media server, the image worker, the docs, this site and the whole authentication stack are AGPL-3.0 and readable. Run all of it yourself and you depend on nothing of ours.",
  },
  {
    claim: "Nothing phones home",
    body: "No analytics, no telemetry, no usage tracking of any kind. Your messages and uploads sit in your own database, on your own disk, and every feature is available to every user.",
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
          {lead.map((e) => (
            <motion.article
              key={e.claim}
              className={`${styles.item} ${styles.lead}`}
              variants={rise(reduced)}
            >
              <h3>{e.claim}</h3>
              <p>{e.body}</p>
            </motion.article>
          ))}

          {ground.map((e) => (
            <motion.article
              key={e.claim}
              className={`${styles.item} ${styles.ground}`}
              variants={rise(reduced)}
            >
              <h3>{e.claim}</h3>
              <p>{e.body}</p>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

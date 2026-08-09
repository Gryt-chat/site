import { motion, useReducedMotion } from "motion/react";
import { inView, rise, stagger } from "./motion";
import styles from "./Pillars.module.css";

/**
 * The five arguments, stated once, in the order someone evaluating Gryt asks
 * them. Every claim here is one the docs already make — see
 * docs/guide/why-gryt.mdx § The short version.
 */
const pillars = [
  {
    title: "Open source, all of it",
    body: "The client is only the part you can see. The signalling server, the Go media server, the image worker, the docs, this site and the whole authentication stack, including the Keycloak realm and the identity certificate authority, are AGPL-3.0 and readable. Run all of it yourself and you depend on nothing of ours.",
  },
  {
    title: "No paywalls, no tiers",
    body: "Every feature is available to every user. Stream quality is set by whoever runs the server, not by what anyone paid this month.",
  },
  {
    title: "Your data, your disk",
    body: "Messages and uploads live in your own database and object storage, on hardware you control. No analytics, no telemetry, no third parties. Nothing phones home.",
  },
  {
    title: "Your identity cannot be stolen",
    body: "You prove who you are by signing a one-time challenge with a key that never leaves your device. The proof is bound to one server and expires in 60 seconds, so it is useless anywhere else.",
  },
  {
    title: "Voice nobody can listen to",
    body: "WebRTC encrypts media with DTLS-SRTP end to end. The SFU forwards encrypted packets without decrypting them, so it can route your call but cannot hear it.",
  },
];

export function Pillars() {
  const reduced = useReducedMotion() ?? false;

  return (
    <section className={styles.section} id="why">
      <motion.div
        className={styles.inner}
        variants={stagger(reduced)}
        {...inView}
      >
        <motion.p className={styles.eyebrow} variants={rise(reduced)}>
          Why Gryt
        </motion.p>
        <motion.h2 className={styles.heading} variants={rise(reduced)}>
          Five reasons, and none of them are a free trial.
        </motion.h2>

        <div className={styles.grid}>
          {pillars.map((p) => (
            <motion.article
              key={p.title}
              className={styles.card}
              variants={rise(reduced)}
            >
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

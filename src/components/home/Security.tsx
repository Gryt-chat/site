import { motion, useReducedMotion } from "motion/react";
import { inView, rise, stagger } from "./motion";
import styles from "./Security.module.css";

/** Source: docs/guide/security.mdx and docs/guide/why-gryt.mdx § Skeptic FAQ. */
const claims = [
  {
    q: "Can a malicious server steal my login?",
    a: "No. Your token never reaches a community server. You sign a one-time challenge with a private key that stays on your device, and the signed proof is bound to that one server and expires in 60 seconds.",
  },
  {
    q: "Can the SFU listen to my voice?",
    a: "No. It forwards encrypted RTP without decrypting it. Routing audio and hearing audio are different jobs, and it only does the first.",
  },
  {
    q: "What if a server changes its identity key?",
    a: "Your client pinned it the first time you connected. A change is shown to you rather than accepted silently, and a host who rotates deliberately can have clients follow without it looking like an attack.",
  },
  {
    q: "Can a server admin read my messages?",
    a: "If the server stores them, yes, and that is true of every self-hosted chat system. The difference is you can be the operator, or pick one you trust.",
  },
];

export function Security() {
  const reduced = useReducedMotion() ?? false;

  return (
    <section className={styles.section} id="security">
      <motion.div className={styles.inner} variants={stagger(reduced)} {...inView}>
        <div className={styles.head}>
          <motion.p className={styles.eyebrow} variants={rise(reduced)}>
            Security
          </motion.p>
          <motion.h2 className={styles.heading} variants={rise(reduced)}>
            The awkward questions, answered on the front page.
          </motion.h2>
          <motion.p className={styles.sub} variants={rise(reduced)}>
            A security page that only lists the good parts is marketing. These
            are the four things people actually ask, including the one where the
            answer is not flattering.
          </motion.p>
        </div>

        <div className={styles.list}>
          {claims.map((c) => (
            <motion.div key={c.q} className={styles.item} variants={rise(reduced)}>
              <h3>{c.q}</h3>
              <p>{c.a}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

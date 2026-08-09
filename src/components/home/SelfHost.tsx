import { motion, useReducedMotion } from "motion/react";
import { inView, rise, stagger } from "./motion";
import styles from "./SelfHost.module.css";

/** Sources: /blog/windows-server-is-here, /blog/from-scylladb-to-sqlite,
 *  docs/deployment/*. */
const paths = [
  {
    name: "Docker Compose",
    detail: "One command on any Linux box. Pre-built images on GHCR, nothing to build.",
    code: "docker compose up -d",
  },
  {
    name: "Windows",
    detail: "A zip, one config file and a batch script. Node.js is the only thing you install.",
    code: "start.bat",
  },
  {
    name: "From the app",
    detail: "Host a server straight out of the desktop client, image processing included.",
    code: "Settings → Host a server",
  },
];

export function SelfHost() {
  const reduced = useReducedMotion() ?? false;

  return (
    <section className={styles.section} id="self-host">
      <motion.div className={styles.inner} variants={stagger(reduced)} {...inView}>
        <motion.p className={styles.eyebrow} variants={rise(reduced)}>
          Run it yourself
        </motion.p>
        <motion.h2 className={styles.heading} variants={rise(reduced)}>
          No database container. No sysadmin degree.
        </motion.h2>
        <motion.p className={styles.sub} variants={rise(reduced)}>
          The database is SQLite, so it is one file on your disk. Copy it and
          you have a backup, move it and you have migrated.
        </motion.p>

        <div className={styles.grid}>
          {paths.map((p) => (
            <motion.article key={p.name} className={styles.card} variants={rise(reduced)}>
              <h3>{p.name}</h3>
              <p>{p.detail}</p>
              <code>{p.code}</code>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

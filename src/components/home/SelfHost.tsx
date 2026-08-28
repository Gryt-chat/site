import { motion, useReducedMotion } from "motion/react";

import { inView, rise, stagger } from "./motion";
import styles from "./SelfHost.module.css";

const DOCS = "https://docs.gryt.chat/docs";

/**
 * Four ways in, and none of them is a wall of shell.
 *
 * This section used to open on a twelve-line Docker Compose block with an
 * `openssl rand` in it, which is the right thing to hand somebody who has
 * already decided and the wrong thing to put in front of somebody deciding.
 * The commands live in the quick-start guide, where they can be kept correct in
 * one place.
 *
 * Ordered by how little you have to know: the desktop app needs nothing, and
 * Docker is at the end because it is the one that assumes the most.
 */
const WAYS = [
  {
    name: "From the app",
    detail:
      "The client you downloaded is already a server. Name it, press create, and read the address out. No terminal at all.",
    href: `${DOCS}/deployment/embedded`,
    linkLabel: "Hosting from the app",
  },
  {
    name: "Windows",
    detail:
      "A zip, one config file and a batch script. Node.js is the only thing you install yourself.",
    href: `${DOCS}/deployment/windows`,
    linkLabel: "Windows guide",
  },
  {
    name: "Linux",
    detail:
      "Four commands and a server is up. The database is SQLite, so it is one file on your disk — copy it and you have a backup.",
    href: `${DOCS}/guide/quick-start`,
    linkLabel: "Quick start",
  },
  {
    name: "Docker",
    detail:
      "A compose file and an .env. There is a Helm chart too, if you are the sort of person who has a cluster.",
    href: `${DOCS}/deployment/docker-compose`,
    linkLabel: "Deployment docs",
  },
];

const MORE = [
  { label: "No domain, just an IP", href: `${DOCS}/deployment/no-domain` },
  { label: "Behind a Cloudflare Tunnel", href: `${DOCS}/deployment/cloudflare-tunnel` },
  { label: "Over Tailscale", href: `${DOCS}/deployment/tailscale` },
  { label: "Monitoring", href: `${DOCS}/deployment/monitoring` },
];

export function SelfHost() {
  const reduced = useReducedMotion() ?? false;

  return (
    <section className={styles.section} id="self-host">
      <motion.div className={styles.inner} variants={stagger(reduced)} {...inView}>
        <motion.p className={styles.eyebrow} variants={rise(reduced)}>
          Self-hosting
        </motion.p>
        <motion.h2 className={styles.heading} variants={rise(reduced)}>
          Put it on a machine that stays on.
        </motion.h2>
        <motion.p className={styles.sub} variants={rise(reduced)}>
          Hosting from the app is enough for an evening with friends. For a
          server that should still be there when your laptop closes, put it
          somewhere that does not. Pick whichever of these sounds like you.
        </motion.p>

        <div className={styles.grid}>
          {WAYS.map((w) => (
            <motion.a
              key={w.name}
              className={styles.card}
              href={w.href}
              target="_blank"
              rel="noreferrer"
              variants={rise(reduced)}
            >
              <h3>{w.name}</h3>
              <p>{w.detail}</p>
              <span className={styles.cardLink}>
                {w.linkLabel} <span aria-hidden="true">→</span>
              </span>
            </motion.a>
          ))}
        </div>

        <motion.ul className={styles.more} variants={rise(reduced)}>
          {MORE.map((m) => (
            <li key={m.href}>
              <a href={m.href} target="_blank" rel="noreferrer">
                {m.label} <span aria-hidden="true">→</span>
              </a>
            </li>
          ))}
        </motion.ul>
      </motion.div>
    </section>
  );
}

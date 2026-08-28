import { motion, useReducedMotion } from "motion/react";

import { Clip, type ClipSet } from "../Clip";
import { inView, rise, stagger } from "./motion";
import styles from "./SelfHost.module.css";

const DOCS = "https://docs.gryt.chat/docs";

/**
 * Hosting from the app, start to finish, with nothing cut out.
 *
 * Sivert's own capture, 2026-08-28. Eleven and a half seconds from an empty
 * client to a server with a channel open and somebody talking in it: Add a
 * server, name it, take the port it picked, press create. There is no terminal
 * in the recording because there is no terminal in the flow, which is the whole
 * claim of the first card below and was a sentence until now.
 *
 * `--poster-at 2.9` rather than the first frame. The clip opens on an empty
 * client, and an empty client is what `prefers-reduced-motion` would have been
 * handed as the still for a section about starting a server.
 *
 *   node scripts/encode-clips.mjs create-server-preview.mp4 create-server \
 *     --width 2200 --fps 30 --duration 11.5 --poster-at 2.9
 *
 * 30fps and the script's default CRFs, unlike the two clips in Hero and Voice.
 * This is flat UI at a walking pace — a dialog, a field, a cursor — and frame
 * rate is not the claim it is making.
 */
const CREATE: ClipSet = {
  src: "/home/create-server.mp4",
  av1: "/home/create-server.av1.mp4",
  poster: "/home/create-server.poster.webp",
};

const CREATE_SHOWS =
  "An empty Gryt client, then Add a server, a name typed into Create your " +
  "server with the port already filled in, and a running server with its " +
  "General channel open";

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

        <motion.figure className={styles.capture} variants={rise(reduced)}>
          <Clip {...CREATE} alt={CREATE_SHOWS} width={2200} height={1212} />
          <figcaption>
            Hosting from the app, in full: name it, take the port it picked,
            press create. It stops when you close the app, which is what the
            four below are for.
          </figcaption>
        </motion.figure>

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

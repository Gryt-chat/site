import { motion, useReducedMotion } from "motion/react";

import { Clip, type ClipSet } from "../Clip";
import { inView, rise, stagger } from "./motion";
import styles from "./SelfHost.module.css";

const DOCS = "https://docs.gryt.chat/docs";

/**
 * Hosting from the app, start to finish, with nothing cut out.
 *
 * Sivert's own capture, 2026-08-28, and **the whole take**. Sixteen seconds
 * from an empty client to a server that somebody else on the network can see:
 * Add a server, name it, take the port it picked, press create, look through
 * the settings it made, say something in #General, react to it, and open
 * Servers on your network to find it already listed. There is no terminal in
 * the recording because there is no terminal in the flow, which is the claim of
 * the first card below and was a sentence until now.
 *
 * It was cut into two shorter clips first — the creation here, the discovery
 * page over in `Lan` — and that was wrong. It is one continuous thing, the
 * point of it is that you watch a server go from nothing to findable without
 * the recording ever leaving the app, and two clips of the same take running in
 * two places on one page is the same footage twice.
 *
 * `--poster-at 2.9` rather than the first frame. The clip opens on an empty
 * client, and an empty client is what `prefers-reduced-motion` would have been
 * handed as the still for a section about starting a server.
 *
 *   node scripts/encode-clips.mjs create-server-preview.mp4 create-server \
 *     --width 2200 --fps 30 --poster-at 2.9
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
  "server with the port already filled in, a running server with its General " +
  "channel open and a message sent in it, and finally the Servers on your " +
  "network page with that server already listed";

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
      "The client you downloaded is already a server. Name it, press create, read the address out. No terminal at all.",
    href: `${DOCS}/deployment/embedded`,
    linkLabel: "Hosting from the app",
  },
  {
    name: "Windows",
    detail:
      "A zip, one config file and a batch script. Node.js is the only thing you have to install yourself.",
    href: `${DOCS}/deployment/windows`,
    linkLabel: "Windows guide",
  },
  {
    name: "Linux",
    detail:
      "Four commands and a server is up. The database is SQLite, so it's one file on your disk. Copy it and you have a backup.",
    href: `${DOCS}/guide/quick-start`,
    linkLabel: "Quick start",
  },
  {
    name: "Docker",
    detail:
      "A compose file and an .env. There's a Helm chart too, if you're the sort of person who has a cluster.",
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
          Hosting from the app is fine for an evening with friends. But if you
          want it still running after you shut your laptop, put it on something
          that stays on. Pick whichever of these sounds like you.
        </motion.p>

        <motion.figure className={styles.capture} variants={rise(reduced)}>
          <Clip {...CREATE} alt={CREATE_SHOWS} width={2200} height={1212} />
          <figcaption>
            The whole thing, uncut. Name it, keep the port it picked, press
            create, say something, and there it is on the network for everyone
            else. It stops when you close the app. That's what the four below
            are for.
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

import { motion, useReducedMotion } from "motion/react";
import { inView, rise, stagger } from "./motion";
import styles from "./Compare.module.css";

/**
 * Two comparisons, because they are two different arguments.
 *
 * The table is against the closed platforms, where the case is about what you
 * are allowed to do with the software. The cards are against the open ones,
 * where that argument is already settled and the honest answer is that they
 * are good — so each card says what the project is best at before it says what
 * Gryt does differently.
 *
 * Every characterisation below is Sivert's own, published in
 * /blog/the-projects-that-paved-the-way. Nothing here grades software on
 * anything he has not already said in public.
 */
const rows = [
  { label: "Self-hostable", gryt: true, discord: false, teamspeak: true },
  { label: "Source you can read", gryt: true, discord: false, teamspeak: false },
  { label: "Fork and redistribute", gryt: true, discord: false, teamspeak: false },
  { label: "Runs in a browser", gryt: true, discord: true, teamspeak: false },
  { label: "Every feature without paying", gryt: true, discord: false, teamspeak: "partial" },
  { label: "Server cannot impersonate you", gryt: true, discord: "n/a", teamspeak: false },
];

const cols = [
  { key: "gryt", name: "Gryt" },
  { key: "discord", name: "Discord" },
  { key: "teamspeak", name: "TeamSpeak" },
] as const;

const openSource = [
  {
    name: "Mumble",
    href: "https://www.mumble.info/",
    best: "Still one of the best low-latency voice clients ever made. Positional audio, tiny footprint, rock solid since 2005.",
    diff: "It does voice and only voice, from a native client. Gryt adds text, uploads, video and a browser you can join from.",
  },
  {
    name: "Jitsi Meet",
    href: "https://meet.jit.si/",
    best: "Proved open source WebRTC conferencing works at scale. Their video bridge is one of the most battle-tested SFUs there is.",
    diff: "It is a meeting tool. Gryt is a place a community sits in, with persistent channels and roles rather than rooms you schedule.",
  },
  {
    name: "Element & Matrix",
    href: "https://element.io/",
    best: "Federated, end-to-end encrypted, no single company in control. Governments run it. Nothing else comes close on those two axes.",
    diff: "If federation and E2EE are your priorities, use it. Gryt trades federation for a simpler stack and voice built in-house.",
  },
  {
    name: "Revolt",
    href: "https://revolt.chat/",
    best: "The most familiar experience for anyone leaving Discord. Clean UI, servers, channels, roles, custom emoji, a real community.",
    diff: "Voice is still being developed there and self-hosted voice is fiddly. Voice is the part Gryt started with.",
  },
  {
    name: "Rocket.Chat",
    href: "https://www.rocket.chat/",
    best: "Enterprise communication done properly. Omnichannel, audit logs, compliance tooling, federation.",
    diff: "It is Slack for organisations. Gryt is for a friend group on a spare PC, and is not trying to be compliant with anything.",
  },
  {
    name: "Spacebar & Sharkord",
    href: "https://spacebar.chat/",
    best: "Spacebar reimplements Discord's API, so existing bots work. Sharkord runs on a Raspberry Pi as a single binary.",
    diff: "Both lean on Mediasoup for voice. Gryt's SFU is written from scratch on Pion, which is why the voice path is ours to fix.",
  },
];

function Cell({ value }: { value: boolean | string }) {
  if (value === true) return <span className={styles.yes} aria-label="Yes">●</span>;
  if (value === false) return <span className={styles.no} aria-label="No">–</span>;
  if (value === "partial")
    return <span className={styles.partial} aria-label="Partly">◐</span>;
  return <span className={styles.na} aria-label="Not applicable">n/a</span>;
}

export function Compare() {
  const reduced = useReducedMotion() ?? false;

  return (
    <section className={styles.section} id="compare">
      <motion.div className={styles.inner} variants={stagger(reduced)} {...inView}>
        <motion.p className={styles.eyebrow} variants={rise(reduced)}>
          Against the alternatives
        </motion.p>
        <motion.h2 className={styles.heading} variants={rise(reduced)}>
          What you can do with it, and what you cannot.
        </motion.h2>

        <motion.div className={styles.wrap} variants={rise(reduced)}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col" className={styles.rowHead}>
                  <span className="sr-only">Capability</span>
                </th>
                {cols.map((c) => (
                  <th
                    key={c.key}
                    scope="col"
                    className={c.key === "gryt" ? styles.own : undefined}
                  >
                    {c.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label}>
                  <th scope="row" className={styles.rowHead}>{r.label}</th>
                  {cols.map((c) => (
                    <td key={c.key} className={c.key === "gryt" ? styles.own : undefined}>
                      <Cell value={r[c.key]} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        <motion.p className={styles.note} variants={rise(reduced)}>
          Discord's identity row is marked not applicable because there is only
          one server and it belongs to Discord. On Gryt you join servers other
          people run, so the question has an answer worth giving.
        </motion.p>

        {/* ── The open source ones ── */}

        <motion.h3 className={styles.subheading} variants={rise(reduced)}>
          The open source ones are good. Here is where we differ.
        </motion.h3>
        <motion.p className={styles.subnote} variants={rise(reduced)}>
          These are the projects I read while building Gryt, and I would rather
          send you to the right one than win an argument. Every line here is
          from{" "}
          <a href="/blog/the-projects-that-paved-the-way">
            a post I wrote about them
          </a>
          .
        </motion.p>

        <div className={styles.grid}>
          {openSource.map((p) => (
            <motion.article key={p.name} className={styles.card} variants={rise(reduced)}>
              <h4>
                <a href={p.href} target="_blank" rel="noreferrer">
                  {p.name}
                </a>
              </h4>
              <p className={styles.best}>{p.best}</p>
              <p className={styles.diff}>
                <span>Gryt</span>
                {p.diff}
              </p>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

import { motion, useReducedMotion } from "motion/react";
import { inView, rise, stagger } from "./motion";
import styles from "./Compare.module.css";

/**
 * Two comparisons, because they are two different arguments.
 *
 * The tables are against the closed platforms, where the case is about what a
 * feature costs you. The cards are against the open ones, where that argument
 * is already settled and the honest answer is that they are good.
 *
 * Every Gryt figure below was read out of the source, not remembered:
 *   uploads 100 MB, avatars and emoji 5 MB   server/src/db/interfaces.ts:76-82
 *   voice bitrate default 96, ceiling 510    interfaces.ts:83, channels.ts:65
 *   screen share fps ladder                  client useScreenShare.ts:15
 *   custom invite codes                      server/src/db/sqlite/invites.ts:31
 *   animated avatars                         image-worker/src/index.ts:264
 *   addons                                   client addonsSettings.tsx
 *
 * The Discord column says "Paid" or "Boosts" rather than naming a tier level,
 * because published sources disagree on which boost level unlocks what and a
 * wrong number on our own comparison table is worse than a vaguer true one.
 */
const paidElsewhere = [
  { label: "Animated avatar", gryt: "Free", discord: "Paid", teamspeak: "—" },
  { label: "Animated server icon", gryt: "Free", discord: "Boosts", teamspeak: "—" },
  { label: "Animated custom emoji", gryt: "Free", discord: "Paid", teamspeak: "—" },
  { label: "Custom invite link", gryt: "Free", discord: "Boosts", teamspeak: "—" },
  { label: "Your own domain", gryt: "Free", discord: "No", teamspeak: "Free" },
  { label: "File uploads", gryt: "100 MB, you set it", discord: "Paid", teamspeak: "—" },
  { label: "Voice bitrate", gryt: "Up to 510 kbps", discord: "Boosts", teamspeak: "You set it" },
  { label: "Screen share framerate", gryt: "Up to 240 fps", discord: "Paid", teamspeak: "—" },
  { label: "Addons and plugins", gryt: "Free", discord: "No", teamspeak: "Free" },
];

const everyone = [
  { label: "Voice channels", gryt: true, discord: true, teamspeak: true },
  { label: "Text chat and history", gryt: true, discord: true, teamspeak: "Limited" },
  { label: "Roles and permissions", gryt: true, discord: true, teamspeak: true },
  { label: "File sharing", gryt: true, discord: true, teamspeak: true },
  { label: "Screen sharing", gryt: true, discord: true, teamspeak: true },
  { label: "Video and webcam", gryt: true, discord: true, teamspeak: true },
  { label: "Push to talk", gryt: true, discord: true, teamspeak: true },
  { label: "Noise suppression", gryt: true, discord: true, teamspeak: true },
  { label: "Desktop app", gryt: true, discord: true, teamspeak: true },
  { label: "Runs in a browser", gryt: true, discord: true, teamspeak: false },
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
    name: "Stoat",
    href: "https://stoat.chat/",
    best: "Formerly Revolt. The most familiar experience for anyone leaving Discord, and the largest open source alternative by some distance.",
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

function Mark({ value }: { value: boolean | string }) {
  if (value === true) return <span className={styles.yes} aria-label="Yes">●</span>;
  if (value === false) return <span className={styles.no} aria-label="No">–</span>;
  if (value === "Free") return <span className={styles.free}>Free</span>;
  if (value === "Paid" || value === "Boosts")
    return <span className={styles.cost}>{value}</span>;
  if (value === "No" || value === "—")
    return <span className={styles.no} aria-label="Not available">{value === "No" ? "No" : "–"}</span>;
  return <span className={styles.plain}>{value}</span>;
}

function Table({
  rows,
  caption,
}: {
  rows: { label: string; gryt: boolean | string; discord: boolean | string; teamspeak: boolean | string }[];
  caption: string;
}) {
  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            <th scope="col" className={styles.rowHead}>
              <span className="sr-only">Capability</span>
            </th>
            {cols.map((c) => (
              <th key={c.key} scope="col" className={c.key === "gryt" ? styles.own : undefined}>
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
                  <Mark value={r[c.key]} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
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
          Things you pay for elsewhere.
        </motion.h2>
        <motion.p className={styles.lede} variants={rise(reduced)}>
          None of these are a plan, a tier, or a boost level. They are the
          defaults, and a server owner can raise every limit on this list.
        </motion.p>

        <motion.div variants={rise(reduced)}>
          <Table rows={paidElsewhere} caption="Features that cost money on other platforms" />
        </motion.div>

        <motion.h3 className={styles.subheading} variants={rise(reduced)}>
          And the ordinary things, which all of us have.
        </motion.h3>
        <motion.p className={styles.subnote} variants={rise(reduced)}>
          A comparison that only lists what we win at is a sales page. This is
          the rest of it, including the row where TeamSpeak has no browser
          client and the one where its text history is thinner than ours.
        </motion.p>

        <motion.div variants={rise(reduced)}>
          <Table rows={everyone} caption="Features common to all three platforms" />
        </motion.div>

        <motion.p className={styles.note} variants={rise(reduced)}>
          Gryt's figures come from its own source: 100 MB uploads and 5 MB
          avatars are the shipped defaults, voice tops out at 510 kbps, and
          screen sharing offers 30 to 120 fps with 144, 165 and 240 as
          experimental options. The Discord column says "Paid" or "Boosts"
          rather than naming a tier, because published sources disagree on which
          boost level unlocks what. If anything here is out of date,{" "}
          <a href="https://github.com/Gryt-chat/gryt/issues" target="_blank" rel="noreferrer">
            tell us and we will fix it
          </a>
          .
        </motion.p>

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

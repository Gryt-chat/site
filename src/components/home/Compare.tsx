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
 * The Discord column says "Subscription" and "Paid boosts" rather than "Nitro"
 * and "Boost level". Those are Discord's words for money, and repeating them in
 * our own comparison does their softening for them. No boost level is named
 * either, because published sources disagree on which level unlocks what.
 */
const paidElsewhere = [
  { label: "Animated avatar", gryt: "Included", discord: "Subscription", discordPaid: true, teamspeak: "\u2014" },
  { label: "Animated server icon", gryt: "Included", discord: "Paid boosts", discordPaid: true, teamspeak: "\u2014" },
  { label: "Animated custom emoji", gryt: "Included", discord: "Subscription", discordPaid: true, teamspeak: "\u2014" },
  { label: "Custom invite link", gryt: "Included", discord: "Paid boosts", discordPaid: true, teamspeak: "\u2014" },
  { label: "Your own domain", gryt: "Included", discord: "Not possible", teamspeak: "Included" },
  { label: "File uploads", gryt: "100 MB, you set it", discord: "500 MB", discordPaid: true, teamspeak: "\u2014" },
  { label: "Voice bitrate", gryt: "Up to 510 kbps", discord: "Up to 384 kbps", discordPaid: true, teamspeak: "You set it" },
  { label: "Screen share framerate", gryt: "Up to 240 fps", discord: "1080p at 60 fps", discordPaid: true, teamspeak: "\u2014" },
  { label: "Addons and plugins", gryt: "Included", discord: "Not possible", teamspeak: "Included" },
];

const everyone = [
  { label: "Voice channels", gryt: true, discord: true, teamspeak: true },
  { label: "Text chat and history", gryt: true, discord: true, teamspeak: "Limited" },
  { label: "Roles and permissions", gryt: true, discord: true, teamspeak: true },
  { label: "File sharing", gryt: true, discord: true, teamspeak: true },
  { label: "Push to talk", gryt: true, discord: true, teamspeak: true },
  { label: "Noise suppression", gryt: true, discord: true, teamspeak: true },
  { label: "Desktop app", gryt: true, discord: true, teamspeak: true },
  { label: "Screen sharing", gryt: true, discord: true, teamspeak: false },
  { label: "Video and webcam", gryt: true, discord: true, teamspeak: false },
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

function Mark({ value, paid }: { value: boolean | string; paid?: boolean }) {
  if (value === true) return <span className={styles.yes} aria-label="Yes">●</span>;
  if (value === false || value === "\u2014")
    return <span className={styles.no} aria-label="Not available">–</span>;
  if (value === "Not possible")
    return <span className={styles.no}>Not possible</span>;
  if (value === "Included") return <span className={styles.free}>Included</span>;

  return (
    <span className={paid ? styles.paidValue : styles.plain}>
      {value}
      {paid && (
        <abbr className={styles.cost} title="Requires a paid plan or paid server boosts">
          ($)
        </abbr>
      )}
    </span>
  );
}

function Table({
  rows,
  caption,
}: {
  rows: {
    label: string;
    gryt: boolean | string;
    discord: boolean | string;
    teamspeak: boolean | string;
    discordPaid?: boolean;
  }[];
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
                  <Mark value={r[c.key]} paid={c.key === "discord" && r.discordPaid} />
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
          Gryt's figures are read out of its own source: 100 MB uploads and 5 MB
          avatars are the shipped defaults, voice tops out at 510 kbps, and
          screen sharing runs 30 to 120 fps with 144, 165 and 240 as
          experimental options. Every one of them is stable, and a server owner
          can raise the limits. TeamSpeak is scored on its stable client, which
          has no screen sharing or webcam; the TeamSpeak 6 beta adds both.
          Discord's own words for these are "Nitro" and "Boost level"; both
          mean money, so the table says so. No boost level is named because
          published sources disagree on which one unlocks what. If anything here is out of
          date,{" "}
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

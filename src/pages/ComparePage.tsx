import { motion, useReducedMotion } from "motion/react";
import { Card } from "@gryt/ui";

import { PageHeader } from "../components/PageHeader";
import { inView, rise, stagger } from "../components/home/motion";
import styles from "./ComparePage.module.css";

/**
 * Two comparisons, because they are two different arguments.
 *
 * The tables are against the closed platforms, where the case is about what a
 * feature costs you. The cards are against the open ones, where that argument
 * is already settled and the honest answer is that they are good.
 *
 * Every Gryt figure below was read out of the source, not remembered:
 *   uploads, avatars, emoji all 100 MB      server/src/db/interfaces.ts:147-149
 *   upload ceiling: operator's, 0 = none    socket/handlers/admin.ts:157
 *   voice bitrate default 96, ceiling 510   interfaces.ts:150, sqlite/channels.ts:65
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
  { label: "Animated avatar", gryt: "Included", discord: "Nitro Basic", cost: "$2.99/mo", teamspeak: "\u2014" },
  { label: "Animated custom emoji", gryt: "Included", discord: "Nitro Basic", cost: "$2.99/mo", teamspeak: "\u2014" },
  { label: "Screen sharing", gryt: "Up to 240 fps, native", discord: "1080p60 on Nitro", cost: "$9.99/mo", teamspeak: "\u2014" },
  { label: "Animated server icon", gryt: "Included", discord: "2 boosts", cost: "$9.98/mo", teamspeak: "\u2014" },
  { label: "Voice bitrate", gryt: "Up to 510 kbps", discord: "384 kbps at 14 boosts", cost: "$69.86/mo", teamspeak: "128 kbps" },
  // Discord's 500 MB is off their own Nitro page, which states 50MB and 500MB
  // uploads for the two tiers. Their free-tier figure is deliberately absent:
  // the only sources for it are SEO blogs and one forum post, and a number we
  // cannot cite from Discord is not going in a table arguing they overcharge.
  //
  // "Whatever the host allows" rather than "Unlimited", because unlimited is
  // what the software permits and not what any given server will accept. The
  // operator sets the number, 0 means no limit, and a server behind Cloudflare
  // is capped at 100 MB at the edge whatever it says.
  { label: "File upload size", gryt: "Whatever the host allows", discord: "500 MB on Nitro", cost: "$9.99/mo", teamspeak: "Your disk" },
  { label: "Custom invite link", gryt: "Included", discord: "14 boosts", cost: "$69.86/mo", teamspeak: "\u2014" },
  { label: "Your own domain", gryt: "Included", discord: "\u2014", teamspeak: "Included" },
  // Not "Included". The client loads theme and plugin addons from a folder, and
  // that is genuinely all of it — one object on `window`, no sandbox, no
  // registry, and the roadmap still lists the plugin system as planned. Two of
  // our own pages disagreed with this row and the row was the one that was
  // wrong. Say what it does instead of what it sounds like.
  { label: "Addons and plugins", gryt: "Themes, and an early plugin API", discord: "\u2014", teamspeak: "Included" },
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
    best: "Still one of the best low-latency voice clients ever made. Positional audio, tiny, and rock solid since 2005.",
    diff: "It does voice and nothing else, from a native client. Gryt adds text, uploads, video, and a browser you can join from.",
  },
  {
    name: "Jitsi Meet",
    href: "https://meet.jit.si/",
    best: "Proved open source WebRTC calls work at scale. Their video bridge is one of the most tested SFUs there is.",
    diff: "It's a meeting tool. Gryt is somewhere a community sits, with channels and roles that stay put instead of rooms you book.",
  },
  {
    name: "Element & Matrix",
    href: "https://element.io/",
    best: "Federated, end-to-end encrypted, no single company in control. Governments run it. Nothing else comes close on those two things.",
    diff: "If federation and E2EE are your priorities, use it. Gryt trades federation for a simpler stack and voice built in-house.",
  },
  {
    name: "Stoat",
    href: "https://stoat.chat/",
    best: "Used to be Revolt. The most familiar thing for anyone leaving Discord, and the biggest open source alternative by a long way.",
    diff: "Voice is still being built there, and self-hosted voice is fiddly. Voice is the part Gryt started with.",
  },
  {
    name: "Rocket.Chat",
    href: "https://www.rocket.chat/",
    best: "Enterprise chat done properly. Audit logs, compliance tooling, federation, the lot.",
    diff: "It's Slack for organisations. Gryt is for a friend group on a spare PC, and it isn't trying to be compliant with anything.",
  },
  {
    name: "Spacebar & Sharkord",
    href: "https://spacebar.chat/",
    best: "Spacebar rebuilds Discord's API, so bots written for Discord work. Sharkord runs on a Raspberry Pi as one binary.",
    diff: "Both use Mediasoup for voice. Gryt's SFU is written from scratch on Pion, so when voice breaks it's ours to fix.",
  },
];

function Mark({ value, cost }: { value: boolean | string; cost?: string }) {
  if (value === true) return <span className={styles.yes} aria-label="Yes">●</span>;
  if (value === false || value === "\u2014")
    return <span className={styles.no} aria-label="Not available">–</span>;
  if (value === "Included") return <span className={styles.free}>Included</span>;

  /* The price sits under the mechanism rather than beside it, so the column
     scans as a list of monthly costs. That is the comparison. */
  if (cost) {
    return (
      <span className={styles.paidValue}>
        <span>{value}</span>
        <b className={styles.cost}>{cost}</b>
      </span>
    );
  }

  return <span className={styles.plain}>{value}</span>;
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
    cost?: string;
  }[];
  caption: string;
}) {
  return (
    <Card className={styles.wrap}>
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
                  <Mark value={r[c.key]} cost={c.key === "discord" ? r.cost : undefined} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

export function ComparePage() {
  const reduced = useReducedMotion() ?? false;

  return (
    <main className={styles.page}>
      <PageHeader
        eyebrow="Against the alternatives"
        title="What this costs everywhere else"
        lede="Everything in the Gryt column is in the normal build and costs nothing, and whoever runs the server can turn the limits up. The right-hand column is what the same thing costs you a month somewhere else."
      />
      <motion.div variants={stagger(reduced)} {...inView}>

        <motion.div variants={rise(reduced)}>
          <Table rows={paidElsewhere} caption="Features that cost money on other platforms" />
        </motion.div>

        <motion.h3 className={styles.subheading} variants={rise(reduced)}>
          And the normal stuff, which all of us have.
        </motion.h3>
        <motion.p className={styles.subnote} variants={rise(reduced)}>
          A comparison that only lists what we win at is a sales page. So
          here's the rest of it, including the row where TeamSpeak has no
          browser client and the one where its text history beats ours.
        </motion.p>

        <motion.div variants={rise(reduced)}>
          <Table rows={everyone} caption="Features common to all three platforms" />
        </motion.div>

        <motion.p className={styles.note} variants={rise(reduced)}>
          Gryt's numbers come straight out of its own source, and they're all
          in the normal build. Uploads, avatars and emoji all start at 100 MB.
          Voice starts at 96 kbps and goes to 510. Screen sharing runs 30 to
          120 fps, with 144, 165 and 240 there as experiments. Whoever runs the
          server can turn any of it up. Discord prices are US list, checked
          August 2026: $2.99 for Nitro Basic, $9.99 for Nitro, $4.99 a server
          boost. A boost level is the boost count times that, and Nitro
          subscribers get two boosts thrown in and 30% off the rest. TeamSpeak
          is scored on its normal client, which has no screen sharing or
          webcam. The TeamSpeak 6 beta adds both. If any of this is out of
          date,{" "}
          <a href="https://github.com/Gryt-chat/gryt/issues" target="_blank" rel="noreferrer">
            tell us and we'll fix it
          </a>
          .
        </motion.p>

        <motion.h3 className={styles.subheading} variants={rise(reduced)}>
          The open source ones are good. Here's where we're different.
        </motion.h3>
        <motion.p className={styles.subnote} variants={rise(reduced)}>
          These are the projects I read while building Gryt. I'd rather point
          you at the right one than win an argument. Every line here comes
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
    </main>
  );
}

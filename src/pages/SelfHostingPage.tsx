import { useEffect } from "react";
import { Link } from "react-router-dom";

import { Block, type RowItem } from "../components/LinkRows";
import { PageHeader } from "../components/PageHeader";
import { pageTitle } from "../lib/title";
import styles from "../styles/audience.module.css";

/**
 * The how, where /why-gryt keeps the why.
 *
 * Those two collided before this page existed: /why-gryt question 4 covered
 * embedded, Compose, Helm, LAN discovery and tunnels at length, which is a
 * deployment guide inside a trust page. That answer is now a sentence and a
 * link here, and this page carries the rest.
 *
 * Almost every row leaves for docs.gryt.chat on purpose. The docs are already
 * grouped by audience and they are kept right; a second copy of them on this
 * site would be a second copy to keep right, and the one that went stale would
 * be this one.
 *
 * One thing deliberately not promised as a docs link: the Helm chart. It is
 * real — `ops/helm/gryt` in the monorepo, with a README and example values —
 * and it has no docs page at all. The row goes to the directory rather than to
 * a page that does not exist.
 */
const DOCS = "https://docs.gryt.chat/docs";
const HELM = "https://github.com/Gryt-chat/gryt/tree/main/ops/helm/gryt";

const START: RowItem[] = [
  {
    name: "From the app",
    detail: "The client you downloaded is already a server. Name it, press create, read the address out. No terminal at all.",
    href: `${DOCS}/deployment/embedded`,
  },
  {
    name: "Quick start",
    detail: "One install script and a running server on Linux. SQLite, so the database is one file you can copy for a backup.",
    href: `${DOCS}/guide/quick-start`,
  },
  {
    name: "Windows",
    detail: "A zip, one config file and a batch script. Node.js is the only thing you install yourself.",
    href: `${DOCS}/deployment/windows`,
  },
  {
    name: "Docker Compose",
    detail: "A compose file and an .env, which is what most people running this for a community end up on.",
    href: `${DOCS}/deployment/docker-compose`,
  },
  {
    name: "Helm chart",
    detail: "For a cluster. It has a README and example values and no docs page yet, so this goes to the chart itself.",
    href: HELM,
  },
];

const REACH: RowItem[] = [
  {
    name: "No domain, just an IP",
    detail: "What works and what does not when there is no name pointing at the box.",
    href: `${DOCS}/deployment/no-domain`,
  },
  {
    name: "Cloudflare Tunnel",
    detail: "HTTPS and WebSockets without opening those ports. Voice still needs its own UDP port reachable.",
    href: `${DOCS}/deployment/cloudflare-tunnel`,
  },
  {
    name: "Tailscale",
    detail: "A server nobody outside your tailnet can see, which is a reasonable answer for a group of friends.",
    href: `${DOCS}/deployment/tailscale`,
  },
];

const RUN: RowItem[] = [
  {
    name: "Configuration",
    detail: "Every setting each service takes, and the handful that span more than one of them.",
    href: `${DOCS}/guide/configuration`,
  },
  {
    name: "Roles and permissions",
    detail: "What people are allowed to do on your server, and how to decide it.",
    href: `${DOCS}/guide/roles`,
  },
  {
    name: "Who can join",
    detail: "Whether your server takes guests, accounts, or both, and what each choice costs you.",
    href: `${DOCS}/server/identity`,
  },
  {
    name: "Custom emoji",
    detail: "Uploading them, and importing a pack from emoji.gg or BetterTTV with a link.",
    href: `${DOCS}/guide/emojis`,
  },
  {
    name: "Rate limiting",
    detail: "How the server decides somebody is going too fast, and what it does about it.",
    href: `${DOCS}/server/rate-limiting`,
  },
  {
    name: "Monitoring",
    detail: "Metrics and health endpoints, for when you want to know before somebody tells you.",
    href: `${DOCS}/deployment/monitoring`,
  },
];

const TOOLS: RowItem[] = [
  {
    name: "gryt",
    mono: true,
    detail: "A terminal manager: create a server profile, edit its settings with validation, start and stop the deployment it writes.",
    href: `${DOCS}/cli`,
  },
  {
    name: "Voice debugging",
    detail: "The page to open when voice will not connect. Start here rather than in the server logs.",
    href: `${DOCS}/sfu/voice-debugging`,
  },
  {
    name: "Troubleshooting",
    detail: "Everything else that goes wrong, and what it usually turns out to be.",
    href: `${DOCS}/guide/troubleshooting`,
  },
];

export function SelfHostingPage() {
  useEffect(() => {
    document.title = pageTitle("Self-hosting");
  }, []);

  return (
    <main className={styles.page}>
      <PageHeader
        eyebrow="For self-hosters"
        title="Run it yourself."
        lede="Running the server yourself is the normal way to use Gryt. This page is the shortest route from wherever you are now to a server that is up."
      />

      <p className={styles.intro}>
        What you are running is four things: a Node server that handles
        accounts, channels, messages and uploads; a voice server written in Go
        that routes the audio and video; somewhere to put files, which is any
        S3-compatible storage; and a small worker that resizes images. On one
        machine that is one <code>docker compose up</code>. The desktop app has
        the first three inside it already, which is why hosting from the app
        needs no terminal at all.
      </p>

      <p className={styles.intro}>
        Voice is WebRTC over UDP, and that is the one part a reverse proxy or a
        tunnel cannot carry for you. It is a single port rather than a range,
        3478 unless you change it, and it has to be reachable directly.
      </p>

      <Block
        heading="Getting one up"
        note="In order of how little you have to know. The first needs nothing but the app you already downloaded."
        items={START}
      />

      <Block
        heading="Reaching it from outside"
        note="Skip this entirely if the server is for people on your own network. Gryt servers announce themselves over mDNS, so on a LAN nobody has to type an address at all."
        items={REACH}
      />

      <Block
        heading="Running it properly"
        note="The settings that matter once it is up and somebody other than you is using it."
        items={RUN}
      />

      <Block
        heading="Tools and when it breaks"
        items={TOOLS}
      />

      <Block heading="What a server decides">
        <p className={styles.blockNote}>
          Almost every limit in Gryt belongs to whoever runs the server, and
          there is no tier above them that raises it. Uploads, avatars and emoji
          all ship at 100&nbsp;MB so nobody fills a disk by accident, and an
          owner can set any of them to whatever they like, including no limit at
          all. Voice bitrate is 96&nbsp;kbps out of the box and goes to 510.
        </p>
        <p className={styles.blockNote}>
          Two ceilings are not yours. Uploads are streamed in parts, so above
          your own limit the next one belongs to the object storage &mdash;
          5&nbsp;TB per file on S3. And behind a Cloudflare Tunnel, the edge
          caps request bodies at 100&nbsp;MB on the free plans whatever your
          server is set to.
        </p>
      </Block>

      <section className={styles.tail}>
        <p className={styles.tailText}>
          Why Gryt covers the trust boundaries: what we can see and what we
          cannot. The deployment section of the docs is the full set of guides.
        </p>
        <div className={styles.tailLinks}>
          <Link to="/why-gryt">
            Why Gryt? <span aria-hidden="true">→</span>
          </Link>
          <a href={`${DOCS}/deployment`} target="_blank" rel="noreferrer">
            Deployment docs <span aria-hidden="true">→</span>
          </a>
          <a href={`${DOCS}/guide/architecture`} target="_blank" rel="noreferrer">
            Architecture <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>
    </main>
  );
}

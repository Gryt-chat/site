import { useEffect } from "react";
import { Link } from "react-router-dom";

import { Ladder, type Rung } from "../components/Ladder";
import { Block, LinkRows, type RowItem } from "../components/LinkRows";
import { PageHeader } from "../components/PageHeader";
import { Frame, StackSketch } from "../components/sketches";
import { pageTitle } from "../lib/title";
import styles from "../styles/audience.module.css";

/**
 * Which way in, and then out to the docs. Nothing here explains how anything
 * works.
 *
 * The file said that already and did the opposite: a `.env` snippet, a
 * Caddyfile, an upgrade snippet and four paragraphs about limits, each a copy
 * of a page in `host/`. One copy went stale exactly as predicted — it told
 * people to skip `.env` on a LAN because servers announce over mDNS, which the
 * docs contradict twice. `host/configuration` documents turning discovery off,
 * and `host/multi-server` says mDNS is desktop-only so the web app always needs
 * a typed address. A Compose deployment needs the address set either way.
 *
 * The ladder stays. Choosing between five ways in is a decision the docs do not
 * make for you, and it is the one thing this page is better placed to do.
 */
const DOCS = "https://docs.gryt.chat/docs";
const HELM = "https://github.com/Gryt-chat/gryt/tree/main/ops/helm/gryt";

const START: Rung[] = [
  {
    needs: "Nothing you have not already got",
    name: "From the app",
    detail: "The app you downloaded is a server too. Add Server, then Host a server.",
    href: `${DOCS}/host/from-the-app`,
  },
  {
    needs: "A terminal, on Linux or macOS",
    name: "The gryt CLI",
    detail:
      "Eight questions with sensible defaults, and it writes the Compose files for you. Needs Docker.",
    command: { label: "bash", code: "curl -fsSL https://get.gryt.chat | sh", shell: true },
    href: `${DOCS}/host/quick-start`,
  },
  {
    needs: "Windows, and Node.js 22.13",
    name: "Windows",
    detail:
      "A zip, one config file and start.bat. Node has to be 22.13 or newer for its built-in SQLite.",
    href: `${DOCS}/host/windows`,
  },
  {
    needs: "Docker, and somewhere to put it",
    name: "Docker Compose",
    detail:
      "A compose file and an .env, both grabbed with curl. What most community servers end up on.",
    command: { label: "bash", code: "docker compose up -d", shell: true },
    href: `${DOCS}/host/docker-compose`,
  },
  {
    needs: "A Kubernetes cluster",
    name: "Helm chart",
    detail: (
      <>
        <code>ops/helm/gryt</code> in the monorepo, with a README and example
        values. There&rsquo;s no published chart repo yet, so this links to the
        chart itself.
      </>
    ),
    command: { label: "bash", code: "helm install my-gryt ./ops/helm/gryt", shell: true },
    href: HELM,
    linkText: "The chart",
  },
];

const REACH: RowItem[] = [
  {
    name: "Reaching it from outside",
    detail:
      "The addresses to set, the UDP port to open, and why a reverse proxy does not cover voice.",
    href: `${DOCS}/host/docker-compose`,
  },
  {
    name: "No domain, just an IP",
    detail: "What works and what does not when there is no name pointing at the box.",
    href: `${DOCS}/host/no-domain`,
  },
  {
    name: "TLS with Caddy",
    detail: "The server speaks plain HTTP, so a domain means something in front of it.",
    href: `${DOCS}/host/docker-compose#tls-with-caddy-recommended`,
  },
  {
    name: "Cloudflare Tunnel",
    detail:
      "HTTPS and WebSockets without opening those ports. Voice still needs its own UDP port reachable.",
    href: `${DOCS}/host/cloudflare-tunnel`,
  },
  {
    name: "Tailscale",
    detail:
      "A server nobody outside your tailnet can see, which is a reasonable answer for a group of friends.",
    href: `${DOCS}/host/tailscale`,
  },
];

const RUN: RowItem[] = [
  {
    name: "Configuration",
    detail: "Every setting each service takes, and the handful that span more than one of them.",
    href: `${DOCS}/host/configuration`,
  },
  {
    name: "Roles and permissions",
    detail: "What people are allowed to do on your server, and how to decide it.",
    href: `${DOCS}/use/roles`,
  },
  {
    name: "Who can join",
    detail:
      "Whether your server takes guests, accounts, or both, and what each choice costs you.",
    href: `${DOCS}/host/identity`,
  },
  {
    name: "Custom emoji",
    detail: "Uploading them, and importing a pack from emoji.gg or BetterTTV with a link.",
    href: `${DOCS}/use/emojis`,
  },
  {
    name: "Rate limiting",
    detail: "How the server decides somebody is going too fast, and what it does about it.",
    href: `${DOCS}/host/rate-limiting`,
  },
  {
    name: "Monitoring",
    detail: "Metrics and health endpoints, for when you want to know before somebody tells you.",
    href: `${DOCS}/host/monitoring`,
  },
  {
    name: "Backups",
    detail: "What to copy, and why copying gryt.db on its own can hand you an empty database.",
    href: `${DOCS}/host/backups`,
  },
];

const TOOLS: RowItem[] = [
  {
    name: "gryt",
    mono: true,
    detail:
      "A terminal manager: create a server profile, edit its settings with validation, start and stop the deployment it writes.",
    href: `${DOCS}/host/cli`,
  },
  {
    name: "Voice debugging",
    detail:
      "The page to open when voice will not connect. Start here rather than in the server logs.",
    href: `${DOCS}/host/voice-debugging`,
  },
  {
    name: "Troubleshooting",
    detail: "Everything else that goes wrong, and what it usually turns out to be.",
    href: `${DOCS}/use/troubleshooting`,
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
        lede="Running the server yourself is the normal way to use Gryt. This page is the shortest way from wherever you are now to the guide that fits."
      />

      <Block
        heading="Getting one up"
        note="Five ways in, sorted by how much you have to know, not by which is best. Pick the first one you can already do."
      >
        <Ladder rungs={START} />
      </Block>

      <Block heading="What you are running">
        <Frame label="A Node server for accounts and messages, a Go voice server, S3-compatible storage, and an image worker. Voice is WebRTC over UDP, and it's the one part a reverse proxy or a tunnel can't carry for you.">
          <StackSketch />
        </Frame>
      </Block>

      <Block
        heading="Letting people reach it"
        note="The part that decides whether voice works for anybody who isn't sitting on your own network."
      >
        <LinkRows items={REACH} />
      </Block>

      <Block
        heading="Running it properly"
        note="The settings that start to matter once it is up and someone other than you is using it."
      >
        <LinkRows items={RUN} />
      </Block>

      <Block heading="Tools and when it breaks" items={TOOLS} />

      <section className={styles.tail}>
        <p className={styles.tailText}>
          Why Gryt covers who you&rsquo;re trusting, and with what. The hosting
          section of the docs has the full set of guides.
        </p>
        <div className={styles.tailLinks}>
          <Link to="/why-gryt">
            Why Gryt? <span aria-hidden="true">→</span>
          </Link>
          <a href={`${DOCS}/host`} target="_blank" rel="noreferrer">
            Hosting docs <span aria-hidden="true">→</span>
          </a>
          <a href={`${DOCS}/about/architecture`} target="_blank" rel="noreferrer">
            Architecture <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>
    </main>
  );
}

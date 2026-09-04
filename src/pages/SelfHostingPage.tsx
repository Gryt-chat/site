import { useEffect } from "react";
import { Link } from "react-router-dom";

import { Ladder, type Rung } from "../components/Ladder";
import { Block, LinkRows, type RowItem } from "../components/LinkRows";
import { PageHeader } from "../components/PageHeader";
import { Frame, StackSketch } from "../components/sketches";
import { Snippet } from "../components/Snippet";
import { pageTitle } from "../lib/title";
import styles from "../styles/audience.module.css";

/**
 * The how, where /why-gryt keeps the why.
 *
 * Almost every row leaves for docs.gryt.chat on purpose. A second copy of the
 * docs on this site would be a second copy to keep right, and the one that
 * went stale would be this one.
 *
 * **The Helm row goes to the directory, not to a docs page.** `ops/helm/gryt`
 * in the monorepo is real and has no docs page at all. Its README offers
 * `helm repo add gryt https://charts.gryt.chat` hedged with "if published" —
 * it is not, `charts.gryt.chat` does not resolve, so the line here installs
 * from the chart directory instead.
 */
const DOCS = "https://docs.gryt.chat/docs";
const HELM = "https://github.com/Gryt-chat/gryt/tree/main/ops/helm/gryt";

const START: Rung[] = [
  {
    needs: "Nothing you have not already got",
    name: "From the app",
    detail:
      "The app you downloaded is a server too. Add Server, then Host a server, name it, and read the address out to whoever is joining. Anyone on the same network won't even need that.",
    href: `${DOCS}/deployment/embedded`,
  },
  {
    needs: "A terminal, on Linux or macOS",
    name: "The gryt CLI",
    detail: (
      <>
        One script installs a binary. Run <code>gryt</code> and press{" "}
        <code>n</code>. It asks eight questions with sensible defaults, writes
        the Compose files, picks ports nothing else is using, and starts a
        shared voice server and object store the first time. It needs Docker to
        run what it writes, so get that first.
      </>
    ),
    command: { label: "bash", code: "curl -fsSL https://get.gryt.chat | sh", shell: true },
    href: `${DOCS}/guide/quick-start`,
  },
  {
    needs: "Windows, and Node.js 22.13",
    name: "Windows",
    detail: (
      <>
        A zip, one config file and <code>start.bat</code>. Node.js is the only
        thing you install yourself, and it has to be 22.13 or newer. The server
        uses the SQLite built into Node instead of a separate module, and 22.12
        doesn&rsquo;t have it.
      </>
    ),
    href: `${DOCS}/deployment/windows`,
  },
  {
    needs: "Docker, and somewhere to put it",
    name: "Docker Compose",
    detail:
      "A compose file and an .env, both grabbed with curl. No clone needed. Set the address people will reach you on, bring it up, and you have what most people running this for a community end up with.",
    command: { label: "bash", code: "docker compose up -d", shell: true },
    href: `${DOCS}/deployment/docker-compose`,
  },
  {
    needs: "A Kubernetes cluster",
    name: "Helm chart",
    detail: (
      <>
        <code>ops/helm/gryt</code> in the monorepo, with a README and example
        values. There&rsquo;s no published chart repo and no docs page yet, so
        this one links to the chart itself.
      </>
    ),
    command: { label: "bash", code: "helm install my-gryt ./ops/helm/gryt", shell: true },
    href: HELM,
    linkText: "The chart",
  },
];

/**
 * The four lines that decide whether voice works for anybody who is not on your
 * LAN. From `deployment/docker-compose`'s production checklist, cut to the ones
 * about being reachable.
 *
 * `ICE_UDP_MUX_PORT` defaults to 3478 and is written out anyway: the line a
 * person needs is the one they open in a firewall, and a default they cannot
 * see is one they will not open.
 */
const PUBLIC_ENV = `SFU_PUBLIC_HOST=wss://sfu.example.com
ICE_ADVERTISE_IP=203.0.113.10
ICE_UDP_MUX_PORT=3478
CORS_ORIGIN=http://127.0.0.1:15738,https://app.gryt.chat`;

/**
 * The Caddyfile from `deployment/docker-compose`, as it is written there.
 *
 * The page told people to go public and never said what terminates the TLS.
 * The server does not: `packages/server/src/index.ts` calls `createServer`
 * from `http` and has no certificate of its own, so every deployment with a
 * domain on it has something in front, and the docs' answer is Caddy.
 *
 * Four lines rather than the compose service that runs it, because the compose
 * service is boilerplate and these are the two decisions in it: which name
 * goes to which of the two services people have to reach.
 */
const CADDYFILE = `api.example.com {
    reverse_proxy server:5000
}

sfu.example.com {
    reverse_proxy sfu:5005
}`;

/**
 * Upgrading, which is the same two lines as installing.
 *
 * Worth the four lines of page it takes because the docs' warning is easy to
 * miss and expensive: a beta build may change the SQLite schema on start, and
 * there is no down-migration.
 */
const UPGRADE = `docker compose pull
docker compose up -d`;

const REACH: RowItem[] = [
  {
    name: "No domain, just an IP",
    detail: "What works and what does not when there is no name pointing at the box.",
    href: `${DOCS}/deployment/no-domain`,
  },
  {
    name: "TLS with Caddy",
    detail: "The compose service that runs the proxy above, and where the certificates come from.",
    href: `${DOCS}/deployment/docker-compose#tls-with-caddy-recommended`,
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
  {
    name: "Backups",
    detail: "What to copy, and why copying gryt.db on its own can hand you an empty database.",
    href: `${DOCS}/deployment/backups`,
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
        lede="Running the server yourself is the normal way to use Gryt. This page is the shortest way from wherever you are now to a server that works."
      />

      <Block
        heading="Getting one up"
        note="Five ways in, sorted by how much you have to know, not by which is best. Pick the first one you can already do. The first needs nothing but the app you downloaded. The last one is a Helm chart."
      >
        <Ladder rungs={START} />
      </Block>

      <Block heading="What you are running">
        <p className={styles.blockNote}>
          Four things. A Node server for accounts, channels, messages and
          uploads. A voice server written in Go that moves the audio and video
          around. Somewhere to put files, which is any S3-compatible storage.
          And a small worker that resizes images. On one machine that&rsquo;s
          one <code>docker compose up</code>. The desktop app already has the
          first three inside it, which is why hosting from the app needs no
          terminal.
        </p>
        <Frame label="Voice is WebRTC over UDP, and it's the one part a reverse proxy or a tunnel can't carry for you. One port, not a range. 3478 unless you change it, and it has to be reachable directly.">
          <StackSketch />
        </Frame>
      </Block>

      <Block heading="Reaching it from outside">
        <p className={styles.blockNote}>
          Skip all of this if the server is only for people on your own
          network. Gryt servers announce themselves over mDNS, so on a LAN
          nobody types an address.
        </p>
        <p className={styles.blockNote}>
          Going public is four lines in <code>.env</code>. Getting them wrong
          is the usual reason voice works on the LAN and for nobody else. The
          UDP port has to be open as UDP. A reverse proxy in front of the server
          doesn&rsquo;t cover it.
        </p>
        <Snippet label=".env" code={PUBLIC_ENV} />
        <p className={styles.blockNote}>
          The server doesn&rsquo;t do TLS. It speaks plain HTTP and has no
          certificate of its own, so a domain means something in front of it.
          Caddy is the usual answer. It gets the certificates and renews them
          without being asked, and the config is two names pointed at two
          services.
        </p>
        <Snippet label="Caddyfile" code={CADDYFILE} />
        <p className={styles.blockNote}>
          <code>server</code> and <code>sfu</code> are the compose service
          names, so it works from a Caddy container in the same file. The
          second name has to be the one in{" "}
          <code>SFU_PUBLIC_HOST</code>. And Caddy serves HTTP/3 on UDP 443 by
          default, which is one more reason not to put voice on 443.
        </p>
        <LinkRows items={REACH} />
      </Block>

      <Block
        heading="Running it properly"
        note="The settings that start to matter once it is up and someone other than you is using it. Upgrading is the same two lines as installing, and pinning a version instead of following latest is what keeps it predictable."
      >
        <Snippet label="bash" code={UPGRADE} shell />
        <p className={styles.blockNote}>
          Back up the server data directory first if you&rsquo;re moving to a
          beta. A beta build can change the SQLite schema when it starts, and
          there&rsquo;s no way back down. Going back means restoring that copy.
        </p>
        <p className={styles.blockNote}>
          And read{" "}
          <a href={`${DOCS}/deployment/backups`} target="_blank" rel="noreferrer">
            how to take one
          </a>{" "}
          first. The database runs in WAL mode, so copying <code>gryt.db</code>{" "}
          on its own while the server is running can hand you an empty database,
          and nothing says so until the day you restore it.
        </p>
        <LinkRows items={RUN} />
      </Block>

      <Block
        heading="Tools and when it breaks"
        items={TOOLS}
      />

      <Block heading="What a server decides">
        <p className={styles.blockNote}>
          Almost every limit in Gryt belongs to whoever runs the server, and
          there&rsquo;s no tier above them that raises it. Uploads, avatars and
          emoji all start at 100&nbsp;MB so nobody fills a disk by accident, and
          an owner can set any of them to whatever they want, including no limit
          at all. Voice starts at 96&nbsp;kbps and goes to 510.
        </p>
        <p className={styles.blockNote}>
          Two limits aren&rsquo;t yours to set. Uploads go up in parts, so past
          your own limit the next one belongs to the storage. On S3 that&rsquo;s
          5&nbsp;TB a file. And behind a Cloudflare Tunnel, the free plans cap
          uploads at 100&nbsp;MB whatever your server says.
        </p>
      </Block>

      <section className={styles.tail}>
        <p className={styles.tailText}>
          Why Gryt covers who you&rsquo;re trusting, and with what. The
          deployment section of the docs has the full set of guides.
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

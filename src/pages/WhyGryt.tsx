import { Link } from "react-router-dom";

import { Architecture } from "../components/Architecture";
import { Mermaid } from "../components/Mermaid";
import { Philosophy } from "../components/Philosophy";
import styles from "./WhyGryt.module.css";

const DOCS_WHY_GRYT_URL = "https://docs.gryt.chat/docs/guide/why-gryt";
const DOCS_ARCH_URL = "https://docs.gryt.chat/docs/guide/architecture";

export function WhyGryt() {
  return (
    <>
      <main className={styles.page}>
        <header className={styles.header}>
          <h1 className={styles.title}>Why Gryt?</h1>
          <p className={styles.subtitle}>
            A plain-language overview of the philosophy, trust boundaries, and
            architecture behind Gryt.
          </p>
        </header>

        <div className={styles.prose}>
          <p>
            Gryt is a self-hosted voice chat platform with text chat and file
            sharing. It is built to be usable day-to-day, but also easy to
            understand and verify.
          </p>

          <h2>What Gryt is (and is not)</h2>
          <ul>
            <li>
              <strong>It is self-hostable.</strong> You can run the server and
              keep your community’s data on infrastructure you control.
            </li>
            <li>
              <strong>It is open source.</strong> You can audit how it works,
              build your own fork, and contribute improvements.
            </li>
            <li>
              <strong>It is not a “growth platform”.</strong> Gryt is not built
              around ads, tracking, or engagement mechanics.
            </li>
          </ul>

          <h2>Minimal identity, not a social graph</h2>
          <p>
            Many chat platforms tie communication to a centralized profile and a
            long-lived social graph. Gryt keeps identity and server data
            separated on purpose.
          </p>
          <ul>
            <li>
              <strong>Servers don’t store your password.</strong> When auth is
              enabled, servers verify signed login tokens. They never need to
              handle your credentials.
            </li>
            <li>
              <strong>Servers store server data.</strong> Messages, roles,
              membership, and uploads live on the server you connect to (or the
              one you host).
            </li>
            <li>
              <strong>The client stores local session state.</strong> Your
              device keeps the tokens and preferences needed to stay signed in
              and preserve settings.
            </li>
          </ul>
          <p>
            If you use the hosted web client at <code>app.gryt.chat</code>, you
            can also read our{" "}
            <Link to="/privacy">Privacy Policy</Link>.
          </p>

          <h2>Trust boundaries (what you’re trusting)</h2>
          <p>
            Skepticism is healthy. Here are the boundaries in plain terms:
          </p>
          <ul>
            <li>
              <strong>Server operators:</strong> if you join someone else’s
              server, they can access the data their server stores (messages,
              uploads, and logs). If you self-host, that operator is you.
            </li>
            <li>
              <strong>Voice transport:</strong> WebRTC encrypts media in transit
              (DTLS-SRTP). Voice is routed through an SFU for fan-out; the SFU
              is part of the transport path and is operated by the server owner.
            </li>
            <li>
              <strong>Hosted identity (default):</strong> by default, login
              happens via the hosted auth provider at <code>auth.gryt.chat</code>.
              A separate Identity Service at <code>id.gryt.chat</code> issues
              signed certificates that servers can verify cryptographically (JWKS).
            </li>
          </ul>

          <h2>Architecture in one diagram</h2>
          <Mermaid
            chart={`
graph TB
  user[User] --> client[Client]
  client -->|WSS_signaling| server[Signaling_server]
  client -->|UDP_media| sfu[SFU]
  server --> db[Database]
  server --> s3[Object_storage]
  client -->|OIDC_login| auth[Identity_provider]
  client -->|Certificate| identity[Identity_service]
  server -->|JWKS_verify| identity
`}
          />
          <p>
            The server coordinates rooms, chat, and uploads. The SFU routes
            voice media. Storage and persistence are kept separate so you can
            run everything on your own infrastructure.
          </p>

          <h2>Common questions</h2>

          <h3>Can a server admin read my messages?</h3>
          <p>
            If the server stores the messages, the server operator can access
            them. That’s true for Gryt and any self-hosted chat system. The
            point is that you can choose who operates the server.
          </p>

          <h3>Can I run this for a private group?</h3>
          <p>
            Yes. Most people run a single Gryt server for a community, team, or
            friend group. Deployment is designed to be straightforward, and the
            architecture is documented.
          </p>

          <h3>Where should I go for the detailed version?</h3>
          <p>
            The docs go deeper, including a full architecture overview:
            <br />
            <a href={DOCS_WHY_GRYT_URL} target="_blank" rel="noreferrer">
              Why Gryt (docs)
            </a>
            <br />
            <a href={DOCS_ARCH_URL} target="_blank" rel="noreferrer">
              Architecture (docs)
            </a>
          </p>
        </div>
      </main>

      <Philosophy />
      <Architecture />
    </>
  );
}


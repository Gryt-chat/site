import { Link } from "react-router-dom";

import { Mermaid } from "../components/Mermaid";
import { PageHeader } from "../components/PageHeader";
import styles from "./WhyGryt.module.css";

const DOCS_WHY_GRYT_URL = "https://docs.gryt.chat/docs/guide/why-gryt";
const DOCS_ARCH_URL = "https://docs.gryt.chat/docs/guide/architecture";

/**
 * The three claims the page opens on. Rule-topped items rather than bullets,
 * the same shape the front page's Edge section uses, because the third one is a
 * negative and a bullet list flattens it into the other two.
 */
const WHAT_IT_IS = [
  {
    t: "It is self-hostable",
    d: "You can run the server and keep your community's data on infrastructure you control.",
  },
  {
    t: "It is open source",
    d: "You can audit how it works, build your own fork, and contribute improvements.",
  },
  {
    t: "It is not a growth platform",
    d: "Gryt is not built around ads, tracking, or engagement mechanics.",
  },
];

const IDENTITY = [
  {
    t: "Servers don't store your password",
    d: "When auth is enabled, servers verify signed login tokens. They never need to handle your credentials.",
  },
  {
    t: "Servers store server data",
    d: "Messages, roles, membership, and uploads live on the server you connect to, or the one you host.",
  },
  {
    t: "The client stores local session state",
    d: "Your device keeps the tokens and preferences needed to stay signed in and preserve settings.",
  },
];

const TRUST = [
  {
    t: "Server operators",
    d: "If you join someone else's server, they can access the data their server stores: messages, uploads, and logs. If you self-host, that operator is you.",
  },
  {
    t: "Voice transport",
    d: "WebRTC encrypts media in transit with DTLS-SRTP. Voice is routed through an SFU for fan-out. The SFU is part of the transport path and is operated by the server owner.",
  },
  {
    t: "Hosted identity, by default",
    d: "Login happens via the hosted auth provider at auth.gryt.chat. A separate Identity Service at id.gryt.chat issues signed certificates that servers verify cryptographically over JWKS.",
  },
];

const QUESTIONS = [
  {
    q: "Can a server admin read my messages?",
    a: "If the server stores the messages, the server operator can access them. That is true for Gryt and for any self-hosted chat system. The point is that you can choose who operates the server.",
  },
  {
    q: "Can I run this for a private group?",
    a: "Yes. Most people run a single Gryt server for a community, team, or friend group. Deployment is one command on Linux, and the architecture is documented.",
  },
];

export function WhyGryt() {
  return (
    <main className={styles.page}>
      <PageHeader
        eyebrow="Why Gryt"
        title="Why Gryt?"
        lede="A plain-language overview of the philosophy, trust boundaries, and architecture behind Gryt. You can use it day-to-day, and you can check how it works."
      />

      <section className={styles.section}>
        <h2 className={styles.heading}>What Gryt is, and is not</h2>
        <div className={styles.claims}>
          {WHAT_IT_IS.map((c) => (
            <div key={c.t} className={styles.claim}>
              <h3>{c.t}</h3>
              <p>{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>Minimal identity, not a social graph</h2>
        <p className={styles.lede}>
          Many chat platforms tie communication to a centralised profile and a
          long-lived social graph. Gryt keeps identity and server data separated
          on purpose.
        </p>
        <div className={styles.claims}>
          {IDENTITY.map((c) => (
            <div key={c.t} className={styles.claim}>
              <h3>{c.t}</h3>
              <p>{c.d}</p>
            </div>
          ))}
        </div>
        <p className={styles.note}>
          If you use the hosted web client at <code>app.gryt.chat</code>, you can
          also read our <Link to="/privacy">Privacy Policy</Link>.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>What you are trusting</h2>
        <p className={styles.lede}>
          Skepticism is healthy. Here are the boundaries in plain terms.
        </p>
        <div className={styles.trust}>
          {TRUST.map((c) => (
            <div key={c.t} className={styles.trustItem}>
              <h3>{c.t}</h3>
              <p>{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>Architecture in one diagram</h2>
        <div className={styles.diagram}>
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
        </div>
        <p className={styles.note}>
          The server coordinates rooms, chat, and uploads. The SFU routes voice
          media. Storage and persistence are kept separate so you can run
          everything on your own infrastructure.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>Common questions</h2>
        <div className={styles.questions}>
          {QUESTIONS.map((c) => (
            <div key={c.q} className={styles.question}>
              <h3>{c.q}</h3>
              <p>{c.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.tail}>
        <h2 className={styles.tailHeading}>The detailed version</h2>
        <p className={styles.lede}>
          The docs go deeper, including a full architecture overview.
        </p>
        <ul className={styles.links}>
          <li>
            <a href={DOCS_WHY_GRYT_URL} target="_blank" rel="noreferrer">
              Why Gryt
              <span aria-hidden="true">→</span>
            </a>
          </li>
          <li>
            <a href={DOCS_ARCH_URL} target="_blank" rel="noreferrer">
              Architecture
              <span aria-hidden="true">→</span>
            </a>
          </li>
        </ul>
      </section>
    </main>
  );
}

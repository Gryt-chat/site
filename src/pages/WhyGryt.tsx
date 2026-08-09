import { Link } from "react-router-dom";
import type { ReactNode } from "react";

import { Mermaid } from "../components/Mermaid";
import styles from "./WhyGryt.module.css";

const DOCS_WHY_GRYT_URL = "https://docs.gryt.chat/docs/guide/why-gryt";
const DOCS_ARCH_URL = "https://docs.gryt.chat/docs/guide/architecture";

const ARCHITECTURE = `
graph TB
  user[User] --> client[Client]
  client -->|WSS_signaling| server[Signaling_server]
  client -->|UDP_media| sfu[SFU]
  server --> db[Database]
  server --> s3[Object_storage]
  client -->|OIDC_login| auth[Identity_provider]
  client -->|Certificate| identity[Identity_service]
  server -->|JWKS_verify| identity
`;

function Answer({ q, children }: { q: string; children: ReactNode }) {
  return (
    <section className={styles.qa}>
      <h2 className={styles.q}>{q}</h2>
      <div className={styles.a}>{children}</div>
    </section>
  );
}

export function WhyGryt() {
  return (
    <main className={styles.page}>
      <header className={styles.head}>
        <h1 className={styles.title}>Why Gryt?</h1>
        <p className={styles.sub}>
          The questions people actually ask before they trust a chat platform,
          answered without marketing. If one of these answers is unflattering,
          it is still the answer.
        </p>
      </header>

      <Answer q="What is Gryt, and what is it not?">
        <p>
          A self-hosted voice chat platform with text chat and file sharing. You
          can run the server yourself and keep your community&rsquo;s data on
          infrastructure you control, and you can audit how it works, fork it,
          or contribute to it.
        </p>
        <p>
          It is not a growth platform. There are no ads, no tracking, and no
          engagement mechanics, which also means there is nobody selling it to
          you but the people who use it.
        </p>
      </Answer>

      <Answer q="Do I need a profile and a social graph?">
        <p>
          No. Most chat platforms tie communication to a centralised profile and
          a long-lived social graph. Gryt keeps identity and server data
          separate on purpose.
        </p>
        <p>
          Servers never store your password: with auth enabled they verify
          signed login tokens and never handle your credentials. What they do
          store is server data, meaning messages, roles, membership and uploads
          for the server you are on. Your own device keeps the tokens and
          preferences that let you stay signed in.
        </p>
        <p>
          If you use the hosted web client at <code>app.gryt.chat</code>, the{" "}
          <Link to="/privacy">Privacy Policy</Link> covers what we hold.
        </p>
      </Answer>

      <Answer q="What am I actually trusting?">
        <p>
          Three things, and it is worth being precise about which is which.
        </p>
        <p>
          <strong>The server operator.</strong> If you join someone
          else&rsquo;s server, they can reach the data their server stores:
          messages, uploads and logs. If you self-host, that operator is you.
        </p>
        <p>
          <strong>The transport.</strong> WebRTC encrypts media in transit with
          DTLS-SRTP. Voice is routed through an SFU for fan-out, so the SFU is
          on the path, and it is run by the server owner.
        </p>
        <p>
          <strong>Identity, by default ours.</strong> Login goes through the
          hosted provider at <code>auth.gryt.chat</code>, and a separate
          Identity Service at <code>id.gryt.chat</code> issues signed
          certificates that servers verify over JWKS. Both are in the repo and
          both are self-hostable if you would rather not trust us with it.
        </p>
      </Answer>

      <Answer q="How does it fit together?">
        <p>
          The server coordinates rooms, chat and uploads. The SFU routes voice
          media. Storage and persistence are kept separate so all of it can run
          on your own infrastructure.
        </p>
        <div className={styles.diagram}>
          <Mermaid chart={ARCHITECTURE} />
        </div>
      </Answer>

      <Answer q="Can a server admin read my messages?">
        <p>
          If the server stores them, yes. That is true of Gryt and of every
          other self-hosted chat system, and anyone telling you otherwise about
          their own is worth a second look. What changes is that you get to pick
          the operator, or be the operator.
        </p>
      </Answer>

      <Answer q="Can I run this for a private group?">
        <p>
          Yes, and that is the common case. Most people run one Gryt server for
          a community, a team, or a group of friends. Deployment is a single
          command on Linux and the architecture is documented rather than
          implied.
        </p>
      </Answer>

      <section className={styles.tail}>
        <p className={styles.tailText}>
          The docs go further than this page does, including a full
          architecture overview.
        </p>
        <div className={styles.links}>
          <a href={DOCS_WHY_GRYT_URL} target="_blank" rel="noreferrer">
            Why Gryt in the docs
            <span aria-hidden="true">→</span>
          </a>
          <a href={DOCS_ARCH_URL} target="_blank" rel="noreferrer">
            Architecture
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>
    </main>
  );
}

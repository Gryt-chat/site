import { Link } from "react-router-dom";
import type { ReactNode } from "react";

import { Mermaid } from "../components/Mermaid";
import styles from "./WhyGryt.module.css";

const DOCS_WHY_GRYT_URL = "https://docs.gryt.chat/docs/guide/why-gryt";
const DOCS_ARCH_URL = "https://docs.gryt.chat/docs/guide/architecture";
const DOCS_ACCOUNTS_URL = "https://docs.gryt.chat/docs/guide/accounts";
const DOCS_EMBEDDED_URL = "https://docs.gryt.chat/docs/deployment/embedded";

/**
 * Identity hangs off the side because it is optional.
 *
 * The old diagram drew the login and the certificate as ordinary edges
 * alongside the ones carrying voice and messages, which read as four things you
 * need to have working. A guest never touches either.
 */
const ARCHITECTURE = `
graph TB
  user[User] --> client[Client]
  client -->|WSS_signaling| server[Signaling_server]
  client -->|UDP_media| sfu[SFU]
  server --> db[Database]
  server --> s3[Object_storage]
  client -.->|Optional_sign_in| auth[Identity_provider]
  client -.->|Optional_certificate| identity[Identity_service]
  server -.->|JWKS_verify| identity
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
          A self-hosted voice chat platform with text chat and file sharing.
          Running the server yourself is the normal way to use it, not a
          fallback for people who distrust the hosted one. Your
          community&rsquo;s data sits on infrastructure you control, and you can
          audit how it works, fork it, or contribute to it.
        </p>
        <p>
          It is not a growth platform. There are no ads, no tracking, and no
          engagement mechanics, which also means there is nobody selling it to
          you but the people who use it.
        </p>
      </Answer>

      <Answer q="Do I need an account?">
        <p>
          No. Download Gryt and you already have an identity: a keypair your
          device generates and never sends anywhere. You do not sign up for
          anything, and there is nothing in it we could tie to a person.
        </p>
        <p>
          That is not a limited mode. A guest identity signs the same challenge
          an account does and can own a server, with the same roles. Your client
          makes a separate key for each server you join, so two servers cannot
          work out that they are talking to the same person.
        </p>
        <p>
          An account buys you things a guest identity cannot. It is the same you
          on every Gryt server, so people recognise you somewhere new, and it
          survives losing the device.
        </p>
        <p>
          It also makes a ban mean more. Guests can be banned, but a guest who
          wants back in generates a new keypair in about two seconds, so servers
          accepting them lean on the door instead: invites, approval, LAN only.
          That is a real trade, and it is the one to understand before turning
          guests on. The rest of it is in the{" "}
          <a href={DOCS_ACCOUNTS_URL} target="_blank" rel="noreferrer">
            docs
          </a>
          .
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
          messages, uploads and logs. If you host it yourself, that operator is
          you.
        </p>
        <p>
          <strong>The transport.</strong> WebRTC encrypts media in transit with
          DTLS-SRTP. Voice is routed through an SFU for fan-out, so the SFU is
          on the path, and it is run by the server owner.
        </p>
        <p>
          <strong>Us, only if you ask.</strong> A guest identity involves
          nothing of ours: the certificate is signed by the key it describes,
          and no server contacts us to check it. Sign in and that changes.
          Login goes through the hosted provider at <code>auth.gryt.chat</code>,
          and a separate Identity Service at <code>id.gryt.chat</code> issues
          the certificates servers verify over JWKS. Both are in the repo and
          both are self-hostable.
        </p>
      </Answer>

      <Answer q="Where does the server run?">
        <p>
          Wherever you put it. The desktop app has a full server inside it, so
          you can host one without a terminal, and it will run several at once.
          They share a media server, which is what makes the second one cost a
          process rather than a stack.
        </p>
        <p>
          On a machine that should stay up when your laptop closes, the same
          server runs under Docker Compose, Helm, or behind a Cloudflare Tunnel
          if you would rather not open a port. On a LAN, servers announce
          themselves and turn up in the client without anyone typing an address.
        </p>
        <p>
          <a href={DOCS_EMBEDDED_URL} target="_blank" rel="noreferrer">
            Hosting from the app
          </a>{" "}
          covers the first case.
        </p>
      </Answer>

      <Answer q="How does it fit together?">
        <p>
          The server coordinates rooms, chat and uploads. The SFU routes voice
          media. Storage and persistence are kept separate so all of it can run
          on your own infrastructure. The dotted paths are the ones a guest
          never uses.
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
          a community, a team, or a group of friends. Starting one from the
          desktop app takes a name and a button, and a server that should
          outlive the session is a single command on Linux. The architecture is
          documented rather than implied.
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

import { Link } from "react-router-dom";
import type { ReactNode } from "react";

import { ArchitectureSketch, Frame } from "../components/sketches";
import styles from "./WhyGryt.module.css";

const DOCS_WHY_GRYT_URL = "https://docs.gryt.chat/docs/guide/why-gryt";
const DOCS_ARCH_URL = "https://docs.gryt.chat/docs/guide/architecture";
const DOCS_ACCOUNTS_URL = "https://docs.gryt.chat/docs/guide/accounts";
const DOCS_TUNNEL_URL =
  "https://docs.gryt.chat/docs/deployment/cloudflare-tunnel";

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
          The questions people actually ask before they trust a chat app. Some
          of the answers aren't flattering. They're still the answers.
        </p>
      </header>

      <Answer q="What is Gryt, and what is it not?">
        <p>
          Voice, video and text chat, with screen sharing and file sharing,
          that you run yourself. That&rsquo;s the normal way to use Gryt. It
          isn&rsquo;t a fallback for people who don&rsquo;t trust the hosted
          one. Your community&rsquo;s stuff sits on machines you control, and
          you can read the code, fork it, or send a change back.
        </p>
        <p>
          It isn&rsquo;t trying to grow. No ads, no tracking, nothing built to
          keep you scrolling. Which also means nobody is selling it to you
          except the people already using it.
        </p>
      </Answer>

      <Answer q="Do I need an account?">
        <p>
          No. Download Gryt and you already have one. Your device makes a
          keypair and never sends it anywhere. You don&rsquo;t sign up for
          anything, and there&rsquo;s nothing in it we could trace back to
          you.
        </p>
        <p>
          And that isn&rsquo;t a cut-down mode. A guest signs the same
          challenge an account does, and can own a server with the same roles.
          Your app makes a separate key for every server you join, so two
          servers can&rsquo;t work out they&rsquo;re talking to the same
          person.
        </p>
        <p>
          An account does get you two things a guest doesn&rsquo;t. You&rsquo;re
          the same person on every Gryt server, so people recognise you
          somewhere new. And you don&rsquo;t lose it with your device.
        </p>
        <p>
          It also makes a ban stick. You can ban a guest, but a guest who wants
          back in makes a new keypair in about two seconds. So servers that take
          guests lean on the door instead: invites, approval, or LAN only.
          That&rsquo;s a real trade-off, and it&rsquo;s the one to understand
          before you turn guests on. The rest is in the{" "}
          <a href={DOCS_ACCOUNTS_URL} target="_blank" rel="noreferrer">
            docs
          </a>
          .
        </p>
        <p>
          If you use the hosted web client at <code>app.gryt.chat</code>,
          the{" "}
          <Link to="/privacy">Privacy Policy</Link> covers what we hold.
        </p>
      </Answer>

      <Answer q="What am I actually trusting?">
        <p>
          Three things, and they&rsquo;re not the same.
        </p>
        <p>
          <strong>Whoever runs the server.</strong> If you join someone
          else&rsquo;s server, they can get at what it stores. Messages,
          uploads, logs. If you host it yourself, that&rsquo;s you.
        </p>
        <p>
          <strong>The connection.</strong> WebRTC encrypts the audio and video
          on the way with DTLS-SRTP. Voice goes through an SFU so it can reach
          everyone at once, so the SFU is on the path too. The server owner runs
          that as well.
        </p>
        <p>
          <strong>Us, and only if you ask.</strong> A guest identity
          doesn&rsquo;t touch anything of ours. The certificate is signed by the
          key it describes, and no server calls us to check it. Signing in
          changes that. Login goes through <code>auth.gryt.chat</code>, and a
          separate identity service at <code>id.gryt.chat</code> hands out the
          certificates servers check. Both are in the repo, and you can run both
          yourself.
        </p>
      </Answer>

      <Answer q="Where does the server run?">
        <p>
          Wherever you put it. The desktop app has a whole server inside it,
          so you can host one without touching a terminal. The same server runs
          under Docker Compose or Helm when you want it on a machine that stays
          on.
        </p>
        <p>
          Getting to it from outside your own network means opening a port
          either way. A{" "}
          <a href={DOCS_TUNNEL_URL} target="_blank" rel="noreferrer">
            Cloudflare Tunnel
          </a>{" "}
          handles the HTTPS and WebSocket side without opening those. But voice
          is WebRTC over UDP, and a tunnel can&rsquo;t carry that. It&rsquo;s
          one port, not a range, and it has to be reachable directly.
        </p>
        <p>
          <Link to="/self-hosting">Self-hosting</Link> has the how, in more
          detail than this page should get into.
        </p>
      </Answer>

      <Answer q="How does it fit together?">
        <p>
          The server handles rooms, chat and uploads. The SFU moves the voice
          and video around. Storage and the database are their own pieces, so
          you can run the lot on your own machines. The dotted lines are the
          ones a guest never uses.
        </p>
        <div className={styles.diagram}>
          <Frame label="Voice goes straight from the client to the voice server, over UDP. Nothing in between carries it, and that's the one a tunnel can't do for you.">
            <ArchitectureSketch />
          </Frame>
        </div>
      </Answer>

      <Answer q="Can a server admin read my messages?">
        <p>
          If the server stores them, yes. That&rsquo;s true of Gryt and every
          other self-hosted chat system, and anyone claiming otherwise about
          theirs is worth a second look. The difference is you get to pick who
          runs it. Or run it yourself.
        </p>
      </Answer>

      <Answer q="Can I run this for a private group?">
        <p>
          Yes, and that&rsquo;s what most people do. One server for a
          community, a team, or a group of friends. Starting one from the
          desktop app takes a name and a button. One that should still be there
          tomorrow is a single command on Linux. On a shared network, servers
          announce themselves and show up in the app without anyone typing an
          address.
        </p>
      </Answer>

      <section className={styles.tail}>
        <p className={styles.tailText}>
          The docs go further than this page does, including the full
          architecture.
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

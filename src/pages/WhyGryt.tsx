import { Link } from "react-router-dom";
import type { ReactNode } from "react";

import { ArchitectureSketch, Frame } from "../components/sketches";
import styles from "./WhyGryt.module.css";

const DOCS_WHY_GRYT_URL = "https://docs.gryt.chat/docs/about/why-gryt";
const DOCS_ARCH_URL = "https://docs.gryt.chat/docs/about/architecture";
const DOCS_ACCOUNTS_URL = "https://docs.gryt.chat/docs/use/accounts";
const DOCS_TUNNEL_URL =
  "https://docs.gryt.chat/docs/host/cloudflare-tunnel";

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
          The questions people ask before they trust a chat app, with honest
          answers, including the ones that don&rsquo;t make us look good.
        </p>
      </header>

      <Answer q="What is Gryt, and what is it not?">
        <p>
          An app for voice, video and text chat, with screen sharing and file
          sharing. It&rsquo;s a lot like Discord, except that every community
          runs on its own server. You can run a server yourself, on your own
          computer or a machine you rent, or join one somebody else runs.
          We run one too, if you just want to try it.
        </p>
        <p>
          Your community&rsquo;s messages and files live on its server. The
          code is open, so you can read it, change it, or send a change back.
        </p>
        <p>
          We aren&rsquo;t chasing growth. There are no ads, no tracking, and
          nothing built to keep you scrolling. There&rsquo;s no sales pitch
          either, so you&rsquo;ll mostly hear about Gryt from people who already
          use it.
        </p>
      </Answer>

      <Answer q="Do I need an account?">
        <p>
          No. Download Gryt and you can join as a guest. Your device makes its
          own key and never sends it anywhere. You don&rsquo;t sign up for
          anything, and there&rsquo;s nothing in it we could trace back to
          you.
        </p>
        <p>
          Guests get the full app. A guest proves who they are the same way an
          account does, and can own a server with the same roles.
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
          back in can make a new key in about two seconds. So servers that allow
          guests control who gets in instead, with invites, approval, or by only
          letting in people on the same local network. Keep that in mind before
          you turn guests on. The rest is in the{" "}
          <a href={DOCS_ACCOUNTS_URL} target="_blank" rel="noreferrer">
            docs
          </a>
          .
        </p>
        <p>
          If you use Gryt in your browser at <code>app.gryt.chat</code>, the{" "}
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
          <strong>The connection.</strong> Audio and video are encrypted on
          the way (WebRTC does this with DTLS-SRTP). Voice goes through a voice
          server, called an SFU, so it can reach everyone at once. That puts the
          SFU on the path too, and the server owner runs that as well.
        </p>
        <p>
          <strong>Us, but only if you sign in.</strong> As a guest, you
          don&rsquo;t use anything of ours. Your identity is signed by your own
          key, and no server calls us to check it. Signing in changes that.
          Login goes through <code>auth.gryt.chat</code>, and a separate
          service at <code>id.gryt.chat</code> gives you the certificate that
          servers check. Both are open source, and you can run both yourself.
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
          If people need to join from outside your own network, you&rsquo;ll
          have to open a port, whichever way you run it. A{" "}
          <a href={DOCS_TUNNEL_URL} target="_blank" rel="noreferrer">
            Cloudflare Tunnel
          </a>{" "}
          can carry the chat side without opening anything. But voice runs over
          UDP, and a tunnel can&rsquo;t carry that. So voice needs one port, not
          a range, and it has to be reachable directly.
        </p>
        <p>
          <Link to="/self-hosting">Self-hosting</Link> has the how, in more
          detail than this page should get into.
        </p>
      </Answer>

      <Answer q="How does it fit together?">
        <p>
          The server handles rooms, chat and uploads. The SFU passes voice and
          video between people. Storage and the database are separate pieces,
          and you can run all of it on your own machines. A guest never uses the
          dotted lines.
        </p>
        <div className={styles.diagram}>
          <Frame label="Voice goes straight from the client to the voice server, over UDP. Nothing in between carries it, and that's the one a tunnel can't do for you.">
            <ArchitectureSketch />
          </Frame>
        </div>
      </Answer>

      <Answer q="Can a server admin read my messages?">
        <p>
          In a channel, yes. The server stores channel messages as they are, so
          whoever runs it can read them. The difference is you get to pick who
          runs it. Or run it yourself.
        </p>
        <p>
          Direct messages and group chats are encrypted on your device, files
          included, so the server can&rsquo;t read them. It can still see who
          you talk to and when. A message can go out unencrypted if someone
          hasn&rsquo;t got a usable key yet, and the app marks it with a red dot.
          Older messages from before encryption may still be readable too.
        </p>
      </Answer>

      <Answer q="Can I run this for a private group?">
        <p>
          Yes, and that&rsquo;s what most people do: one server for a community,
          a team, or a group of friends. Starting one from the desktop app takes
          a name and a button. If it needs to stay up when your computer&rsquo;s
          off, it&rsquo;s a single command on Linux. On a shared network, servers
          show up in the app without anyone typing an address.
        </p>
      </Answer>

      <section className={styles.tail}>
        <p className={styles.tailText}>
          The docs go further than this page does, including the full
          architecture.
        </p>
        <div className={styles.links}>
          <Link to="/compare">
            Gryt next to Discord and TeamSpeak
            <span aria-hidden="true">→</span>
          </Link>
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

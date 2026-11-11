import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";

import styles from "./CloudPage.module.css";

const WAITLIST = "https://reports.gryt.chat/v1/waitlist";

const BENEFITS = [
  ["Always online", "It runs on our machines. Turn your computer off and everyone can still talk."],
  ["Nothing to set up", "No ports to open, no router settings, no Docker. Pick a name and it's there."],
  ["Updates handled", "New Gryt releases go on for you, so the server is never the old one."],
  ["Notifications on phones", "Mentions and calls reach iPhone and Android, the same as on any Gryt server."],
  ["Your own address", "Use ours, or your own domain like chat.yourdomain.com. Invites use it too."],
  ["Help from the people who build it", "Something wrong? You write to us, and we're the ones who fix it."],
];

const COMPANY: [string, string, boolean][] = [
  ["Priority support", "Your reports go to the front of the queue, and you can reach us directly.", false],
  ["Company sign-in", "Employees sign in with the account they already have, and directory groups become roles.", true],
  ["Meetings with a link", "Send a link. Customers join in the browser with just a name and only see the call.", true],
  ["Guests", "Invite customers into one channel without giving them the rest of the company.", true],
];

const MAIL = "mailto:business@gryt.chat";

const STEPS = [
  "Pick a name and the region closest to your friends.",
  "Pay in the Gryt console with your Gryt account. Monthly or yearly.",
  "The server shows up in Gryt, already joined. Send your friends the invite.",
];

type State = "idle" | "sending" | "done" | "bad" | "failed";

function Signup() {
  const [email, setEmail] = useState("");
  const [news, setNews] = useState(false);
  const [state, setState] = useState<State>("idle");

  async function submit(e: FormEvent) {
    e.preventDefault();
    setState("sending");
    try {
      const res = await fetch(WAITLIST, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, news }),
      });
      setState(res.ok ? "done" : res.status === 400 ? "bad" : "failed");
    } catch {
      setState("failed");
    }
  }

  if (state === "done") {
    return (
      <div className={styles.signup} role="status">
        <p className={styles.h3}>You&rsquo;re on the list!</p>
        <p className={styles.text}>
          You&rsquo;ll be the first to know when Gryt Cloud is live, and you&rsquo;ll get 50% off your first year. Check
          your inbox for the email.
        </p>
      </div>
    );
  }

  return (
    <form className={styles.signup} onSubmit={(e) => void submit(e)}>
      <span className={styles.offer}>
        <b>50% off</b> your first year if you&rsquo;re on the list
      </span>
      <div className={styles.row}>
        <input
          className={styles.field}
          type="email"
          required
          autoComplete="email"
          aria-label="Your email address"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className={styles.primary} type="submit" disabled={state === "sending"}>
          {state === "sending" ? "Adding you…" : "Tell me when it opens"}
        </button>
      </div>
      {state === "bad" && <p className={styles.error}>That doesn&rsquo;t look like an email address.</p>}
      {state === "failed" && <p className={styles.error}>That didn&rsquo;t go through. Try again in a bit.</p>}
      <p className={styles.note}>
        You&rsquo;ll get one email now, and one when Gryt Cloud opens with your code. Every email has a link to leave the
        list. <Link to="/privacy">Privacy</Link>
      </p>
      <label className={styles.check}>
        <input type="checkbox" checked={news} onChange={(e) => setNews(e.target.checked)} />
        Also send me Gryt&rsquo;s news, a few times a year
      </label>
    </form>
  );
}

export function CloudPage() {
  return (
    <main>
      <section className={styles.hero}>
        <div className={`${styles.in} ${styles.heroGrid}`}>
          <div>
            <p className={styles.eyebrow}>Gryt Cloud · coming soon</p>
            <h1 className={styles.h1}>Your own Gryt server, always online</h1>
            <p className={styles.sub} style={{ fontSize: 18 }}>
              We run it for you. Your friends can hang out even when you&rsquo;re not on, and you never have to keep a
              computer running.
            </p>
            <Signup />
          </div>
          <figure className={styles.preview}>
            <img src="/home/client-live.poster.webp" alt="The Gryt app with a voice channel in use" />
            <figcaption>The same Gryt you know. The only difference is where the server runs.</figcaption>
          </figure>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.in}>
          <p className={styles.eyebrow}>Why let us run it</p>
          <h2 className={styles.h2}>Everything a server needs, done for you</h2>
          <dl className={styles.two}>
            {BENEFITS.map(([title, text]) => (
              <div key={title}>
                <dt className={styles.h3}>{title}</dt>
                <dd className={styles.text}>{text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.in} style={{ maxWidth: 760 }}>
          <p className={styles.eyebrow}>How it&rsquo;ll work</p>
          <h2 className={styles.h2}>Three steps, about a minute</h2>
          <ol className={styles.steps}>
            {STEPS.map((text, i) => (
              <li key={text}>
                <span className={styles.stepNo}>{i + 1}</span>
                <span className={styles.text}>{text}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={`${styles.section} ${styles.company}`}>
        <div className={styles.in}>
          <p className={styles.eyebrow}>For teams and companies</p>
          <h2 className={styles.h2}>Gryt Cloud for your company</h2>
          <p className={styles.sub}>
            The same hosting, set up for a team: a server in your region, your company&rsquo;s name on it, and a direct
            line to us. Tell us how many people and where they work, and we&rsquo;ll set it up with you.
          </p>
          <dl className={styles.two}>
            {COMPANY.map(([title, text, soon]) => (
              <div key={title}>
                <dt className={styles.h3}>
                  {title}
                  {soon && <span className={styles.soon}>On the roadmap</span>}
                </dt>
                <dd className={styles.text}>{text}</dd>
              </div>
            ))}
          </dl>
          <div className={styles.contact}>
            <a className={styles.primary} href={MAIL}>Talk to us</a>
            <span className={styles.note}>business@gryt.chat</span>
          </div>
          <p className={styles.note} style={{ marginTop: 20 }}>
            Already running Gryt yourself? Business push and support are available for your own server too.{" "}
            <a href={`${MAIL}?subject=Business%20push%20and%20support`}>Ask about a plan</a>.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.in} style={{ maxWidth: 760 }}>
          <p className={styles.eyebrow}>Questions</p>
          <h2 className={styles.h2}>Before you sign up</h2>
          <dl className={styles.faq}>
            <dt className={styles.h3}>When does it open?</dt>
            <dd className={styles.text}>When it&rsquo;s ready, and we don&rsquo;t have a date yet. You&rsquo;ll get an email when it does.</dd>
            <dt className={styles.h3}>What will it cost?</dt>
            <dd className={styles.text}>Prices aren&rsquo;t set yet. Whatever they end up being, people on the list get 50% off their first year.</dd>
            <dt className={styles.h3}>Can I still run it myself?</dt>
            <dd className={styles.text}>
              Yes, and that stays free. <Link to="/self-hosting">Self-hosting</Link> has the guide.
            </dd>
          </dl>
        </div>
      </section>
    </main>
  );
}

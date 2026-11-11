import { useState, type FormEvent } from "react";
import type { IconType } from "react-icons";
import {
  PiArrowsClockwiseDuotone,
  PiChatsCircleDuotone,
  PiGlobeDuotone,
  PiLightningDuotone,
  PiLockKeyDuotone,
  PiUsersThreeDuotone,
} from "react-icons/pi";
import { Link } from "react-router-dom";

import styles from "./CloudPage.module.css";

const WAITLIST = "https://reports.gryt.chat/v1/waitlist";

const BENEFITS: [IconType, string, string][] = [
  [PiUsersThreeDuotone, "Your friends, any time", "They can hang out, talk and play even when you're offline."],
  [PiArrowsClockwiseDuotone, "Always up to date", "Every new Gryt release goes on for you. You never run an old version."],
  [PiLightningDuotone, "Ready in a minute", "No ports to open, no router settings, no Docker. Pick a name and it's there."],
  [PiLockKeyDuotone, "You decide who gets in", "Invite only, ask to join, or open to anyone. Change it whenever you like."],
  [PiGlobeDuotone, "Your own domain", "Use the address we give you, or your own, like yourdomain.com. Invites use it too."],
  [PiChatsCircleDuotone, "Help from the people who build it", "Something wrong? You write to us, and we're the ones who fix it."],
];

const COMPARE: [string, string, string][] = [
  ["Where it runs", "On your own computer or server", "On ours"],
  ["Online when you're not", "Only while your machine is on", "Always"],
  ["Updates", "You install them", "Always up to date"],
  ["Setting up", "Ports, router, maybe Docker", "Pick a name"],
  ["Your own domain", "Yes", "Yes"],
  ["Phone notifications", "Yes", "Yes"],
  ["Help", "Docs and the community", "Straight from us"],
  ["Cost", "Free, forever", "From €4.99 a month"],
];

const MAIL = "mailto:business@gryt.chat";

const ROWS = ["People", "In voice at once", "Screen share", "Storage", "Largest file", "Support"];

/** Euros, VAT included. Yearly is about ten months, rounded to .99: two free. */
const PLANS = [
  { name: "Friends", for: "For a group of friends", month: 4.99, year: 49.99, rows: ["Best for 15", "8", "1080p 60", "10 GB", "100 MB", "Email"] },
  { name: "Community", for: "For a server people find and join", month: 19.99, year: 199.99, rows: ["Best for 150", "30", "1080p 60", "100 GB", "500 MB", "Email"] },
  { name: "Large", for: "For big communities and events", month: 99.99, year: 999.99, rows: ["Best for 1,000", "100", "1440p 60", "500 GB", "2 GB", "Priority"] },
  { name: "Company", for: "On a server of its own", month: 249, year: 2490, from: true, rows: ["As many as you need", "As you need", "4K 240", "As you need", "As you need", "Direct line"] },
];

const euro = (n: number) => `€${(Number.isInteger(n) ? String(n) : n.toFixed(2)).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

function Plans() {
  const [yearly, setYearly] = useState(true);
  return (
    <>
      <div className={styles.toggle} role="group" aria-label="Billing">
        <button type="button" aria-pressed={!yearly} onClick={() => setYearly(false)}>Monthly</button>
        <button type="button" aria-pressed={yearly} onClick={() => setYearly(true)}>
          Yearly <span className={styles.free}>· 2 months free</span>
        </button>
      </div>
      <div className={styles.plans}>
        {PLANS.map((p) => (
          <div key={p.name} className={p.name === "Community" ? `${styles.plan} ${styles.lead}` : styles.plan}>
            <p className={styles.planName}>{p.name}</p>
            <p className={styles.planFor}>{p.for}</p>
            <p className={styles.price}>
              {p.from && <small>From </small>}
              {euro(yearly ? Math.round((p.year / 12) * 100) / 100 : p.month)}
              <small> / month</small>
            </p>
            <p className={styles.billed}>
              {yearly ? `${euro(p.year)} billed yearly` : "Billed monthly"}
            </p>
            <dl className={styles.planRows}>
              {ROWS.map((r, i) => (
                <div key={r}>
                  <dt>{r}</dt>
                  <dd>{p.rows[i]}</dd>
                </div>
              ))}
            </dl>
            {p.from ? (
              <a className={styles.secondary} href={MAIL}>Talk to us</a>
            ) : (
              <a className={p.name === "Community" ? styles.primary : styles.secondary} href="#signup">Join the waitlist</a>
            )}
          </div>
        ))}
      </div>
      <p className={styles.includes}>
        Every plan is always online and always up to date, with your own domain, notifications on phones, and you deciding
        who gets in. The people count is a guide: nobody gets turned away. Prices include VAT.
      </p>
    </>
  );
}

const COMPANY: [string, string, boolean][] = [
  ["Priority support", "Your reports go to the front of the queue, and you can reach us directly.", false],
  ["Company sign-in", "Employees sign in with the account they already have, and directory groups become roles.", true],
  ["Meetings with a link", "Send a link. Customers join in the browser with just a name and only see the call.", true],
  ["Guests", "Invite customers into one channel without giving them the rest of the company.", true],
];


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
    <form id="signup" className={styles.signup} onSubmit={(e) => void submit(e)}>
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
          <p className={styles.eyebrow}>A better way to run a server</p>
          <h2 className={styles.h2}>Everything a server needs, done for you</h2>
          <dl className={styles.six}>
            {BENEFITS.map(([Icon, title, text]) => (
              <div key={title}>
                <span className={styles.icon} aria-hidden="true">
                  <Icon size={20} />
                </span>
                <dt className={styles.h3}>{title}</dt>
                <dd className={styles.text}>{text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.in}>
          <p className={styles.eyebrow}>Plans</p>
          <h2 className={styles.h2}>Pick the size that fits</h2>
          <p className={styles.sub}>The plans are the same Gryt. Only the size changes. Your friends never pay, and the waitlist gets 50% off the first year.</p>
          <Plans />
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.in}>
          <p className={styles.eyebrow}>Gryt Cloud or your own machine</p>
          <h2 className={styles.h2}>Same Gryt, either way</h2>
          <p className={styles.sub}>Running it yourself stays free. Gryt Cloud is for when you&rsquo;d rather not keep a machine on.</p>
          <div className={styles.tableWrap}>
            <table className={styles.compare}>
              <thead>
                <tr>
                  <td />
                  <th scope="col">Run it yourself</th>
                  <th scope="col" className={styles.us}>Gryt Cloud</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map(([row, self, cloud]) => (
                  <tr key={row}>
                    <th scope="row">{row}</th>
                    <td>{self}</td>
                    <td className={styles.us}>{cloud}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.in}>
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
        <div className={styles.in}>
          <p className={styles.eyebrow}>Questions</p>
          <h2 className={styles.h2}>Before you sign up</h2>
          <dl className={styles.faq}>
            <dt className={styles.h3}>Do my friends need to pay?</dt>
            <dd className={styles.text}>No. Only the person who owns the server pays. Everyone else joins with an invite, the same as any Gryt server.</dd>
            <dt className={styles.h3}>When does it open?</dt>
            <dd className={styles.text}>When it&rsquo;s ready, and we don&rsquo;t have a date yet. You&rsquo;ll get an email when it does.</dd>
            <dt className={styles.h3}>What will it cost?</dt>
            <dd className={styles.text}>From €4.99 a month, and two months free on yearly billing. People on the list get 50% off their first year, on top of that.</dd>
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

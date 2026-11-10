import { Link } from "react-router-dom";
import { PiCalendarDotsDuotone, PiFolderOpenDuotone, PiKey, PiKeyDuotone, PiUserPlusDuotone } from "react-icons/pi";

import styles from "./BusinessPage.module.css";

const MAIL = "mailto:business@gryt.chat";
const EARLY = "mailto:business@gryt.chat?subject=Early%20access";

const GET = [
  { img: "/home/create-server.poster.webp", alt: "A Gryt server set up and ready", title: "A server in your region", text: "We set it up close to your team, keep it updated and back it up. Your IT team has no servers to maintain." },
  { img: "/home/screen-share.poster.webp", alt: "A screen share in a Gryt voice channel", title: "Support from the people who build it", text: "Your bug reports go to the front of the queue, and you get a direct line to us for anything about running Gryt." },
  { img: "/home/client-live.poster.webp", alt: "The Gryt app on a desktop", title: "Notifications on every phone", text: "Push notifications on iPhone and Android are included, so mentions and calls reach your employees wherever they are." },
];

const STEPS = [
  ["Tell us about your team", "How many employees, and where they work."],
  ["We set up your server", "In the region closest to your team, with your company's name and settings."],
  ["Your team joins", "Employees download Gryt or open it in the browser, and join with a single invite link."],
];

function SignIn() {
  return (
    <div className={styles.mock} aria-hidden="true">
      <span className={styles.mockMuted} style={{ textAlign: "center" }}>Sign in to Brattholm AS</span>
      <span className={styles.mockButton}><PiKey size={16} />Continue with company account</span>
      <span className={styles.mockChips}><span>Engineering</span><span>Support</span><span>Sales</span></span>
    </div>
  );
}

function Meeting() {
  return (
    <div className={styles.mock} aria-hidden="true">
      <span className={styles.event}>
        <span className={styles.mono} style={{ color: "var(--accent-light)" }}>10:00</span>
        <span className={styles.eventText}><b>Customer demo</b><span className={styles.mockMuted}>Voice and chat · 3 guests</span></span>
      </span>
      <span className={styles.link}><span className={styles.mono}>gryt.chat/m/k4p-2xq</span><span className={styles.copy}>Copy link</span></span>
      <span className={styles.mockMuted} style={{ textAlign: "center" }}>Guests join in the browser with just a name</span>
    </div>
  );
}

function Files() {
  const files = [["Q4 pricing.pdf", "2.1 MB"], ["Onboarding guide.docx", "340 KB"], ["Release checklist.md", "8 KB"]];
  return (
    <div className={styles.mock} aria-hidden="true">
      <span className={styles.mockMuted}># support · Files</span>
      {files.map(([name, size]) => (
        <span key={name} className={styles.file}><span>{name}</span><span className={styles.mono}>{size}</span></span>
      ))}
    </div>
  );
}

function Guests() {
  const people: [string, boolean][] = [["Mira from Support", false], ["Jon from Fjordlight", true], ["Lena from Fjordlight", true]];
  return (
    <div className={styles.mock} aria-hidden="true">
      <span className={styles.mockMuted}># customer-fjordlight</span>
      {people.map(([name, guest]) => (
        <span key={name} className={styles.person}>
          <span className={styles.initial}>{name[0]}</span>{name}
          {guest && <span className={styles.guest}>Guest</span>}
        </span>
      ))}
    </div>
  );
}

const COMING = [
  { Mock: SignIn, Icon: PiKeyDuotone, title: "Company sign-in", text: "Employees sign in with the account they already have, and groups from your directory become roles." },
  { Mock: Meeting, Icon: PiCalendarDotsDuotone, title: "Meetings with a link", text: "Send a link like Google Meet. Customers join in the browser with just a name, and only see the call and its chat." },
  { Mock: Files, Icon: PiFolderOpenDuotone, title: "Files in one place", text: "Every file shared in a channel, in one list you can search." },
  { Mock: Guests, Icon: PiUserPlusDuotone, title: "Guests", text: "Invite customers into a channel without giving them the rest of the company." },
];

/** v3 of the /business design: hosted Gryt for companies, and what's coming for them. */
export function BusinessPage() {
  return (
    <main>
      <section className={styles.hero}>
        <div className={styles.in}>
          <p className={styles.eyebrow}>For businesses</p>
          <h1 className={styles.h1}>Gryt for your company, hosted and supported by us.</h1>
          <p className={styles.sub} style={{ fontSize: 17 }}>
            We host your Gryt server in the region you choose, keep it patched and up to date, and give you direct support from the engineers who build Gryt. Your employees only need to open the app.
          </p>
          <div className={styles.actions}>
            <a className={styles.primary} href={EARLY}>Get early access</a>
            <a className={styles.secondary} href={MAIL}>Talk to us</a>
          </div>
          <p className={styles.note}>Official hosting opens to companies on the early access list first.</p>
        </div>
      </section>

      <section className={styles.section} style={{ borderTop: "none", paddingTop: 72 }}>
        <div className={styles.in}>
          <p className={styles.eyebrow}>What you get</p>
          <h2 className={styles.h2}>A chat platform your company owns, without the upkeep</h2>
          <div className={styles.three}>
            {GET.map((g) => (
              <div key={g.title} className={styles.stack}>
                <img className={styles.shot} src={g.img} alt={g.alt} />
                <h3 className={styles.h3}>{g.title}</h3>
                <p className={styles.text}>{g.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.in} style={{ maxWidth: 760 }}>
          <p className={styles.eyebrow}>How it works</p>
          <h2 className={styles.h2}>From signing up to talking</h2>
          <ol className={styles.steps}>
            {STEPS.map(([title, text], i) => (
              <li key={title}>
                <span className={styles.stepNo}>{i + 1}</span>
                <span className={styles.stepText}><span className={styles.h3}>{title}</span><span className={styles.text}>{text}</span></span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.in}>
          <p className={styles.eyebrow}>On the roadmap</p>
          <h2 className={styles.h2}>Coming for businesses</h2>
          <p className={styles.sub}>
            What we're building next for companies, in the order we're building it. <Link to="/features">See the whole roadmap</Link>.
          </p>
          <div className={styles.four}>
            {COMING.map(({ Mock, Icon, title, text }) => (
              <div key={title} className={styles.stack}>
                <Mock />
                <span className={styles.comingHead}><span className={styles.icon}><Icon size={20} /></span><span className={styles.h3}>{title}</span></span>
                <span className={styles.text}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={`${styles.in} ${styles.split}`} style={{ alignItems: "flex-start" }}>
          <div style={{ flex: "1 1 460px" }}>
            <p className={styles.eyebrow}>Already running it yourself?</p>
            <h2 className={styles.h2}>Business push and support for your own server</h2>
            <p className={styles.sub}>
              Phone notifications for every Gryt server go through our push service. Business servers get push and the same direct support on a plan of their own.
            </p>
          </div>
          <a className={styles.secondary} href={MAIL}>Ask about a plan</a>
        </div>
      </section>

      <section className={styles.section}>
        <div className={`${styles.in} ${styles.split}`} style={{ alignItems: "center" }}>
          <div>
            <h2 className={styles.h2}>Bring Gryt to your company</h2>
            <p className={styles.sub}>Write to <a href={MAIL}>business@gryt.chat</a>, or get on the early access list.</p>
          </div>
          <a className={styles.primary} href={EARLY}>Get early access</a>
        </div>
      </section>
    </main>
  );
}

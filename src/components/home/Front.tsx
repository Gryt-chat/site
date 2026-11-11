import { Link } from "react-router-dom";

import { COVERED_BY_SPONSORS_USD, RUNNING_COSTS } from "../../data/runningCosts";
import { posts } from "../../lib/blog";
import { listReleases } from "../../lib/changelog";
import { dayMonthYear } from "../../lib/formatDate";
import { PiBookOpenDuotone, PiBugDuotone, PiChatsCircleDuotone, PiGitBranchDuotone } from "react-icons/pi";
import styles from "./Front.module.css";

const DAY_MONTH = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", timeZone: "UTC" });

function Head({ eyebrow, title, more }: { eyebrow: string; title: string; more?: { label: string; to: string } }) {
  return (
    <>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <div className={styles.head}>
        <h2 className={styles.h2}>{title}</h2>
        {more && <Link to={more.to}>{more.label}</Link>}
      </div>
    </>
  );
}

export function News() {
  const [first, ...rest] = posts.slice(0, 4);
  if (!first) return null;
  return (
    <section className={styles.section} style={{ borderTop: "none" }}>
      <div className={styles.in}>
        <Head eyebrow="Blog" title="Latest news" more={{ label: "All posts", to: "/blog" }} />
        <div className={styles.news}>
          <Link className={`${styles.card} ${styles.newsBig}`} to={`/blog/${first.slug}`}>
            {first.frontmatter.image && <img src={first.frontmatter.image} alt="" />}
            <span className={styles.newsBigText}>
              <span className={styles.date}>{dayMonthYear(first.frontmatter.date)}</span>
              <span className={styles.newsBigTitle}>{first.frontmatter.title}</span>
            </span>
          </Link>
          {rest.map((p) => (
            <Link key={p.slug} className={`${styles.card} ${styles.newsRow}`} to={`/blog/${p.slug}`}>
              {p.frontmatter.image && <img src={p.frontmatter.image} alt="" />}
              <span className={styles.newsRowText}>
                <span className={styles.newsRowTitle}>{p.frontmatter.title}</span>
                <span className={styles.date}>{dayMonthYear(p.frontmatter.date)}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Releases() {
  const latest = listReleases("app")
    .filter((r) => !r.channel && r.line)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 4);
  return (
    <section className={styles.section}>
      <div className={styles.in}>
        <Head eyebrow="Releases" title="What changed lately" more={{ label: "Full changelog", to: "/changelog" }} />
        <div className={styles.releases}>
          {latest.map((r) => (
            <Link key={r.version} className={styles.release} to={`/changelog/${r.version}`}>
              <span className={styles.version}>{r.version}</span>
              <span className={styles.relDate}>{DAY_MONTH.format(new Date(r.date))}</span>
              <span className={styles.relText}>{r.line}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

const WHY = [
  ["Your server, your disk", "Make a server from the app, or put it on a machine that stays on. The messages live there, and nobody needs an account with us."],
  ["Voice built from scratch", "Its own voice engine and media server, and screen share at up to 4K and 240 fps."],
  ["Bring what you already have", "Import your emoji and your Discord DMs, then pick one of 47 themes."],
];

export function Why() {
  return (
    <section className={styles.section}>
      <div className={styles.in}>
        <p className={styles.eyebrow}>Why Gryt</p>
        <h2 className={styles.h2}>A different way to run a chat</h2>
        <p className={styles.sub}>
          Free and open source, with nobody selling ads on it. <Link to="/features">See every feature</Link>.
        </p>
        <div className={styles.why}>
          {WHY.map(([title, text]) => (
            <div key={title}>
              <h3 className={styles.h3}>{title}</h3>
              <p className={styles.whyText}>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const INVOLVED = [
  { Icon: PiChatsCircleDuotone, title: "Join our server", text: "Talk to the people who make it, in Gryt.", href: "https://gryt.chat/community" },
  { Icon: PiBugDuotone, title: "Report a bug", text: "From inside the app, or on GitHub.", href: "https://github.com/Gryt-chat/gryt/issues" },
  { Icon: PiGitBranchDuotone, title: "Contribute", text: "Every repository is public on GitHub.", href: "https://github.com/Gryt-chat" },
  { Icon: PiBookOpenDuotone, title: "Read the docs", text: "Hosting, bots, plugins and the APIs.", href: "https://docs.gryt.chat/docs" },
];

export function Involved() {
  return (
    <section className={styles.section}>
      <div className={styles.in}>
        <p className={styles.eyebrow}>Community</p>
        <h2 className={styles.h2}>Get involved</h2>
        <p className={styles.sub}>Gryt is made by one person and a few people who keep showing up. There's room for more.</p>
        <div className={styles.involved}>
          {INVOLVED.map(({ Icon, title, text, href }) => (
            <a key={title} className={`${styles.card} ${styles.involve}`} href={href} target="_blank" rel="noreferrer">
              <span className={styles.icon}><Icon size={22} /></span>
              <span className={styles.involveTitle}>{title}</span>
              <span className={styles.involveText}>{text}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

const usd = (n: number) => "$" + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

/** On the page ground with a rule and no card fill, per design.md. */
export function SponsorBar() {
  const yearly = RUNNING_COSTS.reduce((sum, c) => sum + c.usd, 0);
  const share = Math.min(100, (COVERED_BY_SPONSORS_USD / yearly) * 100);
  return (
    <section className={styles.section}>
      <div className={`${styles.in} ${styles.sponsorRow}`}>
        <div className={styles.sponsorText}>
          <p className={styles.eyebrow}>Sponsors</p>
          <h2 className={styles.h2}>Gryt is free, and sponsors keep it running</h2>
          {/* An empty bar reads as nobody cares; until someone sponsors monthly, say what it costs instead. */}
          {COVERED_BY_SPONSORS_USD > 0 ? (
            <>
              <div className={styles.goal}>
                <span>Covered by monthly sponsors</span>
                <span className={styles.goalAmount}>{usd(COVERED_BY_SPONSORS_USD)} of {usd(yearly)} a year</span>
              </div>
              <div className={styles.bar} aria-hidden="true"><span style={{ width: `${share}%` }} /></div>
            </>
          ) : (
            <p className={styles.sub}>Running Gryt costs about {usd(yearly)} a year. Nobody sponsors it monthly yet, so you&rsquo;d be the first.</p>
          )}
        </div>
        <Link className={styles.sponsorBtn} to="/sponsor">{COVERED_BY_SPONSORS_USD > 0 ? "Sponsor Gryt" : "Be the first sponsor"}</Link>
      </div>
    </section>
  );
}
